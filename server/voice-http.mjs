// Fetch-style handler shared by the local Node server and offline tests.
export function createVoiceHandler({ config, broker }) {
  return async request => {
    const origin = request.headers.get('origin')
    const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json', Vary: 'Origin' }
    const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })
    if (!config) return reply({ error: 'Voz desabilitada. Continue por texto.' }, 503)
    if (origin !== config.origin) return reply({ error: 'Origem não permitida.' }, 403)
    headers['Access-Control-Allow-Origin'] = origin
    if (request.method === 'OPTIONS') {
      headers['Access-Control-Allow-Methods'] = 'POST, GET, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
      return new Response(null, { status: 204, headers })
    }
    const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/)?.[1]
    if (!token) return reply({ error: 'Entre em um perfil demo para iniciar.' }, 401)
    const path = new URL(request.url).pathname
    try {
      if (request.method === 'POST' && path === '/api/voice/sessions') {
        if (!request.headers.get('content-type')?.startsWith('application/json')) return reply({ error: 'Formato inválido.' }, 415)
        const text = await request.text()
        if (text.length > 70000) return reply({ error: 'Pedido excede o limite.' }, 413)
        return reply(await broker.start(token, JSON.parse(text)))
      }
      const id = path.match(/^\/api\/voice\/sessions\/([\w-]{1,80})$/)?.[1]
      if (id && request.method === 'GET') return reply(await broker.status(token, id))
      if (id && request.method === 'DELETE') return reply(await broker.close(token, id))
      return reply({ error: 'Rota indisponível.' }, 404)
    } catch (error) {
      // Never return provider bodies, credentials, SDP or internal exceptions.
      return reply({ error: error.publicMessage || 'Não foi possível concluir a sessão. Continue por texto; não houve repetição automática.' }, 409)
    }
  }
}
