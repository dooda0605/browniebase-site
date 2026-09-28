// 샵 관리 어드민 1단계 (2026-09-28) — inbox.html 「샵」 칩
//
// 서버 계약: underwater_visibility/docs/agent_team/research/11_shop_admin_phase1_prep.md
//            · supabase/migrations/20260928_shop_admin_phase1.sql (admin_* RPC) · supabase/functions/admin-evidence
// 설계: research/09_shop_admin_design.md (M1 목록·상세 · M2 인증 대기열 · M3 샵 채팅)
//
// inbox.html 의 전역(SUPABASE_URL · H · H_RET · api · esc · $ · kst · ago · showErr · source · setSource)을 그대로 쓴다.
//   인증·헤더를 따로 두지 않는 이유: 토큰 처리(공백 제거·localStorage 공용)가 두 벌이 되면 한쪽만 고쳐진다.
//
// ⚠ 지키는 것
//   - admin_* RPC 는 토큰이 틀리면 HTTP 200 {ok:false, reason:'forbidden'} 을 준다. 채팅(message_threads RLS)은 에러 대신 0행을 준다.
//     → forbidden 은 항상 「토큰 확인」으로 띄우고, 채팅 목록은 샵 목록 RPC 가 통과한 뒤에만 「없음」이라고 말한다(0행 오독 방지).
//   - 예보·등급은 어디에도 그리지 않는다(샵 콘텐츠에 우리 등급 결합 금지 — 메모리 feedback_shop_content_no_forecast_coupling).
//   - 증빙 signed URL(120초)은 상태에 저장하지 않는다. [증빙 보기]를 누를 때마다 admin-evidence 를 부른다 —
//     그래야 열람할 때마다 감사 로그(evidence_view)가 남고, 만료된 링크가 화면에 남지 않는다.
//   - 서버 값·사용자 입력은 전부 esc() 또는 textContent 로만 그린다.
//   - 정지해도 기존 예약은 유지된다(사장님 결정 8) — 정지 폼 안내 문구에 그대로 적는다.
(function () {
'use strict';

const EVIDENCE_FN = SUPABASE_URL + '/functions/v1/admin-evidence';
const POLL_MS = 30000;   // 샵 채팅 30초 폴링(설계 M3 — 웹 푸시 없음, 운영자 폰 푸시는 서버 트리거가 보낸다)

// ── 공통 ─────────────────────────────────────────────────────────────────
class Forbidden extends Error {}
class Missing extends Error {}
const s_ = v => esc(v == null ? '' : String(v));           // inbox 의 esc 는 숫자를 못 받는다
const when = iso => iso ? kst(iso) : '—';
const day = iso => iso ? String(iso).slice(0, 10) : '—';
const won = n => (n == null ? '—' : Number(n).toLocaleString() + '원');

async function rpc(fn, args) {
  let j;
  try {
    j = await api('rpc/' + fn, { method: 'POST', headers: H, body: JSON.stringify(args || {}) });
  } catch (e) {
    // 마이그레이션 적용 전이면 PostgREST 가 404(PGRST202 함수 없음)를 준다
    if (/^404\b/.test(e.message) || /PGRST202/.test(e.message)) throw new Missing(fn);
    throw e;
  }
  if (j && j.ok === false && j.reason === 'forbidden') throw new Forbidden(fn);
  return j;
}
function errText(e) {
  if (e instanceof Forbidden) return '토큰 확인 — 어드민 토큰이 거부됐습니다(forbidden). 「없음」이 아니라 권한 문제입니다. 링크의 ?at= 값을 확인하세요.';
  if (e instanceof Missing) return '서버 미적용 — ' + e.message + ' 가 아직 없습니다(샵 관리 마이그레이션 적용 전).';
  return e.message || String(e);
}
const errBox = e => '<div class="err">' + s_(errText(e)) + '</div>';

const REASON = {
  not_found: '대상을 찾지 못했습니다.', reason_required: '사유를 적어 주세요.', bad_action: '잘못된 동작입니다.',
  too_long: '글이 너무 깁니다.', already_suspended: '이미 정지된 계정입니다.', not_suspended: '정지 상태가 아닙니다.',
  bad_value: '값이 올바르지 않습니다.', no_change: '바뀐 것이 없습니다.', empty: '메모가 비었습니다.',
  bad_state: '잘못된 상태 값입니다.', bad_kind: '잘못된 인증 종류입니다.',
  reason_code_required: '반려 사유를 고르세요.',
  bad_reason_code: '이 인증에는 쓸 수 없는 사유입니다(「사업자 아님」은 사업자 인증 전용).',
  reason_detail_required: '「기타」는 사유를 직접 적어야 합니다.', reject_reason_required: '반려 사유가 필요합니다.',
  doc_expired: '만료일이 오늘이거나 지났습니다 — 만료일을 확인하세요.',
};
const rtext = j => (j && (REASON[j.reason] || j.reason)) || '알 수 없는 응답';

const STATE_KO = { signed_up: '가입', profile_draft: '작성 중', under_review: '심사 대기', approved: '공개',
                   rejected: '반려', suspended: '정지' };
const VSTATE_KO = { pending: '대기', approved: '승인', rejected: '반려' };
const KIND_KO = { business: '사업자', cert: '자격', insurance: '보험' };
const ROUTE_KO = { overseas: '해외', domestic: '국내 수동' };
const SHOPKIND_KO = { dive: '다이브', surf: '서핑' };
const MEM_SRC_KO = { trial: '무료 체험', paid: '결제', grant: '운영자 부여', pilot: '파일럿' };
const ORDER_KO = { pending: '대기', paid: '결제', failed: '실패', canceled: '취소' };
// 반려 템플릿 6종(사장님 결정 10). 코드는 admin_review_verification 의 목록과 같아야 한다.
const REJECT = [['blurry', '흐림'], ['name_mismatch', '이름 불일치'], ['expired', '만료'],
                ['not_business', '사업자 아님'], ['translation_needed', '번역 필요'], ['other', '기타']];
const ACTION_KO = { shop_suspend: '정지', shop_restore: '복구', shop_set_test: '예시 플래그', shop_note: '메모',
                    application_handled: '신청 처리', application_reopened: '신청 다시 열기',
                    verification_approve: '인증 승인', verification_reject: '인증 반려', evidence_view: '증빙 열람' };
// 검수 대조값 — 나머지 키는 원래 이름 그대로 보여준다(서버가 키를 늘려도 안 사라지게).
const PAYLOAD_KO = { country: '나라', name: '상호·성명', reg_no: '등록번호', ceo: '대표자', address: '등록 주소(비공개)',
                     entity: '구분', doc_expires: '서류 유효기간', submitted_at: '제출 시각', biz_no: '사업자번호',
                     open_date: '개업일', org: '단체', level: '등급', no: '자격번호', expires: '만료일', insurer: '보험사' };
const PAYLOAD_SKIP = ['doc_paths', 'prev_reject_reason', 'reg_no_norm'];
const ENTITY_KO = { sole_proprietor: '개인사업자', company: '법인' };

// ── 상태 ─────────────────────────────────────────────────────────────────
let active = false, view = 'shops';
let shops = null, shopsErr = null;
let queue = null, qState = 'pending', pendingN = null;
let threads = null, prevs = {};
let apps = null, appsAll = false;
let filter = 'todo', query = '';
let sel = null;                     // 목록에서 고른 것: 'p:<partner>' · 'v:<partner>:<kind>' · 't:<thread>' · 'a:<app>'
let openThreadId = null, openMsgN = 0;
let pollTimer = null, deepDone = false;
let appsUnhandled = null;

// ── 진입·이탈 ─────────────────────────────────────────────────────────────
async function enter() {
  active = true;
  const p = new URLSearchParams(location.search);
  let deep = null;
  if (!deepDone && p.get('tab') === 'shops') {
    deepDone = true;
    if (p.get('verify')) deep = { verify: p.get('verify'), kind: p.get('kind') || 'business' };
    else if (p.get('partner')) deep = { partner: p.get('partner') };
  }
  view = deep && deep.verify ? 'verify' : 'shops';
  renderShell();
  await loadCounts();
  if (deep && deep.verify) {
    await loadQueue();
    await openVerifyDeep(deep.verify, deep.kind);
  } else {
    renderView();
    if (deep && deep.partner) openShop(deep.partner);
  }
  startPoll();
}
function leave() { active = false; stopPoll(); openThreadId = null; sel = null; }
async function reload() {
  shops = null; queue = null; threads = null; apps = null;
  await loadCounts();
  renderView();
}

// 할 일 수(칩·하위 탭 배지). 샵 목록 = 채팅 미답 합계도 들어 있다.
async function loadCounts() {
  try {
    const j = await rpc('admin_shop_list', { p_include_test: true, p_limit: 500 });
    shops = (j && j.shops) || []; shopsErr = null;
  } catch (e) { shops = null; shopsErr = e; }
  try {
    const j = await rpc('admin_verification_queue', { p_state: 'pending', p_limit: 300 });
    pendingN = ((j && j.items) || []).length;
    if (qState === 'pending') queue = (j && j.items) || [];
  } catch (e) { pendingN = null; }
  try {
    const j = await rpc('admin_application_list', { p_include_handled: false, p_limit: 200 });
    if (!appsAll) apps = (j && j.applications) || [];
    appsUnhandled = ((j && j.applications) || []).length;
  } catch (e) { appsUnhandled = null; }
  paintCounts();
}
function chatUnread() {
  return (shops || []).reduce((n, x) => n + ((x.chat && x.chat.operator_unread) || 0), 0);
}
function paintCounts() {
  const c = $('cShops');
  if (c) {
    const n = (pendingN || 0) + chatUnread();
    c.textContent = shops === null && pendingN === null ? '·' : n;
  }
  const set = (id, v) => { const el = $(id); if (el) el.textContent = v == null ? '' : v; };
  set('saNV', pendingN == null ? '' : pendingN);
  set('saNC', shops === null ? '' : chatUnread());
  set('saNA', appsUnhandled == null ? '' : appsUnhandled);
}

// ── 목록 틀 ───────────────────────────────────────────────────────────────
function renderShell() {
  $('list').innerHTML =
    '<div class="sa-nav">'
    + [['shops', '샵', ''], ['verify', '인증', 'saNV'], ['chat', '샵 채팅', 'saNC'], ['apps', '신청', 'saNA']]
        .map(([k, l, cid]) => '<button class="chip' + (view === k ? ' on' : '') + '" data-v="' + k + '">' + l
          + (cid ? ' <span id="' + cid + '"></span>' : '') + '</button>').join('')
    + '</div><div id="saSub"></div><div id="saList"><div class="empty">불러오는 중…</div></div>';
  [...document.querySelectorAll('.sa-nav [data-v]')].forEach(b => b.onclick = () => switchView(b.dataset.v));
  paintCounts();
}
function switchView(v) {
  view = v; sel = null; openThreadId = null;
  document.body.classList.remove('detail-open');
  $('detail').innerHTML = '<div class="empty">왼쪽에서 고르세요</div>';
  [...document.querySelectorAll('.sa-nav [data-v]')].forEach(b => b.classList.toggle('on', b.dataset.v === v));
  renderView();
}
async function renderView() {
  if (!active) return;
  const sub = $('saSub'), list = $('saList');
  if (!sub || !list) return;
  if (view === 'shops') return renderShops();
  if (view === 'verify') { if (!queue) await loadQueue(); return renderQueue(); }
  if (view === 'chat') { await loadThreads(); return renderThreads(); }
  if (view === 'apps') { if (!apps) await loadApps(); return renderApps(); }
}
function markSel(key) {
  sel = key;
  [...document.querySelectorAll('#saList .row')].forEach(r => r.classList.toggle('sel', r.dataset.key === key));
}
function openDetail(html) {
  document.body.classList.add('detail-open');
  $('detail').innerHTML = '<div class="pad"><button class="back" id="saBack">← 목록</button>' + html + '</div>';
  $('saBack').onclick = () => document.body.classList.remove('detail-open');
}

// ═════════════════════════════════════════════════════════════════════════
// 1) 샵 목록
// ═════════════════════════════════════════════════════════════════════════
const REVIEW_STATES = ['signed_up', 'profile_draft', 'under_review'];
const FILTERS = [
  ['todo', '할 일 있음', x => (x.pending_verifications || 0) > 0 || ((x.chat && x.chat.operator_unread) || 0) > 0 || !!x.needs_geocode],
  ['public', '공개 중', x => x.state === 'approved' && !x.is_test],
  ['review', '심사 대기', x => REVIEW_STATES.includes(x.state)],
  ['suspended', '정지', x => x.state === 'suspended'],
  ['test', '예시', x => !!x.is_test],
  ['all', '전체', () => true],
];
function renderShops() {
  $('saSub').innerHTML = '<div class="sa-bar">'
    + FILTERS.map(([k, l]) => '<button class="chip' + (filter === k ? ' on' : '') + '" data-f="' + k + '">' + l + '</button>').join('')
    + '<input id="saQ" type="search" placeholder="상호 검색" value="' + s_(query) + '"></div>';
  [...document.querySelectorAll('#saSub [data-f]')].forEach(b => b.onclick = () => { filter = b.dataset.f; renderShops(); });
  const qi = $('saQ');
  qi.oninput = () => { query = qi.value; paintShopRows(); };
  paintShopRows();
}
function paintShopRows() {
  const list = $('saList');
  if (shopsErr) { list.innerHTML = errBox(shopsErr); return; }
  if (!shops) { list.innerHTML = '<div class="empty">불러오는 중…</div>'; return; }
  const f = (FILTERS.find(x => x[0] === filter) || FILTERS[5])[2];
  const qq = query.trim().toLowerCase();
  const rows = shops.filter(f).filter(x => !qq || String(x.shop_name || '').toLowerCase().includes(qq));
  if (!rows.length) {
    list.innerHTML = '<div class="empty">' + (shops.length ? '조건에 맞는 샵 없음' : '등록된 파트너 샵 0곳') + '</div>';
    return;
  }
  list.innerHTML = rows.map(x => {
    const b = x.badges || {}, un = (x.chat && x.chat.operator_unread) || 0, m = x.membership;
    const key = 'p:' + x.partner_id;
    return '<div class="row' + (sel === key ? ' sel' : '') + '" data-key="' + s_(key) + '" data-pid="' + s_(x.partner_id) + '">'
      + '<div class="top">'
      + (x.pending_verifications ? '<span class="badge">인증 ' + s_(x.pending_verifications) + '</span>' : '')
      + (un ? '<span class="badge">채팅 ' + s_(un) + '</span>' : '')
      + '<span class="badge ' + (x.state === 'approved' ? 'ok' : x.state === 'suspended' ? '' : 'res') + '">' + s_(STATE_KO[x.state] || x.state) + '</span>'
      + (x.is_test ? '<span class="badge res">예시</span>' : '')
      + '<b class="sa-name">' + s_(x.shop_name || '(상호 없음)') + '</b>'
      + '<span class="time">' + s_(x.created_at ? ago(x.created_at) : '') + '</span></div>'
      + '<div class="prev">'
      + [b.business ? '✓사업자' : '사업자 ✗', b.cert ? '✓자격' : '', b.insurance ? '✓보험' : ''].filter(Boolean).join(' ')
      + (x.country ? ' · ' + s_(x.country) : '')
      + (x.shop_kind ? ' · ' + s_(SHOPKIND_KO[x.shop_kind] || x.shop_kind) : '')
      + (x.staff_n ? ' · 직원 ' + s_(x.staff_n) : '')
      + (m ? ' · ' + s_(MEM_SRC_KO[m.source] || m.source) + ' ~' + s_(day(m.ends_at)) : ' · 멤버십 없음')
      + (x.needs_geocode ? ' · ⚠ 좌표 없음' : '')
      + '</div></div>';
  }).join('');
  [...list.querySelectorAll('[data-pid]')].forEach(el => el.onclick = () => openShop(el.dataset.pid));
}

// ═════════════════════════════════════════════════════════════════════════
// 2) 샵 상세 — 계정 · 인증 · 멤버십 · 게시물 · 응답 · 기록/메모
// ═════════════════════════════════════════════════════════════════════════
const DTABS = [['acct', '계정'], ['verif', '인증'], ['mem', '멤버십'], ['posts', '게시물'], ['resp', '응답'], ['log', '기록·메모']];
let detail = null, dtab = 'acct';

async function openShop(pid, tab) {
  markSel('p:' + pid);
  dtab = tab || 'acct';
  openDetail('<div class="empty">불러오는 중…</div>');
  try {
    const j = await rpc('admin_shop_detail', { p_partner: pid });
    if (!j || !j.ok) { openDetail('<div class="err">' + s_(rtext(j)) + '</div>'); return; }
    detail = j;
    renderShopDetail();
  } catch (e) { openDetail(errBox(e)); }
}
function renderShopDetail() {
  const d = detail, sh = d.shop || {};
  const owner = (d.accounts || []).find(a => a.id === d.owner_partner_id) || (d.accounts || [])[0] || {};
  const head = '<div class="card" style="margin-top:10px"><h3>' + s_(SHOPKIND_KO[sh.kind] || sh.kind || '') + ' · ' + s_(sh.source || '') + '</h3>'
    + '<div class="kv"><b style="font-size:15px">' + s_(sh.name || '(상호 없음)') + '</b> '
    + '<span class="badge ' + (owner.state === 'approved' ? 'ok' : owner.state === 'suspended' ? '' : 'res') + '">' + s_(STATE_KO[owner.state] || owner.state || '') + '</span>'
    + (owner.is_test ? ' <span class="badge res">예시</span>' : '') + '</div>'
    + '<div class="sa-tabs">' + DTABS.map(([k, l]) => '<button class="chip' + (dtab === k ? ' on' : '') + '" data-dt="' + k + '">' + l + '</button>').join('') + '</div></div>'
    + '<div id="saDT"></div>';
  openDetail(head);
  [...document.querySelectorAll('[data-dt]')].forEach(b => b.onclick = () => {
    dtab = b.dataset.dt;
    [...document.querySelectorAll('[data-dt]')].forEach(x => x.classList.toggle('on', x.dataset.dt === dtab));
    paintDTab();
  });
  paintDTab();
}
function paintDTab() {
  const d = detail, box = $('saDT');
  if (!box) return;
  const owner = (d.accounts || []).find(a => a.id === d.owner_partner_id) || (d.accounts || [])[0] || {};
  const ownerId = d.owner_partner_id || owner.id;
  let h = '';
  if (dtab === 'acct') {
    const sh = d.shop || {}, c = d.contact || {};
    h += '<div class="card"><h3>샵</h3>'
      + '<div class="kv">주소: ' + s_(sh.address || '—') + '</div>'
      + (sh.needs_geocode ? '<div class="kv" style="color:var(--warn)">⚠ 좌표 없음(needs_geocode) — 지역 목록·지도에 안 잡힙니다. spot-map 에서 보정</div>'
                          : '<div class="kv" style="color:var(--dim)">좌표 ' + s_(sh.lat) + ', ' + s_(sh.lon) + '</div>')
      + '<div class="kv">전화: ' + s_(c.phone_masked || '—') + (c.phone_public ? ' · 앱 공개' : ' · 비공개')
      + (c.phone_hours ? ' · ' + s_(c.phone_hours) : '') + '</div>'
      + '<div class="kv" style="color:var(--dim)">샵 id ' + s_(sh.id) + '</div></div>';
    h += '<div class="card"><h3>계정 (' + s_((d.accounts || []).length) + ')</h3>'
      + (d.accounts || []).map(a => {
          const b = a.badges || {};
          return '<div class="kv">' + (a.role === 'owner' ? '👑 대표' : '직원') + ' · <b>' + s_(STATE_KO[a.state] || a.state) + '</b>'
            + (a.is_test ? ' · 예시' : '') + ' · ' + [b.business ? '✓사업자' : '', b.cert ? '✓자격' : '', b.insurance ? '✓보험' : ''].filter(Boolean).join(' ')
            + '<br><span style="color:var(--dim);font-size:11.5px">' + s_(a.id) + ' · 가입 ' + s_(when(a.created_at)) + '</span></div>';
        }).join('') + '</div>';
    // 정지·복구 — 샵 단위 조치라 대표 계정에 건다(partner_visible 이 대표 정지면 직원 글도 숨긴다).
    const susp = owner.state === 'suspended';
    h += '<div class="card"><h3>' + (susp ? '정지 해제(복구)' : '정지') + '</h3>'
      + '<div class="kv" style="color:var(--dim)">' + (susp
          ? '복구하면 대표 계정 사업자 배지가 있으면 「공개」, 없으면 「심사 대기」로 돌아갑니다.'
          : '정지하면 샵과 모집글이 앱·웹에서 보이지 않습니다. <b>이미 받은 예약은 그대로 유지됩니다.</b> 사유는 샵 채팅으로 통지됩니다.') + '</div>'
      + '<textarea id="saStReason" rows="2" maxlength="500" placeholder="' + (susp ? '메모(선택) — 통지에 함께 나갑니다' : '정지 사유(필수) — 샵에게 그대로 보입니다') + '"></textarea>'
      + '<label class="sa-chk"><input type="checkbox" id="saStNotify" checked> 샵 채팅으로 통지</label>'
      + '<div class="resbtns"><button id="saStGo" class="' + (susp ? '' : 'danger') + '">' + (susp ? '복구' : '정지') + '</button></div>'
      + '<div id="saStMsg" class="kv"></div></div>';
    // 테스트(예시) 플래그 — is_test 면 「예시 샵 · 예약 불가」 + 지표 제외. 실제 샵에 켜면 그 샵 예약이 막힌다.
    h += '<div class="card"><h3>예시(테스트) 표시</h3>'
      + '<div class="kv">지금: <b>' + (owner.is_test ? '예시 샵' : '실제 샵') + '</b></div>'
      + (owner.is_test ? '' : '<div class="kv" style="color:var(--warn)">⚠ 예시로 바꾸면 이 샵은 <b>예약을 받을 수 없습니다</b>(「예시 샵 · 예약 불가」) — 실제 샵에는 켜지 마세요.</div>')
      + '<input id="saTReason" maxlength="300" placeholder="사유(필수)" style="width:100%">'
      + '<div class="resbtns"><button id="saTGo">' + (owner.is_test ? '실제 샵으로 바꾸기' : '예시 샵으로 바꾸기') + '</button></div>'
      + '<div id="saTMsg" class="kv"></div></div>';
  } else if (dtab === 'verif') {
    const vs = d.verifications || [];
    h += '<div class="card"><h3>인증 (' + vs.length + ')</h3>'
      + (vs.length ? vs.map((v, i) =>
          '<div class="sa-item"><div class="kv"><b>' + s_(KIND_KO[v.kind] || v.kind) + '</b>'
          + (v.route ? ' · ' + s_(ROUTE_KO[v.route] || v.route) : '') + (v.country ? ' ' + s_(v.country) : '')
          + ' · <span class="badge ' + (v.state === 'approved' ? 'ok' : v.state === 'pending' ? '' : 'res') + '">' + s_(VSTATE_KO[v.state] || v.state) + '</span></div>'
          + '<div class="kv" style="color:var(--dim)">승인 ' + s_(day(v.verified_at)) + ' · 만료 ' + s_(day(v.expires_at)) + ' · 갱신 ' + s_(when(v.updated_at)) + '</div>'
          + (v.reject_reason ? '<div class="kv">반려 사유: ' + s_(v.reject_reason) + '</div>' : '')
          + (v.prev_reject_reason ? '<div class="kv" style="color:var(--dim)">지난 반려: ' + s_(v.prev_reject_reason) + '</div>' : '')
          + '<div class="resbtns">'
          + ((v.evidence_paths || []).length ? '<button data-ev="' + i + '">증빙 보기 (' + v.evidence_paths.length + ')</button>' : '<span style="color:var(--dim);font-size:12px">증빙 파일 없음</span>')
          + '<button data-vq="' + i + '">검수 카드</button></div>'
          + '<div class="sa-ev" id="saEv' + i + '"></div></div>').join('')
        : '<div class="kv" style="color:var(--dim)">제출된 인증 없음</div>') + '</div>';
  } else if (dtab === 'mem') {
    const ms = d.memberships || [], os = d.orders || [];
    h += '<div class="card"><h3>멤버십 (' + ms.length + ')</h3>'
      + (ms.length ? ms.map(m => '<div class="kv">' + (m.active ? '🟢 ' : '') + s_(MEM_SRC_KO[m.source] || m.source)
          + ' · ' + s_(day(m.starts_at)) + ' ~ <b>' + s_(day(m.ends_at)) + '</b>' + (m.product_code ? ' · ' + s_(m.product_code) : '') + '</div>').join('')
        : '<div class="kv" style="color:var(--dim)">없음</div>') + '</div>'
      + '<div class="card"><h3>결제 주문 (' + os.length + ')</h3>'
      + (os.length ? os.map(o => '<div class="kv"><b>' + s_(ORDER_KO[o.state] || o.state) + '</b> · ' + s_(won(o.amount))
          + ' · ' + s_(o.product_code || o.kind || '') + (o.method ? ' · ' + s_(o.method) : '')
          + '<br><span style="color:var(--dim);font-size:11.5px">' + s_(o.order_id) + ' · ' + s_(when(o.created_at))
          + (o.approved_at ? ' · 승인 ' + s_(when(o.approved_at)) : '') + (o.fail_reason ? ' · ' + s_(o.fail_reason) : '') + '</span></div>').join('')
        : '<div class="kv" style="color:var(--dim)">없음</div>')
      + '<div class="kv" style="color:var(--dim);margin-top:6px">환불은 토스 상점관리자에서 수동(2단계에 기록 기능).</div></div>';
  } else if (dtab === 'posts') {
    const c = d.counts || {}, p = d.profile || {};
    const n = v => Array.isArray(v) ? v.length : 0;
    h += '<div class="card"><h3>게시물 수</h3>'
      + '<div class="kv">모집글 게시 중 <b>' + s_(c.meetups_published || 0) + '</b> / 전체 ' + s_(c.meetups_total || 0) + '</div>'
      + '<div class="kv">소식 <b>' + s_(c.posts || 0) + '</b> · 단골 <b>' + s_(c.favorites || 0) + '</b> · 앱 문의 <b>' + s_(c.inquiries || 0) + '</b></div></div>'
      + '<div class="card"><h3>샵 정보 채움</h3>'
      + '<div class="kv">안내 글 ' + ((p.intro || '').trim() ? '✓' : '✗') + ' · 사진 ' + n(p.photos) + '장 · 과정 ' + n(p.courses)
      + '개 · 강사 ' + n(p.instructors) + '명 · 보유 자격 ' + n(p.certs) + '개</div>'
      + '<div class="kv"><a target="_blank" rel="noopener" href="https://browniebase.com/badapong/shop/?p=' + encodeURIComponent(d.owner_partner_id || '') + '">웹 샵 페이지 ↗</a></div></div>';
  } else if (dtab === 'resp') {
    const ts = d.threads || [], c = d.counts || {};
    h += '<div class="card"><h3>샵 채팅 (' + ts.length + ')</h3>'
      + (ts.length ? ts.map(t => '<div class="kv">' + ((t.operator_unread || 0) > 0 ? '<span class="badge">미답 ' + s_(t.operator_unread) + '</span> ' : '')
          + '마지막 ' + s_(t.last_msg_at ? ago(t.last_msg_at) : '—') + ' · 샵 안 읽음 ' + s_(t.user_unread || 0)
          + ' <button class="back" style="display:inline-block" data-thr="' + s_(t.thread_id) + '">대화 열기</button></div>').join('')
        : '<div class="kv" style="color:var(--dim)">아직 대화 없음(샵이 포털 「운영자 문의」를 열거나 운영자 통지가 나가면 생깁니다)</div>') + '</div>'
      + '<div class="card"><h3>앱 1:1 문의(샵이 받은 것)</h3><div class="kv">' + s_(c.inquiries || 0) + '건 — 답변 여부는 2단계(48h 무응답 독촉)</div></div>';
  } else if (dtab === 'log') {
    const as = d.actions || [];
    h += '<div class="card"><h3>메모 남기기</h3>'
      + '<div class="kv" style="color:var(--warn)">연락처·이름은 적지 마세요(감사 로그에 5년 남습니다).</div>'
      + '<textarea id="saNote" rows="3" maxlength="2000" placeholder="예: 9/28 통화 — 사진 다시 올리기로 함"></textarea>'
      + '<div class="resbtns"><button id="saNoteGo">메모 저장</button></div><div id="saNoteMsg" class="kv"></div></div>'
      + '<div class="card"><h3>기록 (최근 ' + as.length + ')</h3>'
      + (as.length ? as.map(a => '<div class="kv"><b>' + s_(ACTION_KO[a.action] || a.action) + '</b> · ' + s_(when(a.at)) + ' · ' + s_(a.actor)
          + (a.note ? '<br>' + s_(a.note) : '')
          + (a.action === 'evidence_view' ? '<br><span style="color:var(--dim);font-size:11.5px">' + s_(a.target_id) + '</span>' : '') + '</div>').join('')
        : '<div class="kv" style="color:var(--dim)">기록 없음</div>') + '</div>';
  }
  box.innerHTML = h;
  wireDTab(ownerId, owner);
}
function wireDTab(ownerId, owner) {
  const d = detail;
  if (dtab === 'acct') {
    $('saStGo').onclick = async () => {
      const susp = owner.state === 'suspended';
      const reason = $('saStReason').value.trim();
      if (!susp && !reason) { $('saStMsg').textContent = '정지 사유를 적어 주세요.'; return; }
      if (!confirm(susp ? '이 샵의 정지를 풀까요?' : '이 샵을 정지할까요? 앱·웹에서 샵과 모집글이 숨겨집니다(예약은 유지).')) return;
      $('saStGo').disabled = true;
      try {
        const j = await rpc('admin_set_partner_state', { p_partner: ownerId, p_action: susp ? 'restore' : 'suspend',
          p_reason: reason || null, p_notify: $('saStNotify').checked });
        if (!j || !j.ok) { $('saStMsg').textContent = rtext(j); $('saStGo').disabled = false; return; }
        await refreshAfterAction(ownerId, 'acct', (susp ? '복구 완료 → ' : '정지 완료 → ') + (STATE_KO[j.state] || j.state)
          + ($('saStNotify').checked ? (j.notified ? ' · 샵 채팅 통지함' : ' · ⚠ 통지 실패(조치는 반영됨)') : ''));
      } catch (e) { $('saStMsg').textContent = errText(e); $('saStGo').disabled = false; }
    };
    $('saTGo').onclick = async () => {
      const next = !owner.is_test, reason = $('saTReason').value.trim();
      if (!reason) { $('saTMsg').textContent = '사유를 적어 주세요.'; return; }
      if (next && !confirm('예시 샵으로 바꾸면 이 샵은 예약을 받을 수 없습니다. 정말 바꿀까요?')) return;
      $('saTGo').disabled = true;
      try {
        const j = await rpc('admin_set_test_flag', { p_partner: ownerId, p_is_test: next, p_reason: reason });
        if (!j || !j.ok) { $('saTMsg').textContent = rtext(j); $('saTGo').disabled = false; return; }
        await refreshAfterAction(ownerId, 'acct', (next ? '예시 샵으로 바꿈' : '실제 샵으로 바꿈') + ' · 계정 ' + j.accounts + '개');
      } catch (e) { $('saTMsg').textContent = errText(e); $('saTGo').disabled = false; }
    };
  } else if (dtab === 'verif') {
    const vs = d.verifications || [];
    [...document.querySelectorAll('[data-ev]')].forEach(b => b.onclick = () => showEvidence(vs[+b.dataset.ev].evidence_paths, $('saEv' + b.dataset.ev)));
    [...document.querySelectorAll('[data-vq]')].forEach(b => b.onclick = () => {
      const v = vs[+b.dataset.vq];
      switchView('verify');
      openVerifyDeep(v.partner_id, v.kind);
    });
  } else if (dtab === 'resp') {
    [...document.querySelectorAll('[data-thr]')].forEach(b => b.onclick = async () => {
      const tid = b.dataset.thr;
      switchView('chat');
      await loadThreads(); renderThreads();
      openChat(tid);
    });
  } else if (dtab === 'log') {
    $('saNoteGo').onclick = async () => {
      const note = $('saNote').value.trim();
      if (!note) { $('saNoteMsg').textContent = '메모가 비었습니다.'; return; }
      $('saNoteGo').disabled = true;
      try {
        const j = await rpc('admin_add_note', { p_partner: ownerId, p_note: note });
        if (!j || !j.ok) { $('saNoteMsg').textContent = rtext(j); $('saNoteGo').disabled = false; return; }
        await refreshAfterAction(ownerId, 'log', '메모 저장함');
      } catch (e) { $('saNoteMsg').textContent = errText(e); $('saNoteGo').disabled = false; }
    };
  }
}
async function refreshAfterAction(pid, tab, note) {
  await openShop(pid, tab);
  const box = $('saDT');
  if (box && note) {
    const m = document.createElement('div');
    m.className = 'sa-ok'; m.textContent = '✓ ' + note;
    box.prepend(m);
  }
  await loadCounts();
  if (view === 'shops') paintShopRows();
}

// ── 증빙 보기 — 누를 때마다 admin-evidence 호출, URL 은 이 DOM 에만 잠깐 두고 저장하지 않는다 ──
async function showEvidence(paths, box) {
  if (!box) return;
  box.textContent = '여는 중…';
  let j = null, status = 0;
  try {
    const r = await fetch(EVIDENCE_FN, { method: 'POST', headers: H, body: JSON.stringify({ paths: paths || [] }) });
    status = r.status;
    try { j = await r.json(); } catch (_) { j = null; }
  } catch (e) {
    box.textContent = '증빙 함수를 부르지 못했습니다(미배포·네트워크): ' + e.message;
    return;
  }
  if (!j || !j.ok) {
    const why = j && j.reason;
    box.textContent = why === 'forbidden' ? '토큰 확인 — 어드민 토큰이 거부됐습니다(403).'
      : why === 'audit_failed' ? '열람 기록을 남기지 못해 링크를 주지 않았습니다(서버 로그 확인).'
      : status === 404 ? 'admin-evidence 함수가 아직 배포되지 않았습니다.'
      : '증빙을 열지 못했습니다: ' + (why || status);
    return;
  }
  box.textContent = '';
  const ttl = j.ttl || 120;
  const note = document.createElement('div');
  note.className = 'kv'; note.style.color = 'var(--dim)';
  note.textContent = '링크는 ' + ttl + '초 뒤 만료됩니다 — 다시 보려면 버튼을 한 번 더 누르세요(열람할 때마다 기록됨).';
  box.appendChild(note);
  (j.items || []).forEach(it => {
    const row = document.createElement('div');
    row.className = 'kv';
    const name = String(it.path || '').split('/').pop();
    if (it.url) {
      const a = document.createElement('a');
      a.href = it.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.textContent = name + ' ↗';
      row.appendChild(a);
      if (/\.(jpe?g|png|webp|gif|heic)$/i.test(name)) {
        const img = document.createElement('img');
        img.src = it.url; img.alt = ''; img.className = 'sa-img'; img.referrerPolicy = 'no-referrer';
        row.appendChild(img);
      }
    } else {
      row.textContent = name + ' — ' + (it.error === 'not_found' ? '파일 없음' : '서명 실패');
    }
    box.appendChild(row);
  });
  // 만료 뒤엔 화면에서도 걷어낸다(만료된 링크가 「열리는 것처럼」 남지 않게)
  setTimeout(() => { if (box.isConnected) box.textContent = '링크 만료 — [증빙 보기]를 다시 누르세요.'; }, ttl * 1000);
}

// ═════════════════════════════════════════════════════════════════════════
// 3) 인증 대기열
// ═════════════════════════════════════════════════════════════════════════
async function loadQueue() {
  try {
    const j = await rpc('admin_verification_queue', { p_state: qState, p_limit: 300 });
    if (!j || !j.ok) { queue = { err: rtext(j) }; return; }
    queue = j.items || [];
    if (qState === 'pending') { pendingN = queue.length; paintCounts(); }
  } catch (e) { queue = { exc: e }; }
}
function renderQueue() {
  $('saSub').innerHTML = '<div class="sa-bar">'
    + [['pending', '대기'], ['rejected', '반려'], ['approved', '승인'], ['all', '전체']]
        .map(([k, l]) => '<button class="chip' + (qState === k ? ' on' : '') + '" data-q="' + k + '">' + l + '</button>').join('') + '</div>';
  [...document.querySelectorAll('#saSub [data-q]')].forEach(b => b.onclick = async () => {
    qState = b.dataset.q; queue = null; renderQueue(); await loadQueue(); renderQueue();
  });
  const list = $('saList');
  if (!queue) { list.innerHTML = '<div class="empty">불러오는 중…</div>'; return; }
  if (queue.exc) { list.innerHTML = errBox(queue.exc); return; }
  if (queue.err) { list.innerHTML = '<div class="err">' + s_(queue.err) + '</div>'; return; }
  if (!queue.length) { list.innerHTML = '<div class="empty">' + (qState === 'pending' ? '검수 대기 없음 👏' : '없음') + '</div>'; return; }
  list.innerHTML = queue.map((it, i) => {
    const key = 'v:' + it.partner_id + ':' + it.kind;
    return '<div class="row' + (sel === key ? ' sel' : '') + '" data-key="' + s_(key) + '" data-qi="' + i + '">'
      + '<div class="top">'
      + '<span class="badge ' + (it.state === 'pending' ? '' : it.state === 'approved' ? 'ok' : 'res') + '">' + s_(VSTATE_KO[it.state] || it.state) + '</span>'
      + '<span class="badge act">' + s_(KIND_KO[it.kind] || it.kind) + (it.route ? ' · ' + s_(ROUTE_KO[it.route] || it.route) : '') + (it.country ? ' ' + s_(it.country) : '') + '</span>'
      + (it.is_test ? '<span class="badge res">예시</span>' : '')
      + '<span class="time">' + (it.waiting_hours != null ? s_(it.waiting_hours) + '시간 대기' : s_(it.updated_at ? ago(it.updated_at) : '')) + '</span></div>'
      + '<div class="prev"><b>' + s_(it.shop_name || '(상호 없음)') + '</b>' + (it.role && it.role !== 'owner' ? ' · 직원 계정' : '')
      + (it.prev_reject_reason ? ' · 재제출' : '') + '</div></div>';
  }).join('');
  [...list.querySelectorAll('[data-qi]')].forEach(el => el.onclick = () => openVerify(queue[+el.dataset.qi]));
}
async function openVerifyDeep(pid, kind) {
  let it = Array.isArray(queue) ? queue.find(x => x.partner_id === pid && x.kind === kind) : null;
  if (!it) {
    try {
      const j = await rpc('admin_verification_queue', { p_state: 'all', p_limit: 300 });
      it = ((j && j.items) || []).find(x => x.partner_id === pid && x.kind === kind);
    } catch (e) { renderQueue(); openDetail(errBox(e)); return; }
  }
  renderQueue();
  if (!it) { openDetail('<div class="empty">그 인증 건(' + s_(KIND_KO[kind] || kind) + ')을 찾지 못했습니다 — 이미 지워졌거나 최근 300건 밖입니다.</div>'); return; }
  openVerify(it);
}
function defaultExpires(it) {
  const p = it.payload || {};
  const isDate = v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (it.kind === 'business' && it.route === 'overseas') {
    // 서버 기본값과 같은 규칙: min(서류 유효기간, 오늘+365일)
    const y = new Date(Date.now() + 9 * 3600e3 + 365 * 86400e3).toISOString().slice(0, 10);
    return isDate(p.doc_expires) && p.doc_expires < y ? p.doc_expires : y;
  }
  if (it.kind !== 'business' && isDate(p.expires)) return p.expires;
  return '';   // 국내 사업자 = 만료 없음(월 1회 국세청 재확인이 내린다)
}
function payloadRows(p) {
  return Object.keys(p || {}).filter(k => !PAYLOAD_SKIP.includes(k) && p[k] !== null && p[k] !== '').map(k => {
    let v = p[k];
    if (k === 'entity') v = ENTITY_KO[v] || v;
    if (v && typeof v === 'object') v = JSON.stringify(v);
    return '<tr><th>' + s_(PAYLOAD_KO[k] || k) + '</th><td>' + s_(v) + '</td></tr>';
  }).join('');
}
function openVerify(it) {
  markSel('v:' + it.partner_id + ':' + it.kind);
  const p = it.payload || {}, paths = it.evidence_paths || [];
  const pend = it.state === 'pending';
  let h = '<div class="card" style="margin-top:10px"><h3>' + s_(KIND_KO[it.kind] || it.kind) + ' 인증'
    + (it.route ? ' · ' + s_(ROUTE_KO[it.route] || it.route) : '') + (it.country ? ' ' + s_(it.country) : '')
    + ' · ' + s_(VSTATE_KO[it.state] || it.state) + (it.waiting_hours != null ? ' · ' + s_(it.waiting_hours) + '시간 대기' : '') + '</h3>'
    + '<div class="kv"><b style="font-size:15px">' + s_(it.shop_name || '(상호 없음)') + '</b>'
    + (it.role && it.role !== 'owner' ? ' · 직원 계정' : '') + (it.is_test ? ' · <span class="badge res">예시</span>' : '')
    + ' · 계정 ' + s_(STATE_KO[it.account_state] || it.account_state || '') + '</div>'
    + '<table class="sa-kv">' + payloadRows(p) + '</table>'
    + (it.route === 'overseas' ? '<div class="kv" style="color:var(--dim)">서류의 상호·등록번호·대표자·주소가 위 값과 같은지 대조하세요. 신분증 사본은 받지 않습니다.</div>' : '')
    + (it.prev_reject_reason ? '<div class="kv">지난 반려 사유: ' + s_(it.prev_reject_reason) + '</div>' : '')
    + (it.reject_reason ? '<div class="kv">반려 사유: ' + s_(it.reject_reason) + '</div>' : '')
    + (it.verified_at ? '<div class="kv">승인 ' + s_(day(it.verified_at)) + ' · 만료 ' + s_(day(it.expires_at)) + '</div>' : '')
    + '<div class="resbtns">' + (paths.length ? '<button id="saEvBtn">증빙 보기 (' + paths.length + ')</button>' : '<span style="color:var(--dim);font-size:12px">증빙 파일 없음</span>')
    + '<button id="saToShop">샵 상세</button></div><div class="sa-ev" id="saEvQ"></div></div>';
  if (pend) {
    h += '<div class="card"><h3>승인</h3>'
      + '<div class="kv">만료일 <input type="date" id="saExp" value="' + s_(defaultExpires(it)) + '"></div>'
      + '<div class="kv" style="color:var(--dim)">비우면 서버 기본값: 해외 = min(서류 유효기간, 승인+1년) · 자격/보험 = 제출한 만료일 · 국내 사업자 = 없음</div>'
      + '<div class="resbtns"><button id="saApprove" class="ok">승인</button></div></div>'
      + '<div class="card"><h3>반려</h3><div class="resbtns" id="saRC">'
      + REJECT.filter(([c]) => c !== 'not_business' || it.kind === 'business')
          .map(([c, l]) => '<button data-rc="' + c + '">' + l + '</button>').join('') + '</div>'
      + '<input id="saRD" maxlength="400" placeholder="직접 입력 — 「기타」는 필수, 나머지는 템플릿 뒤에 덧붙음" style="width:100%;margin-top:8px">'
      + (it.route === 'overseas' ? '<div class="kv" style="color:var(--dim)">해외 샵이면 서버가 사유·통지에 영어 한 줄을 붙입니다.</div>' : '')
      + '<div class="resbtns"><button id="saReject" class="danger">반려</button></div></div>'
      + '<div class="card"><label class="sa-chk"><input type="checkbox" id="saVNotify" checked> 결과를 샵 채팅으로 통지</label>'
      + '<div id="saVMsg" class="kv"></div></div>';
  }
  openDetail(h);
  if ($('saEvBtn')) $('saEvBtn').onclick = () => showEvidence(paths, $('saEvQ'));
  $('saToShop').onclick = () => { switchView('shops'); openShop(it.owner_partner_id || it.partner_id, 'verif'); };
  if (!pend) return;
  let code = null;
  [...document.querySelectorAll('[data-rc]')].forEach(b => b.onclick = () => {
    code = b.dataset.rc;
    [...document.querySelectorAll('[data-rc]')].forEach(x => x.classList.toggle('cur', x === b));
  });
  const done = async (j, label) => {
    const out = $('saVMsg');
    if (!j || !j.ok) { out.textContent = rtext(j); return false; }
    $('saApprove').disabled = true; $('saReject').disabled = true;   // 처리한 카드에서 다시 누르지 않게
    out.textContent = '✓ ' + label + ($('saVNotify').checked ? (j.notified ? ' · 샵 채팅 통지함' : ' · ⚠ 통지 실패(처리는 반영됨)') : '')
      + (j.reason_text ? ' · 사유: ' + j.reason_text : '') + (j.expires ? ' · 만료 ' + j.expires : '');
    queue = null; await loadQueue(); renderQueue(); loadCounts();
    return true;
  };
  $('saApprove').onclick = async () => {
    const exp = $('saExp').value || null;
    if (!confirm((it.shop_name || '') + ' — ' + (KIND_KO[it.kind] || it.kind) + ' 인증을 승인할까요?' + (exp ? '\n만료 ' + exp : ''))) return;
    $('saApprove').disabled = true;
    try {
      const j = await rpc('admin_review_verification', { p_partner: it.partner_id, p_kind: it.kind, p_approve: true,
        p_reason_code: null, p_reason_detail: null, p_expires: exp, p_notify: $('saVNotify').checked });
      if (!(await done(j, '승인함'))) $('saApprove').disabled = false;
    } catch (e) { $('saVMsg').textContent = errText(e); $('saApprove').disabled = false; }
  };
  $('saReject').onclick = async () => {
    const detailTxt = $('saRD').value.trim();
    if (!code) { $('saVMsg').textContent = '반려 사유를 고르세요.'; return; }
    if (code === 'other' && !detailTxt) { $('saVMsg').textContent = '「기타」는 사유를 직접 적어야 합니다.'; return; }
    if (!confirm('반려할까요? 사유가 샵에게 그대로 보입니다.')) return;
    $('saReject').disabled = true;
    try {
      const j = await rpc('admin_review_verification', { p_partner: it.partner_id, p_kind: it.kind, p_approve: false,
        p_reason_code: code, p_reason_detail: detailTxt || null, p_expires: null, p_notify: $('saVNotify').checked });
      if (!(await done(j, '반려함'))) $('saReject').disabled = false;
    } catch (e) { $('saVMsg').textContent = errText(e); $('saReject').disabled = false; }
  };
}

// ═════════════════════════════════════════════════════════════════════════
// 4) 샵 채팅 — message_threads(kind='partner') 재사용. 기존 inbox 정책(threads_admin_* · messages_admin_*)으로 읽고 쓴다.
// ═════════════════════════════════════════════════════════════════════════
let threadsErr = null;
async function loadThreads() {
  threadsErr = null;
  // 샵 목록이 먼저 통과해야 한다 — 채팅 RLS 는 토큰이 틀려도 에러 대신 0행이라 「대화 없음」으로 오독된다.
  if (!shops) { await loadCounts(); }
  if (shopsErr) { threadsErr = shopsErr; threads = null; return; }
  try {
    threads = await api('message_threads?kind=eq.partner&select=id,partner_id,operator_unread,user_unread,last_msg_at,archived_at'
                        + '&order=last_msg_at.desc.nullslast&limit=300');
    prevs = {};
    const ids = threads.map(t => t.id);
    if (ids.length) {
      const msgs = await api('user_messages?thread_id=in.(' + ids.join(',') + ')&select=thread_id,sender,body,created_at&order=created_at.asc&limit=3000');
      msgs.forEach(m => prevs[m.thread_id] = m);
    }
  } catch (e) { threadsErr = e; threads = null; }
}
// 스레드 → 샵. 목록 RPC 의 chat.thread_ids(대표·직원 합산)로 잇고, 없으면 대표 partner_id 로.
function shopOfThread(t) {
  for (const x of shops || []) {
    if (x.chat && Array.isArray(x.chat.thread_ids) && x.chat.thread_ids.includes(t.id)) return x;
  }
  return (shops || []).find(x => x.partner_id === t.partner_id) || null;
}
function renderThreads() {
  $('saSub').innerHTML = '';
  const list = $('saList');
  if (threadsErr) { list.innerHTML = errBox(threadsErr); return; }
  if (!threads) { list.innerHTML = '<div class="empty">불러오는 중…</div>'; return; }
  const live = threads.filter(t => !t.archived_at).sort((a, b) => {
    const ua = (a.operator_unread || 0) > 0 ? 0 : 1, ub = (b.operator_unread || 0) > 0 ? 0 : 1;
    if (ua !== ub) return ua - ub;
    return new Date(b.last_msg_at || 0) - new Date(a.last_msg_at || 0);
  });
  if (!live.length) { list.innerHTML = '<div class="empty">샵 채팅 없음</div>'; return; }
  list.innerHTML = live.map(t => {
    const x = shopOfThread(t), pv = prevs[t.id], un = (t.operator_unread || 0) > 0;
    const key = 't:' + t.id;
    return '<div class="row' + (sel === key ? ' sel' : '') + '" data-key="' + s_(key) + '" data-tid="' + s_(t.id) + '">'
      + '<div class="top">' + (un ? '<span class="badge">미답변 ' + s_(t.operator_unread) + '</span>' : '')
      + '<b class="sa-name">' + s_(x ? x.shop_name : '(샵 미상 ' + String(t.partner_id || '').slice(0, 8) + ')') + '</b>'
      + '<span class="time">' + s_(t.last_msg_at ? ago(t.last_msg_at) : '') + '</span></div>'
      + '<div class="prev">' + (pv ? (pv.sender === 'operator' ? '↳ ' : '') + s_(pv.body) : '(메시지 없음)') + '</div></div>';
  }).join('');
  [...list.querySelectorAll('[data-tid]')].forEach(el => el.onclick = () => openChat(el.dataset.tid));
}
async function openChat(tid) {
  markSel('t:' + tid);
  openThreadId = tid; openMsgN = -1;
  const t = (threads || []).find(x => x.id === tid) || { id: tid };
  const x = shopOfThread(t);
  openDetail('<div class="card" style="margin-top:10px"><h3>샵 채팅 · 운영자 답장은 샵 포털 「운영자 문의」와 앱 문의함에 보입니다</h3>'
    + '<div class="kv"><b style="font-size:15px">' + s_(x ? x.shop_name : '(샵 미상)') + '</b> '
    + (x ? '<button class="back" style="display:inline-block" id="saChatShop">샵 상세</button>' : '') + '</div></div>'
    + '<div id="saMsgs"><div class="empty">불러오는 중…</div></div>');
  // composer 는 메시지 영역과 따로 둔다 — 30초 폴링이 메시지를 다시 그려도 쓰던 답장이 지워지지 않게.
  const comp = document.createElement('div');
  comp.id = 'composer';
  comp.innerHTML = '<textarea id="saBody" maxlength="2000" placeholder="답장 (샵에게 그대로 보입니다 · 예보·등급은 적지 마세요)"></textarea>'
    + '<button class="send" id="saSend">보내기</button>';
  $('detail').appendChild(comp);
  if ($('saChatShop')) $('saChatShop').onclick = () => { switchView('shops'); openShop(x.partner_id, 'resp'); };
  $('saSend').onclick = () => sendChat(tid);
  await refreshChat(tid);
}
async function refreshChat(tid) {
  if (openThreadId !== tid) return;
  try {
    const msgs = await api('user_messages?thread_id=eq.' + encodeURIComponent(tid) + '&select=id,sender,body,created_at&order=created_at.asc&limit=300');
    if (openThreadId !== tid) return;
    if (msgs.length !== openMsgN) {
      openMsgN = msgs.length;
      const box = $('saMsgs');
      if (box) {
        box.innerHTML = msgs.length ? msgs.map(m =>
          '<div class="msg ' + (m.sender === 'operator' ? 'operator' : 'user') + '"><div>'
          + '<div class="b">' + s_(m.body) + '</div>'
          + '<div class="t" style="text-align:' + (m.sender === 'operator' ? 'right' : 'left') + '">'
          + (m.sender === 'operator' ? '운영자 · ' : '샵 · ') + s_(when(m.created_at)) + '</div></div></div>').join('')
          : '<div class="empty">메시지 없음</div>';
      }
    }
    const t = (threads || []).find(x => x.id === tid);
    if (t && (t.operator_unread || 0) > 0) {
      try {
        await api('message_threads?id=eq.' + encodeURIComponent(tid), { method: 'PATCH', headers: H, body: JSON.stringify({ operator_unread: 0 }) });
        const before = t.operator_unread || 0;
        t.operator_unread = 0;
        const x = shopOfThread(t);
        if (x && x.chat) x.chat.operator_unread = Math.max(0, (x.chat.operator_unread || 0) - before);
        paintCounts();
        renderThreads(); markSel('t:' + tid);
      } catch (_) { /* 읽음 실패는 표시만 남는다 */ }
    }
  } catch (e) {
    const box = $('saMsgs');
    if (box) box.innerHTML = errBox(e);
  }
}
async function sendChat(tid) {
  const ta = $('saBody'), btn = $('saSend');
  const body = ta.value.trim();
  if (!body) return;
  btn.disabled = true;
  try {
    // sender='operator' 는 RLS(messages_admin_insert with check)가 강제한다 — 토큰이 틀리면 여기서 막힌다.
    const rows = await api('user_messages', { method: 'POST', headers: H_RET,
      body: JSON.stringify({ thread_id: tid, sender: 'operator', body }) });
    if (!rows || !rows.length) throw new Error('저장된 행이 없습니다(토큰 확인)');
    ta.value = '';
    await refreshChat(tid);
    await loadThreads(); renderThreads(); markSel('t:' + tid);
  } catch (e) {
    showErr('샵 채팅 전송 실패: ' + errText(e));
  } finally { btn.disabled = false; }
}

// ═════════════════════════════════════════════════════════════════════════
// 5) 파트너 신청(partners.html 폼) — 처리 표시
// ═════════════════════════════════════════════════════════════════════════
let appsErr = null;
async function loadApps() {
  appsErr = null;
  try {
    const j = await rpc('admin_application_list', { p_include_handled: appsAll, p_limit: 200 });
    if (!j || !j.ok) { appsErr = new Error(rtext(j)); apps = null; return; }
    apps = j.applications || [];
    if (!appsAll) { appsUnhandled = apps.length; paintCounts(); }
  } catch (e) { appsErr = e; apps = null; }
}
function renderApps() {
  $('saSub').innerHTML = '<div class="sa-bar"><button class="chip' + (!appsAll ? ' on' : '') + '" data-ap="0">미처리</button>'
    + '<button class="chip' + (appsAll ? ' on' : '') + '" data-ap="1">처리한 것 포함</button></div>';
  [...document.querySelectorAll('#saSub [data-ap]')].forEach(b => b.onclick = async () => {
    appsAll = b.dataset.ap === '1'; apps = null; renderApps(); await loadApps(); renderApps();
  });
  const list = $('saList');
  if (appsErr) { list.innerHTML = errBox(appsErr); return; }
  if (!apps) { list.innerHTML = '<div class="empty">불러오는 중…</div>'; return; }
  if (!apps.length) { list.innerHTML = '<div class="empty">' + (appsAll ? '신청 없음' : '미처리 신청 없음 👏') + '</div>'; return; }
  list.innerHTML = apps.map((a, i) => {
    const key = 'a:' + a.id;
    return '<div class="row' + (sel === key ? ' sel' : '') + '" data-key="' + s_(key) + '" data-ai="' + i + '">'
      + '<div class="top">' + (a.handled ? '<span class="badge ok">처리함</span>' : '<span class="badge">미처리</span>')
      + (a.tier_hint ? '<span class="badge res">' + s_(a.tier_hint) + '</span>' : '')
      + '<b class="sa-name">' + s_(a.shop_name || '(상호 없음)') + '</b>'
      + '<span class="time">' + s_(a.created_at ? ago(a.created_at) : '') + '</span></div>'
      + '<div class="prev">' + s_(a.region_hint || '') + (a.message ? ' · ' + s_(a.message) : '') + '</div></div>';
  }).join('');
  [...list.querySelectorAll('[data-ai]')].forEach(el => el.onclick = () => openApp(apps[+el.dataset.ai]));
}
function openApp(a) {
  markSel('a:' + a.id);
  openDetail('<div class="card" style="margin-top:10px"><h3>파트너 신청 · ' + s_(when(a.created_at)) + '</h3>'
    + '<div class="kv"><b style="font-size:15px">' + s_(a.shop_name || '(상호 없음)') + '</b></div>'
    + '<div class="kv">연락처: ' + s_(a.contact_masked || '—') + ' <span style="color:var(--dim)">(원문은 신청 즉시 메일)</span></div>'
    + '<div class="kv">지역: ' + s_(a.region_hint || '—') + ' · 관심 등급: ' + s_(a.tier_hint || '—') + '</div>'
    + (a.message ? '<div class="kv" style="white-space:pre-wrap">' + s_(a.message) + '</div>' : '')
    + '<input id="saAN" maxlength="500" placeholder="처리 메모(선택) — 연락처·이름은 적지 마세요" style="width:100%;margin-top:8px">'
    + '<div class="resbtns"><button id="saAGo">' + (a.handled ? '다시 열기(미처리로)' : '처리함으로 표시') + '</button></div>'
    + '<div id="saAMsg" class="kv"></div></div>');
  $('saAGo').onclick = async () => {
    $('saAGo').disabled = true;
    try {
      const j = await rpc('admin_mark_application_handled', { p_application: a.id, p_handled: !a.handled, p_note: $('saAN').value.trim() || null });
      if (!j || !j.ok) { $('saAMsg').textContent = rtext(j); $('saAGo').disabled = false; return; }
      $('saAMsg').textContent = '✓ ' + (j.handled ? '처리함으로 표시했습니다' : '미처리로 되돌렸습니다');
      a.handled = j.handled;
      await loadApps(); renderApps(); loadCounts();
    } catch (e) { $('saAMsg').textContent = errText(e); $('saAGo').disabled = false; }
  };
}

// ── 30초 폴링 — 샵 모드일 때만, 창이 가려져 있으면 건너뛴다 ─────────────────
function startPoll() {
  stopPoll();
  pollTimer = setInterval(async () => {
    // 폴링은 샵 채팅 화면에서만(운영 DB 부하 최소 — 다른 화면은 ↻ 로 새로 받는다)
    if (!active || document.hidden || view !== 'chat') return;
    try {   // 새 샵의 스레드 이름·미답 배지는 샵 목록에서 온다
      const j = await rpc('admin_shop_list', { p_include_test: true, p_limit: 500 });
      shops = (j && j.shops) || []; shopsErr = null; paintCounts();
    } catch (_) { /* 배지만 멈춘다 — 아래 loadThreads 가 오류를 그린다 */ }
    await loadThreads();
    if (!active || view !== 'chat') return;
    renderThreads();
    if (sel) markSel(sel);
    if (openThreadId) await refreshChat(openThreadId);
  }, POLL_MS);
}
function stopPoll() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }

window.ShopAdmin = { enter, leave, reload };

// 헤더 칩 배지 — 조용히(실패해도 오류 띄우지 않음). 딥링크(?tab=shops)면 바로 샵 모드로.
if (typeof ADMIN_TOKEN !== 'undefined' && ADMIN_TOKEN) {
  if (new URLSearchParams(location.search).get('tab') === 'shops') setSource('shops');
  else loadCounts();
}
})();
