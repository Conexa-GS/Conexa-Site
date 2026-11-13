const roles = ['producer', 'buyer', 'carrier']

export function createAccountAuth(client, demo, demoEnabled = false) {
  const configured = () => { if (!client) throw new Error('O acesso por conta precisa da conexão com o servidor. Use a demonstração local para testar.') }
  async function participant(expectedRole) {
    const { data, error } = await client.auth.getUser()
    if (error || !data?.user) throw new Error('Não foi possível validar sua sessão. Confira a conexão e entre novamente.')
    const result = await client.from('participants').select('*').eq('id', data.user.id).single()
    if (result.error) throw new Error('Não foi possível carregar seu perfil. Tente entrar novamente.')
    const profile = result.data
    if (!roles.includes(profile?.role) || (expectedRole && profile.role !== expectedRole)) {
      await client.auth.signOut({ scope: 'local' })
      throw new Error('Esta conta pertence a outro tipo de usuário. Selecione o perfil usado no cadastro.')
    }
    if (profile.account_kind !== 'personal') {
      if (!demoEnabled) { await client.auth.signOut({ scope: 'local' }); throw new Error('Contas de teste estão desativadas neste ambiente.') }
      return { ...await demo.restore(), access: 'developer' }
    }
    return { ...profile, access: 'personal' }
  }
  return {
    async restore() {
      if (!client) return null
      const { data, error } = await client.auth.getSession()
      if (error) throw new Error('Não foi possível retomar sua sessão. Confira a conexão.')
      return data.session ? participant() : null
    },
    async enter(input) {
      if (!Object.hasOwn(input, 'password')) {
        if (!demoEnabled) throw new Error('O acesso de desenvolvedor está desativado neste ambiente.')
        return { ...await demo.enter(input), access: 'developer' }
      }
      configured()
      if (typeof input.password !== 'string' || !input.password) throw new Error('Informe seu e-mail e sua senha para entrar.')
      const exit = await client.auth.signOut({ scope: 'local' })
      if (exit.error) throw new Error('Não foi possível encerrar a sessão anterior. Tente novamente.')
      const { error } = await client.auth.signInWithPassword({ email: input.email.trim(), password: input.password })
      if (error) throw new Error(error.code === 'email_not_confirmed' ? 'Confirme seu e-mail antes de entrar. Confira sua caixa de entrada.' : 'Não foi possível entrar. Confira e-mail e senha ou tente novamente em instantes.')
      return participant(input.role)
    },
    async register({ email, password, name, role }, redirectTo) {
      configured()
      if (!roles.includes(role) || name.trim().length < 2 || password.length < 8) throw new Error('Informe seu nome, escolha um perfil e use uma senha com pelo menos 8 caracteres.')
      const { data, error } = await client.auth.signUp({ email: email.trim(), password, options: { data: { display_name: name.trim(), role, conexa_signup: 'personal' }, emailRedirectTo: redirectTo } })
      if (error) throw new Error('Não foi possível criar sua conta. Confira os dados ou tente novamente em instantes.')
      return { confirmationRequired: !data.session }
    },
    async recover(email, redirectTo) {
      configured()
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), { redirectTo })
      if (error) throw new Error('Não foi possível enviar o link agora. Tente novamente em instantes.')
    },
    async updatePassword(password) {
      configured()
      if (password.length < 8) throw new Error('Use uma senha com pelo menos 8 caracteres.')
      const { error } = await client.auth.updateUser({ password })
      if (error) throw new Error('Não foi possível atualizar a senha. Solicite um novo link de recuperação.')
    },
    async leave() { if (client) { const { error } = await client.auth.signOut({ scope: 'local' }); if (error) throw new Error('Não foi possível sair. Tente novamente.') } },
    subscribe(callback) { return demo.subscribe(callback) },
  }
}
