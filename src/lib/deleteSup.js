import { supabase } from '@/lib/supabaseClient'

export async function deleteRowUUID(uuid, table, column = 'uuid') {
  try {
    if (!uuid || !table || !column) {
      return { ok: false, error: new Error('Parametri mancanti in deleteRowUUID') }
    }

    const { data, error, count } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .eq(column, uuid)
      .select()

    if (error) {
      console.error('[deleteRowUUID] Supabase error:', error)
      return { ok: false, error }
    }
    if (!count || count === 0) {
      return { ok: false, error: new Error('Nessuna riga eliminata: chiave non trovata o policy/FK') }
    }
    return { ok: true, data: data?.[0] }
  } catch (e) {
    console.error('[deleteRowUUID] unexpected exception:', e)
    return { ok: false, error: e }
  }
} 