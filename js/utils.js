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

// ── Expose to global scope ──
window.fmt   = fmt;
window.fmtM  = fmtM;
window.fmtD  = fmtD;
window.fmtPct = fmtPct;
