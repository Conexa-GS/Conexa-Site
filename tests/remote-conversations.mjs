// Manual only; --check is OFFLINE. --run-demo requires prior authorization.
// No migrations, admin credentials, paid API or real-person messages.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import { setTimeout as delay } from 'node:timers/promises'
import { createClient } from '@supabase/supabase-js'
import { demoConfig, demoProject } from './helpers/conversations-demo-config.mjs'
import { verifyConversations } from './helpers/conversations-acceptance.mjs'

const option = process.argv.slice(2)
if (option.length !== 1 || !['--check', '--run-demo'].includes(option[0])) {
  console.log('Uso: node tests/remote-conversations.mjs --check | --run-demo\n--check: configuração offline, sem autenticação/escrita.\n--run-demo: somente após autorização de migrations/testes; cria histórico fictício persistente.')
  process.exitCode = option[0] === '--help' ? 0 : 1
} else {
  process.loadEnvFile('.env')
  const config = demoConfig(process.env)
  if (option[0] === '--check') {
    console.log(`PASS configuração local do demo ${demoProject}; nenhum login, websocket, RPC, migration ou escrita executado.`)
  } else {
    await run(config)
  }
}

async function run(config) {
  const clients = {}, ids = {}
  const report = { run_id: randomUUID(), project: demoProject, started_at: new Date().toISOString(), status: 'running', checks: [], offers: [], messages: [], conversations: [], archived: [], limitations: ['API/Auth/websocket; sem navegador/F5/revisão visual ou aceite humano.', 'Histórico fictício de mensagens/pedidos permanece; somente ofertas próprias são arquivadas.', 'Janela sem eventos para terceiro não prova ausência de vazamento fora da janela.', 'Cenário de reservas/compromissos/snapshots permanece coberto pela suíte local do bot, não por este roteiro remoto.'] }
  const fresh = () => createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(20000) }) } })
  const check = result => {
    if (result.error) throw Object.assign(new Error(`Falha do demo (${result.error.code || 'sem código'}). Consulte o ambiente sem registrar tokens.`), { code: result.error.code })
    return result.data
  }
  async function login(who) {
    const account = who === 'ana2' ? 'ana' : who
    clients[who] = fresh()
    const session = check(await clients[who].auth.signInWithPassword({ email: config.emails[account], password: config.password }))
    const user = check(await clients[who].auth.getUser()).user
    assert.equal(session.user.id, user.id)
    const participant = check(await clients[who].from('participants').select('id,role,is_demo').eq('id', user.id).single())
    assert.equal(participant.is_demo, true)
    assert.equal(participant.role, { ana: 'producer', joao: 'producer', buyer: 'buyer', carrier: 'carrier' }[account])
    ids[who] = user.id
  }
  const rpc = async (who, fn, action, payload) => check(await clients[who].rpc(fn, { p_action: action, p_payload: payload }))
  const select = async (who, table, filters) => {
    let query = clients[who].from(table).select('*')
    for (const [key, value] of Object.entries(filters)) query = query.eq(key, value)
    return check(await query)
  }
  async function watch(conversationId) {
    const entries = [], events = { buyer: [], joao: [] }, statuses = { buyer: '', joao: '' }, gaps = new Set()
    const close = async () => {
      for (const { who, channel } of entries) {
        await clients[who].removeChannel(channel)
      }
    }
    try {
      for (const who of ['buyer', 'joao']) {
        const channel = clients[who].channel(`t41-${report.run_id}-${who}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'site_messages' }, event => events[who].push(event.new))
        entries.push({ who, channel })
        await new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error(`Timeout ao assinar Realtime (${who}).`)), 15000)
          channel.subscribe(status => {
            statuses[who] = status
            if (status === 'SUBSCRIBED') { clearTimeout(timer); resolve() }
            else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) { gaps.add(who); clearTimeout(timer); reject(new Error(`Realtime indisponível (${who}).`)) }
          })
        })
      }
      return {
        async verify(id) {
          const deadline = Date.now() + 15000
          while (!events.buyer.some(m => m.id === id) && Date.now() < deadline) await delay(100)
          assert.ok(events.buyer.some(m => m.id === id && m.conversation_id === conversationId), 'Sessão membro deve receber o INSERT real')
          await delay(3000)
          assert.equal(events.joao.some(m => m.conversation_id === conversationId), false, 'Terceiro não recebe eventos da conversa observada')
          for (const who of ['buyer', 'joao']) assert.equal(statuses[who], 'SUBSCRIBED', 'Isolamento não pode passar com canal desconectado')
          assert.equal(gaps.size, 0, 'Queda durante a janela torna o teste de isolamento inconclusivo')
        }, close,
      }
    } catch (error) { await close(); throw error }
  }
  try {
    // Distinct clients/tokens; no shared auth storage. Confirm accounts before writes.
    for (const who of ['ana', 'ana2', 'joao', 'buyer', 'carrier']) await login(who)
    clients.anonymous = fresh()
    // Read-only schema check: do not start a partial run when migrations are absent.
    for (const table of ['site_conversations', 'site_conversation_members', 'site_messages', 'site_bot_drafts', 'site_bot_requests']) check(await clients.ana.from(table).select('*').limit(0))
    report.checks.push('Auth real de quatro perfis e segunda sessão do produtor; tabelas de Conversas disponíveis.')
    await verifyConversations({ ids, rpc, select, watch,
      writeOffer: async (who, data, id, version, archive = false) => check(await clients[who].rpc('save_offer', { p_data: data, p_id: id, p_version: version, p_archive: archive })),
      reauthenticate: async who => {
        await clients[who].removeAllChannels()
        check(await clients[who].auth.signOut({ scope: 'local' }))
        await login(who)
      },
    }, report)
    report.status = 'passed'
  } catch (error) {
    report.status = 'failed'
    // Assertions name the failed check; do not persist server payloads, JWTs or env.
    report.failure = error.code === 'ERR_ASSERTION' ? String(error.message).split('\n')[0] : 'Falha de configuração, Auth, RPC, Realtime ou limpeza; critérios remotos não concluídos.'
    process.exitCode = 1
  } finally {
    report.finished_at = new Date().toISOString()
    for (const client of Object.values(clients)) {
      try { await client.removeAllChannels(); check(await client.auth.signOut({ scope: 'local' })) } catch { report.session_cleanup_failed = true; report.status = 'failed'; process.exitCode = 1 }
    }
    await mkdir('artifacts', { recursive: true })
    const path = `artifacts/conversations-${report.run_id}.local.json`
    await writeFile(path, JSON.stringify(report, null, 2))
    console.log(`${report.status === 'passed' ? 'PASS' : 'FAIL'} T41 demo: ${report.checks.length} grupos; ${report.archived.length}/${report.offers.length} ofertas próprias arquivadas. Relatório: ${path}. Sem F5/voz/aceite humano.`)
  }
}
