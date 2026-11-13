import { supabase } from './supabase'

export async function estimateRoute(journey) {
  const { data } = supabase ? await supabase.auth.getSession() : { data: {} }
  if (!data.session?.access_token) throw new Error('Entre em uma conta de transportadora conectada para calcular com Google Maps.')
  let response
  try {
    response = await fetch('/api/routes/estimate', { method: 'POST', headers: { Authorization: `Bearer ${data.session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(journey), signal: AbortSignal.timeout(18000) })
  } catch { throw new Error('Serviço de rotas indisponível. Verifique se o servidor de rotas está iniciado; a cotação manual continua disponível.') }
  let result
  try { result = await response.json() } catch { throw new Error('Servidor de rotas indisponível ou sem configuração. Continue com a cotação manual.') }
  if (!response.ok) throw new Error(result.error || 'Não foi possível calcular o trajeto.')
  return result
}
