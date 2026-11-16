// SVIP 会员 · USDT 支付 + 登录系统（前端）
// 后端：https://pay.worinima.ccwu.cc（Cloudflare Worker usdt-pay）
// 后端只读链、不碰私钥；session token 只存浏览器 localStorage，永不写入本站文件。
(function () {
  'use strict';
  var API = 'https://pay.worinima.ccwu.cc';
  var TOKEN_KEY = 'svip-token';
  var QR_API = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=';
  var POLL_MS = 20000;

  var token = null;
  try { token = localStorage.getItem(TOKEN_KEY); } catch (e) {}
  var me = null;            // GET /api/me 的返回 { email, membership }
  var networks = null;      // GET /api/networks 缓存
  var currentOrder = null;  // 当前订单对象
  var pollTimer = null;
  var pendingPlan = null;
  var authMode = 'login';

  function $(id) { return document.getElementById(id); }
  function t(key) { return (window.I18N ? I18N.t(key) : key); }
  function tf(key, vars) { return (window.I18N ? I18N.tf(key, vars) : key); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function planLabel(p) { return (window.I18N ? I18N.t('pricing.plan.' + p) : p) || p; }
  function fmtDate(ts) {
    if (!ts) return '';
    var d = new Date(ts);
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }

  function saveToken(tok) {
    token = tok || null;
    try {
      if (tok) localStorage.setItem(TOKEN_KEY, tok);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {}
  }

  function api(path, opts) {
    opts = opts || {};
    var headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = 'Bearer ' + token;
    return fetch(API + path, {
      method: opts.method || 'GET',
      headers: headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (data) {
        if (!res.ok) {
          var err = new Error(data.error || ('HTTP ' + res.status));
          err.status = res.status;
          err.code = data.error || '';
          throw err;
        }
        return data;
      });
    });
  }

  // ---------- toast（复制反馈等轻提示） ----------
  var toastEl = null, toastTimer = null;
  function showToast(msg) {
    if (!toastEl) toastEl = $('toast');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  function copyText(text) {
    function done() { showToast(t('pay.copy') + ' ✓'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ---------- 登录 / 注册弹窗 ----------
  function openAuth(mode) {
    setAuthMode(mode || 'login');
    var m = $('authModal');
    if (m) { m.hidden = false; }
    document.body.style.overflow = 'hidden';
  }
  function closeAuth() {
    var m = $('authModal');
    if (m) m.hidden = true;
    document.body.style.overflow = '';
    var errEl = $('authErr');
    if (errEl) errEl.hidden = true;
  }
  function setAuthMode(mode) {
    authMode = mode;
    var tabs = document.querySelectorAll('.auth-tab');
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].getAttribute('data-mode') === mode);
    }
    var submit = $('authSubmit');
    if (submit) submit.textContent = mode === 'register' ? t('pay.registerBtn') : t('pay.loginBtn');
    var swText = $('authSwitchText');
    if (swText) swText.textContent = mode === 'register' ? t('pay.hasAccount') : t('pay.noAccount');
    var swBtn = $('authSwitch');
    if (swBtn) swBtn.textContent = mode === 'register' ? t('pay.login') : t('pay.register');
  }
  function authError(code, err) {
    var msg;
    if (code === 'email_exists') msg = t('pay.errEmailExists');
    else if (code === 'invalid_credentials') msg = t('pay.errAuth');
    else if (code === 'invalid_email') msg = t('pay.errEmail');
    else if (code === 'password_too_short') msg = t('pay.errPassword');
    else if (err && err.status === 429) msg = t('pay.errTooMany');
    else if (err && (err.message === 'Failed to fetch' || err instanceof TypeError)) msg = t('pay.errNetwork');
    else msg = t('pay.errGeneric');
    var errEl = $('authErr');
    if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
  }
  function submitAuth(ev) {
    ev.preventDefault();
    var email = $('authEmail').value.trim();
    var pw = $('authPassword').value;
    var errEl = $('authErr');
    if (errEl) errEl.hidden = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (errEl) { errEl.textContent = t('pay.errEmail'); errEl.hidden = false; }
      return;
    }
    if (pw.length < 8) {
      if (errEl) { errEl.textContent = t('pay.errPassword'); errEl.hidden = false; }
      return;
    }
    var btn = $('authSubmit');
    if (btn) btn.disabled = true;
    var path = authMode === 'register' ? '/api/register' : '/api/login';
    api(path, { method: 'POST', body: { email: email, password: pw } })
      .then(function (data) {
        if (authMode === 'register') {
          return api('/api/login', { method: 'POST', body: { email: email, password: pw } });
        }
        return data;
      })
      .then(function (data) {
        saveToken(data.token);
        closeAuth();
        return refreshMe().then(function () {
          if (pendingPlan) { var p = pendingPlan; pendingPlan = null; startCheckout(p); }
        });
      })
      .catch(function (err) {
        if (btn) btn.disabled = false;
        if (err.code === 'email_exists') setAuthMode('login');
        authError(err.code, err);
      });
  }

  function logout() {
    api('/api/logout', { method: 'POST' }).catch(function () {});
    saveToken(null);
    me = null;
    renderMemberBar();
    renderNavAuth();
  }

  // ---------- 会员状态 ----------
  function renderMemberBar() {
    var bar = $('memberBar');
    if (!bar) return;
    if (!token || !me) {
      bar.innerHTML = '<span class="mb-text">' + esc(t('pay.memberLoginFirst')) + '</span>' +
        '<button type="button" class="btn-outline mb-btn" data-act="login">' + esc(t('pay.login')) + '</button>';
    } else {
      var m = me.membership || {};
      var status = m.active
        ? tf('pay.memberActive', { plan: planLabel(m.plan), date: fmtDate(m.expires_at) })
        : t('pay.memberNone');
      bar.innerHTML = '<span class="mb-text">' + esc(me.email) + ' · ' + esc(status) + '</span>' +
        '<button type="button" class="btn-outline mb-btn" data-act="logout">' + esc(t('pay.logout')) + '</button>';
    }
    var btn = bar.querySelector('[data-act]');
    if (btn) btn.addEventListener('click', function (ev) {
      if (ev.target.getAttribute('data-act') === 'login') openAuth('login');
      else logout();
    });
  }

  function renderNavAuth() {
    var btn = $('navAuth');
    if (!btn) return;
    if (token && me) {
      btn.textContent = me.email;
      btn.classList.add('logged');
    } else {
      btn.textContent = t('pay.login');
      btn.classList.remove('logged');
    }
  }

  function refreshMe() {
    if (!token) { me = null; renderMemberBar(); renderNavAuth(); return Promise.resolve(); }
    return api('/api/me').then(function (data) {
      me = data;
      renderMemberBar(); renderNavAuth();
    }).catch(function (err) {
      if (err && err.status === 401) { saveToken(null); me = null; }
      renderMemberBar(); renderNavAuth();
    });
  }

  // ---------- 网络列表 ----------
  function loadNetworks() {
    if (networks) return Promise.resolve(networks);
    return fetch(API + '/api/networks').then(function (res) { return res.json(); }).then(function (data) {
      networks = data.networks || [];
      return networks;
    }).catch(function () { networks = []; return networks; });
  }

  // ---------- 下单 / 付款弹窗 ----------
  function startCheckout(plan) {
    if (!token) { pendingPlan = plan; openAuth('login'); return; }
    loadNetworks().then(function () { createOrder(plan, 'tron'); });
  }

  function createOrder(plan, network) {
    stopPolling();
    currentOrder = { plan: plan, network: network, status: 'creating' };
    openOrderModal();
    renderOrder();
    api('/api/create-order', { method: 'POST', body: { plan: plan, network: network } })
      .then(function (order) {
        currentOrder = order;
        currentOrder.plan = plan;
        renderOrder();
        startPolling();
      })
      .catch(function (err) {
        if (err.status === 401) {
          closeOrderModal();
          saveToken(null); me = null;
          renderMemberBar(); renderNavAuth();
          pendingPlan = plan; openAuth('login');
          return;
        }
        currentOrder = { plan: plan, network: network, status: 'error', code: err.code || '' };
        renderOrder();
      });
  }

  function openOrderModal() {
    var m = $('orderModal');
    if (m) m.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeOrderModal() {
    var m = $('orderModal');
    if (m) m.hidden = true;
    document.body.style.overflow = '';
    stopPolling();
  }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }
  function startPolling() {
    stopPolling();
    pollTimer = setInterval(pollOrder, POLL_MS);
  }
  function pollOrder() {
    if (!currentOrder || !currentOrder.out_trade_no) return;
    api('/api/order-status?out_trade_no=' + encodeURIComponent(currentOrder.out_trade_no))
      .then(function (data) {
        var prev = currentOrder.status;
        currentOrder.status = data.status;
        currentOrder.confirmations = data.confirmations;
        if (data.status === 'paid') { stopPolling(); refreshMe(); renderOrder(); }
        else if (data.status === 'expired') { stopPolling(); renderOrder(); }
        else if (prev !== data.status || data.status === 'confirming') { updateOrderStatus(); }
      })
      .catch(function (err) {
        if (err.status === 401) {
          stopPolling(); closeOrderModal();
          saveToken(null); me = null;
          renderMemberBar(); renderNavAuth();
          openAuth('login');
          return;
        }
        currentOrder.pollError = true;
        updateOrderStatus();
      });
  }

  function statusText() {
    if (!currentOrder) return '';
    if (currentOrder.pollError) return t('pay.statusError');
    switch (currentOrder.status) {
      case 'creating': return t('pay.statusWaiting');
      case 'pending': return t('pay.statusWaiting');
      case 'confirming':
        return tf('pay.statusConfirming', { n: (currentOrder.confirmations != null ? currentOrder.confirmations : '…' ) });
      case 'paid': return t('pay.statusPaid');
      case 'expired': return t('pay.statusExpired');
      case 'error': return t('pay.errOrder');
      default: return t('pay.statusWaiting');
    }
  }
  function statusClass() {
    if (!currentOrder) return '';
    if (currentOrder.status === 'paid') return 'ok';
    if (currentOrder.status === 'expired' || currentOrder.status === 'error') return 'bad';
    return '';
  }

  function networkOptions() {
    var list = networks || [];
    return list.map(function (n) {
      var label = n.label + (n.note ? ' · ' + n.note : '') + (n.high_fee ? ' · ' + t('pay.highFee') : '');
      return '<option value="' + esc(n.key) + '"' + (n.key === currentOrder.network ? ' selected' : '') + '>' + esc(label) + '</option>';
    }).join('');
  }

  function renderOrder() {
    var body = $('orderBody');
    if (!body || !currentOrder) return;
    var o = currentOrder;
    if (o.status === 'creating') {
      body.innerHTML = '<p class="order-status">' + esc(t('pay.statusWaiting')) + '</p>';
      return;
    }
    if (o.status === 'error') {
      body.innerHTML = '<p class="order-status bad">' + esc(t('pay.errOrder')) + '</p>' +
        '<button type="button" class="btn-primary order-wide" data-act="retry">' + esc(t('pay.newOrder')) + '</button>';
      return;
    }
    var qrUrl = QR_API + encodeURIComponent(o.qr_data || o.address || '');
    var amount = Number(o.amount_usdt).toFixed(3);
    var html = '';
    html += '<p class="order-plan">' + esc(planLabel(o.plan)) + ' · ' + esc(o.network_label || o.network) + '</p>';
    html += '<p class="order-no">' + esc(t('pay.orderNo')) + ' <code>' + esc(o.out_trade_no || '') + '</code></p>';
    html += '<label class="order-field"><span>' + esc(t('pay.network')) + '</span>' +
      '<select id="orderNetwork" class="order-select">' + networkOptions() + '</select></label>';
    html += '<div class="order-qr-wrap"><img class="order-qr" src="' + esc(qrUrl) + '" alt="QR" width="240" height="240"></div>';
    html += '<div class="order-row"><span class="order-label">' + esc(t('pay.address')) + '</span>' +
      '<code class="order-addr">' + esc(o.address || '') + '</code>' +
      '<button type="button" class="mini-btn" data-copy="' + esc(o.address || '') + '">' + esc(t('pay.copy')) + '</button></div>';
    html += '<div class="order-row amount-row"><span class="order-label">' + esc(t('pay.amount')) + '</span>' +
      '<strong class="order-amount">' + esc(amount) + ' USDT</strong>' +
      '<button type="button" class="mini-btn" data-copy="' + esc(amount) + '">' + esc(t('pay.copy')) + '</button></div>';
    html += '<p class="order-cny">' + esc(tf('pay.amountCny', { n: o.amount_cny, rate: o.rate })) + '</p>';
    if (o.high_fee) html += '<p class="order-fee">' + esc(t('pay.highFee')) + '</p>';
    html += '<div class="order-warn"><strong>' + esc(t('pay.warnTitle')) + '</strong><p>' + esc(t('pay.warnAmount')) + '</p><p>' + esc(t('pay.warnNetwork')) + '</p></div>';
    html += '<p class="order-status ' + statusClass() + '" id="orderStatus">' + esc(statusText()) + '</p>';
    if (o.status === 'paid') {
      html += '<button type="button" class="btn-primary order-wide" data-act="close">' + esc(t('pay.close')) + '</button>';
    } else if (o.status === 'expired') {
      html += '<button type="button" class="btn-primary order-wide" data-act="retry">' + esc(t('pay.newOrder')) + '</button>';
    } else {
      html += '<button type="button" class="btn-outline order-wide" data-act="close">' + esc(t('pay.cancel')) + '</button>';
    }
    body.innerHTML = html;
  }

  function updateOrderStatus() {
    var el = $('orderStatus');
    if (!el) return;
    el.textContent = statusText();
    el.className = 'order-status ' + statusClass();
    if (currentOrder.status === 'paid' || currentOrder.status === 'expired') renderOrder();
  }

  // ---------- 初始化 ----------
  function init() {
    var btns = document.querySelectorAll('.price-btn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function (ev) {
        var plan = ev.currentTarget.getAttribute('data-plan') || 'month';
        startCheckout(plan);
      });
    }

    var navBtn = $('navAuth');
    if (navBtn) navBtn.addEventListener('click', function () {
      if (token && me) {
        var pricing = document.getElementById('pricing');
        if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
      } else openAuth('login');
    });

    var authForm = $('authForm');
    if (authForm) authForm.addEventListener('submit', submitAuth);
    var tabs = document.querySelectorAll('.auth-tab');
    for (var j = 0; j < tabs.length; j++) {
      tabs[j].addEventListener('click', function (ev) { setAuthMode(ev.currentTarget.getAttribute('data-mode')); });
    }
    var swBtn = $('authSwitch');
    if (swBtn) swBtn.addEventListener('click', function () { setAuthMode(authMode === 'login' ? 'register' : 'login'); });

    var orderBody = $('orderBody');
    if (orderBody) {
      orderBody.addEventListener('click', function (ev) {
        var cp = ev.target.closest ? ev.target.closest('[data-copy]') : null;
        if (cp) { copyText(cp.getAttribute('data-copy')); return; }
        var act = ev.target.closest ? ev.target.closest('[data-act]') : null;
        if (!act) return;
        var a = act.getAttribute('data-act');
        if (a === 'close') closeOrderModal();
        else if (a === 'retry' && currentOrder) createOrder(currentOrder.plan, currentOrder.network);
      });
      orderBody.addEventListener('change', function (ev) {
        if (ev.target && ev.target.id === 'orderNetwork' && currentOrder) {
          createOrder(currentOrder.plan, ev.target.value);
        }
      });
    }

    // 关闭弹窗：× 按钮 / 背景 / Esc
    document.querySelectorAll('[data-close-auth]').forEach(function (el) {
      el.addEventListener('click', closeAuth);
    });
    document.querySelectorAll('[data-close-order]').forEach(function (el) {
      el.addEventListener('click', closeOrderModal);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { closeAuth(); closeOrderModal(); }
    });

    loadNetworks();
    refreshMe();
    if (window.I18N) I18N.onChange(function () {
      setAuthMode(authMode);
      renderMemberBar();
      renderNavAuth();
      var om = $('orderModal');
      if (currentOrder && om && !om.hidden) renderOrder();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
