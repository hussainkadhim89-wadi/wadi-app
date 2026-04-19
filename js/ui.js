// ════════════════════════════════════════
// js/ui.js — UI Helpers (Toast + Button)
// Wadi Al-Taqaa ERP
// ════════════════════════════════════════

const TOAST_ICONS={success:'✅',error:'❌',warning:'⚠️',info:'ℹ️'};
const TOAST_DURATION={success:3000,error:5000,warning:4000,info:3500};
let _tt,_lastToastMsg='',_lastToastType='',_toastCount=1;

function showToast(msg,type='success'){
  try{
    const t=document.getElementById('toast');
    const icon=document.getElementById('toast-icon');
    const msgEl=document.getElementById('toast-msg');
    const bar=document.getElementById('toast-bar');
    if(!t||!icon||!msgEl||!bar) return;

    clearTimeout(_tt);

    // Grouping: نفس النوع + نفس الرسالة → عرّض العدد
    if(t.classList.contains('show') && msg===_lastToastMsg && type===_lastToastType){
      _toastCount++;
      msgEl.textContent=`${msg} (×${_toastCount})`;
      // أعد الـ timer بدون animation
      const dur=TOAST_DURATION[type]||3000;
      bar.style.transition='none'; bar.style.width='100%';
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        bar.style.transition=`width ${dur}ms linear`;
        bar.style.width='0%';
      }));
      _tt=setTimeout(()=>hideToast(),dur);
      return;
    }

    // رسالة جديدة
    _lastToastMsg=msg; _lastToastType=type; _toastCount=1;
    bar.style.transition='none'; bar.style.width='100%';
    icon.textContent=TOAST_ICONS[type]||'ℹ️';
    msgEl.textContent=msg;
    t.className=`show ${type}`;

    const dur=TOAST_DURATION[type]||3000;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      bar.style.transition=`width ${dur}ms linear`;
      bar.style.width='0%';
    }));
    _tt=setTimeout(()=>hideToast(),dur);
  }catch(e){console.error('Toast error:',e);}
}

function hideToast(){
  const t=document.getElementById('toast');
  t.classList.remove('show');
  clearTimeout(_tt);
  _lastToastMsg=''; _lastToastType=''; _toastCount=1;
}

// ── BUTTON LOADING ──
function btnLoad(btn,loadingText='جاري الحفظ...'){
  const orig=btn.innerHTML;
  btn.innerHTML=loadingText;
  btn.classList.add('loading');
  btn.disabled=true;
  return ()=>{btn.innerHTML=orig;btn.classList.remove('loading');btn.disabled=false;};
}


// ── Centralized Error Handler ──
function handleError(e, msg='خطأ غير متوقع') {
  console.error('[handleError]', msg, e);
  if(typeof showToast === 'function') showToast(msg, 'error');
}

// ── Expose to global scope ──
window.showToast = showToast;
window.hideToast = hideToast;
window.btnLoad       = btnLoad;
window.handleError   = handleError;
