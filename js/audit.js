// ════════════════════════════════════════
// js/audit.js — v66.9
// Wadi Al-Taqaa ERP
// ════════════════════════════════════════

async function logInvoiceAction(action, invoiceId, before, after) {
  try {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    await sb
      .from('invoice_history')
      .insert({
        invoice_id: invoiceId,
        action:     action,
        before:     before || null,
        after:      after  || null,
        user_id:    user.id
      });
  } catch(_) {}
}

async function logError(message, stack, context) {
  try {
    const { data: { user } } = await sb.auth.getUser();
    await sb
      .from('error_logs')
      .insert({
        error_message: String(message),
        stack:         stack    || null,
        user_id:       user?.id || null,
        context:       context  || null
      });
  } catch(_) {}
}

async function softDeleteInvoice(invoiceId) {
  const { data: { user }, error: authError } = await sb.auth.getUser();
  if (authError || !user) throw new Error('Not authenticated');

  const { data: before, error: fetchError } = await sb
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await sb
    .from('invoices')
    .update({
      is_deleted: true,
      deleted_at: new Date().toISOString()
    })
    .eq('id', invoiceId);

  if (error) throw error;

  await logInvoiceAction('delete', invoiceId, before, null);
}

async function createInvoiceWithAudit(clientId, total) {
  const { data: { user }, error: authError } = await sb.auth.getUser();
  if (authError || !user) throw new Error('Not authenticated');

  const { data, error } = await sb
    .from('invoices')
    .insert({
      user_id:    user.id,
      client_id:  clientId,
      total:      total,
      status:     'draft',
      is_deleted: false
    })
    .select()
    .single();

  if (error) throw error;

  await logInvoiceAction('create', data.id, null, data);
  return data;
}

async function updateInvoiceWithAudit(invoiceId, updates) {
  const { data: { user }, error: authError } = await sb.auth.getUser();
  if (authError || !user) throw new Error('Not authenticated');

  const { data: before, error: fetchError } = await sb
    .from('invoices')
    .select('*')
    .eq('id', invoiceId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await sb
    .from('invoices')
    .update(updates)
    .eq('id', invoiceId)
    .select()
    .single();

  if (error) throw error;

  await logInvoiceAction('update', invoiceId, before, data);
  return data;
}
