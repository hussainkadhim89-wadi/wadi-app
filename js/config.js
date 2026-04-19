// ════════════════════════════════════════
// js/config.js — Supabase Client & Realtime
// Wadi Al-Taqaa ERP · Single source of truth
// ════════════════════════════════════════

const DEBUG = false; // true في بيئة التطوير فقط

const sb = supabase.createClient(
  'https://lakokpqtksrpiillbuzb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxha29rcHF0a3NycGlpbGxidXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODUyMzEsImV4cCI6MjA5MTI2MTIzMX0.rl_8rUJwDJwP2LDDIO2KbWzSIYF4KUsjEH8PLBcmHhU'
);

// ── ROOT-LEVEL REALTIME — بعد createClient مباشرة ──
const rt = sb
  .channel('rt-invoice-views')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'invoice_views'
    },
    (payload) => {
      if(DEBUG) console.log('[RT] EVENT', payload);
      if(window._currentPage === 'invoices'){
        const invId = payload && payload.new && payload.new.invoice_id;
        if(!invId) return;
        const row = document.querySelector(`[data-invoice-id="${invId}"]`);
        if(!row) return;
        const badge = row.querySelector('.views-badge');
        if(!badge) return;
        const cur = Number(badge.dataset.count || 0) + 1;
        badge.dataset.count    = String(cur);
        badge.title            = `فُتحت ${cur} مرة`;
        badge.style.background = '#dcfce7';
        badge.style.color      = '#16a34a';
        badge.style.fontWeight = '700';
        badge.textContent      = `✅ ${cur}`;
      }
    }
  )
  .subscribe((status) => {
    if(DEBUG) console.log('[RT] Subscribe status:', status);
  });

if(DEBUG) console.log('[RT] SUBSCRIBED to rt-invoice-views');

// ── Expose to global scope ──
window.sb    = sb;
window.DEBUG = DEBUG;
window.rt = rt;
window.currentUser = null; // Single source of truth
