export const demoProject = 'ppbneiusqlitvewwoact'

export function demoConfig(env) {
  let url
  try { url = new URL(env.VITE_SUPABASE_URL) } catch { throw new Error('Configure a URL do Supabase demo em .env.') }
  if (url.origin !== `https://${demoProject}.supabase.co` || url.pathname !== '/' || url.search || url.hash || url.username || url.password) {
    throw new Error('Teste restrito ao Supabase demo Conexa; destino diferente rejeitado.')
  }
  if (!env.VITE_SUPABASE_PUBLISHABLE_KEY || !env.VITE_DEMO_PASSWORD) throw new Error('Configure a chave pública e a senha descartável do demo em .env.')
  // No service_role, admin key, OpenAI or server credentials are accepted.
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (key.startsWith('sb_secret_')) throw new Error('Use somente a chave pública do demo.')
  if (!key.startsWith('sb_publishable_')) {
    try {
      const payload = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString())
      if (payload.role !== 'anon' || payload.ref !== demoProject) throw new Error()
    } catch { throw new Error('Use a chave pública anon/publishable do mesmo demo; chave administrativa rejeitada.') }
  }
  return {
    url: url.origin, key, password: env.VITE_DEMO_PASSWORD,
    emails: Object.fromEntries(['ana', 'joao', 'buyer', 'carrier'].map(name => [name, env[`VITE_DEMO_${name.toUpperCase()}_EMAIL`] || `${{ buyer: 'comprador', carrier: 'transporte' }[name] || name}@conexa.invalid`])),
  }
}
