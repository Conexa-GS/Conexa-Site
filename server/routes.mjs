import { createServer } from 'node:http'
import { createClient } from '@supabase/supabase-js'
import { createRoutesHandler } from './routes-handler.mjs'

const apiKey = process.env.GOOGLE_MAPS_ROUTES_KEY
const origin = process.env.CONEXA_ROUTES_ORIGIN || 'http://localhost:5173'
const handle = createRoutesHandler({ apiKey, origin, authenticate: async token => {
  const client = createClient(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL, process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } })
  const { data, error } = await client.auth.getUser(token)
  if (error || !data.user) throw Object.assign(new Error('Sessão inválida.'), { publicMessage: 'Sessão inválida. Entre novamente.', status: 401 })
  const { data: participant, error: denied } = await client.from('participants').select('id,role').eq('id', data.user.id).single()
  if (denied || !participant) throw Object.assign(new Error('Acesso negado.'), { publicMessage: 'Participante sem acesso ao cálculo.', status: 403 })
  return participant
} })
const server = createServer(async (req, res) => {
  try {
    let size = 0
    const chunks = []
    for await (const chunk of req) {
      size += chunk.length
      if (size > 10000) { res.writeHead(413, { 'Cache-Control': 'no-store' }).end(); return }
      chunks.push(chunk)
    }
    const response = await handle(new Request(`http://localhost${req.url}`, { method: req.method, headers: req.headers,
      ...(['GET', 'HEAD'].includes(req.method) ? {} : { body: Buffer.concat(chunks) }) }))
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(await response.text())
  } catch { res.writeHead(500, { 'Cache-Control': 'no-store' }).end() }
})
server.requestTimeout = 20000
server.headersTimeout = 10000
server.listen(Number(process.env.CONEXA_ROUTES_PORT || 8788), '127.0.0.1', () => console.log(`Conexa Routes: ${apiKey ? 'configurado; consultas somente por ação explícita' : 'aguarda chave; nenhuma API chamada'}.`))
process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
