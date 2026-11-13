export function createDemoAuth(client, accounts, password) {
  async function participant(expected) {
    const { data, error } = await client.auth.getUser()
    if (error || !data?.user) throw new Error('Não foi possível validar a sessão. Confira a conexão e tente novamente.')
    const account = expected || accounts.find(item => item.email.toLowerCase() === data.user.email?.toLowerCase())
    const result = await client.from('participants').select('*').eq('id', data.user.id).single()
    if (result.error) throw new Error('Não foi possível consultar o participante. Confira a conexão e tente novamente.')
    if (!account || account.email.toLowerCase() !== data.user.email?.toLowerCase() || result.data?.id !== data.user.id || !result.data?.is_demo || result.data.role !== account.role) {
      await client.auth.signOut({ scope: 'local' })
      throw new Error('Esse participante não corresponde a um perfil de demonstração permitido.')
    }
    return { ...account, ...result.data }
  }
  return {
    async restore() {
      const { data, error } = await client.auth.getSession()
      if (error) throw new Error('Não foi possível retomar a sessão. Confira a conexão e tente novamente.')
      return data.session ? participant() : null
    },
    async enter(account) {
      if (!accounts.some(allowed => allowed.id === account.id && allowed.email === account.email && allowed.role === account.role)) {
        throw new Error('Escolha uma das contas de teste permitidas.')
      }
      // A failed profile switch must not resume the previous participant on F5.
      const exit = await client.auth.signOut({ scope: 'local' })
      if (exit.error) throw new Error('Não foi possível encerrar o participante anterior. Tente novamente antes de trocar.')
      const { error } = await client.auth.signInWithPassword({ email: account.email, password })
      if (error) throw new Error('Não foi possível abrir a sessão de demonstração. Confira os usuários fictícios e a configuração do ambiente.')
      return participant(account)
    },
    async leave() {
      const { error } = await client.auth.signOut({ scope: 'local' })
      if (error) throw new Error('Não foi possível sair da sessão. Confira a conexão e tente novamente.')
    },
    subscribe(onSignedOut) {
      // No async Auth calls inside its callback: the client may hold its auth lock.
      const { data } = client.auth.onAuthStateChange(event => { if (event === 'SIGNED_OUT') onSignedOut() })
      return () => data.subscription.unsubscribe()
    },
  }
}
