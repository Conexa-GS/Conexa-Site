import { DatabaseSync } from 'node:sqlite'
import { randomUUID } from 'node:crypto'

// Conservative quotas: a reserved attempt counts even if negotiation fails.
// The dedicated server runs as ONE instance; SQLite survives its restarts.
export function createVoiceLedger(filename) {
  const fail = message => { throw Object.assign(new Error(message), { publicMessage: message }) }
  const db = new DatabaseSync(filename)
  db.exec(`PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS voice_leases (
      id TEXT PRIMARY KEY, owner TEXT NOT NULL, day TEXT NOT NULL,
      expires INTEGER NOT NULL, call_id TEXT, status TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS voice_one_active ON voice_leases(owner) WHERE status = 'active';`)
  return {
    reserve(owner, config, now = Date.now()) {
      db.exec('BEGIN IMMEDIATE')
      try {
        // An uncertain live call must be recovered by the server, never replaced.
        if (db.prepare("SELECT id FROM voice_leases WHERE owner=? AND status='active'").get(owner)) fail('Há uma sessão ativa ou encerramento a verificar. Aguarde.')
        const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
        if (db.prepare('SELECT count(*) AS n FROM voice_leases WHERE owner=? AND day=?').get(owner, day).n >= config.daily) fail('Limite diário de sessões atingido. Continue por texto.')
        const lease = { id: randomUUID(), owner, expires: now + config.duration * 1000 }
        db.prepare("INSERT INTO voice_leases VALUES(?,?,?,?,NULL,'active')").run(lease.id, owner, day, lease.expires)
        db.exec('COMMIT'); return lease
      } catch (error) { db.exec('ROLLBACK'); throw error }
    },
    attach(id, callId) { db.prepare('UPDATE voice_leases SET call_id=? WHERE id=?').run(callId, id) },
    end(id) { db.prepare("UPDATE voice_leases SET status='ended' WHERE id=?").run(id) },
    active() { return db.prepare("SELECT * FROM voice_leases WHERE status='active'").all() },
    close() { db.close() },
  }
}
