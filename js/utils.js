// ════════════════════════════════════════
// js/utils.js — Format Utilities
// Wadi Al-Taqaa ERP
// ════════════════════════════════════════

// ── fmt helper (internal) ──
function fmt(n){
  return (+n||0).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
}

// ── Currency format ──
const fmtM = n => {
  if(n==null||n===''||isNaN(+n))return'—';
  return fmt(n)+' د.ع';
};

// ── Date format ──
const fmtD = d => {
  if(!d)return'—';
  try{return new Date(d).toLocaleDateString('en-GB',{year:'numeric',month:'2-digit',day:'2-digit'});}
  catch{return'—';}
};

// ── Percentage format ──
const fmtPct = n => n==null?'—':(+n)+'%';
// ── SANITIZE INPUT ──
const MAX_AMOUNT = 1_000_000_000_000;

function sanitizeAmount(val, fieldName='المبلغ'){
  const n = +val;
  if(isNaN(n)||val===''||val===null) return {ok:false, msg:`${fieldName}: قيمة غير صالحة`};
  if(n < 0) return {ok:false, msg:`${fieldName}: لا يمكن أن يكون سالباً`};
  if(n > MAX_AMOUNT) return {ok:false, msg:`${fieldName}: القيمة كبيرة جداً`};
  return {ok:true, val:n};
}

function sanitizeText(val, max=500, fieldName='النص'){
  if(!val||!val.trim()) return {ok:false, msg:`${fieldName}: لا يمكن أن يكون فارغاً`};
  if(val.trim().length > max) return {ok:false, msg:`${fieldName}: يجب أن لا يتجاوز ${max} حرف`};
  return {ok:true, val:val.trim()};
}

// ── Expose to global scope ──
window.MAX_AMOUNT     = MAX_AMOUNT;
window.sanitizeAmount = sanitizeAmount;
window.sanitizeText   = sanitizeText;
