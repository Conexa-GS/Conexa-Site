import { useState } from 'react'
import { ArrowRight, ArrowLeft, Plant, Basket, Truck, Eye, EyeSlash, Code, CheckCircle } from '@phosphor-icons/react'
import { Link, ErrorNotice } from '../components/ui'
import { accountAuth, developerAccessEnabled } from '../services/offers'
import { navigate } from '../hooks/useRouter'
import { homeFor } from '../domain/profiles'
import './login.css'

const profiles = [
  { role: 'producer', label: 'Produtor', icon: Plant, art: 'produtora', line: 'Sua colheita tem\nnovos caminhos.', copy: 'Ofereça sua produção e encontre quem valoriza o que vem do campo.' },
  { role: 'buyer', label: 'Comprador', icon: Basket, art: 'mercado', line: 'Mais perto de\nquem produz.', copy: 'Encontre alimentos de pequenos produtores e reúna suas compras.' },
  { role: 'carrier', label: 'Transportador', icon: Truck, art: 'transportadora', line: 'Cada caminho,\numa conexão.', copy: 'Conecte coletas e entregas para levar o campo mais longe.' },
]
export default function Login({ auth, reset = false, service = accountAuth }) {
  const preferred = new URLSearchParams(window.location.search).get('perfil')
  const [role, setRole] = useState(({ produtor: 'producer', comprador: 'buyer', transportador: 'carrier' })[preferred] || 'producer')
  const [mode, setMode] = useState(reset ? 'reset' : 'login')
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const profile = profiles.find(p => p.role === role)
  const busy = pending || auth.pending || auth.restoring
  function changeMode(next) { setMode(next); setError(''); setNotice(''); auth.clearError?.() }
  async function submit(event) {
    event.preventDefault()
    if (busy) return
    const fields = Object.fromEntries(new FormData(event.currentTarget))
    setPending(true); setError(''); setNotice('')
    try {
      if (mode === 'recover') {
        await service.recover(fields.email, `${window.location.origin}/redefinir-senha`)
        setNotice('Se houver uma conta com este e-mail, você receberá um link para criar uma nova senha.')
      } else if (mode === 'reset') {
        await service.updatePassword(fields.password)
        if (await auth.leave()) { changeMode('login'); setNotice('Senha atualizada. Entre com sua nova senha.'); navigate('/login') }
      } else {
        if (mode === 'signup') {
          const result = await service.register({ ...fields, role }, `${window.location.origin}/login`)
          if (result.confirmationRequired) { setNotice('Confira seu e-mail para confirmar o cadastro. Se você já tem uma conta, entre com sua senha.'); return }
        }
        const participant = await auth.enter({ email: fields.email, password: fields.password, role })
        if (participant) navigate(homeFor(participant.role))
      }
    } catch (failure) { setError(failure.message) }
    finally { setPending(false) }
  }
  return <div className="login-page">
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header className="login-header"><Link href="/" className="brand-link" aria-label="Conexa, início"><img src="/assets/marca/conexa-logo-claro.svg" width="168" height="39" alt="Conexa" /></Link><Link href="/" className="login-back"><ArrowLeft size={17} />Voltar ao início</Link></header>
    <main className="login-main" id="conteudo" tabIndex={-1}>
      <aside className="login-story" aria-label="Sua conexão com o campo">
        <p className="login-kicker"><span /> Do campo pra cidade. Mais juntos.</p>
        <h2>{profile.line.split('\n').map((line, i) => <span key={line}>{line}{i === 0 && <br />}</span>)}</h2>
        <p className="login-story-copy">{profile.copy}</p>
        <div className="login-story-bottom"><span>Pequenas ofertas.<br /><strong>Novas conexões.</strong></span><img src="/assets/marca/conexa-simbolo.svg" alt="" width="44" height="44" /></div>
      </aside>
      <section className="login-entry" aria-labelledby="login-title">
        <div className="login-entry-inner">
          {!['recover', 'reset'].includes(mode) && <div className="login-tabs" aria-label="Acesso à conta"><button type="button" aria-pressed={mode === 'login'} onClick={() => changeMode('login')} disabled={busy}>Entrar</button><button type="button" aria-pressed={mode === 'signup'} onClick={() => changeMode('signup')} disabled={busy}>Criar conta</button></div>}
          <p className="login-kicker">SEU ESPAÇO NA CONEXA</p>
          <h1 id="login-title">{({ login: 'Bom ter você aqui.', signup: 'Vamos nos conectar.', recover: 'Recupere seu acesso.', reset: 'Uma nova senha.' })[mode]}</h1>
          <p className="login-intro">{({ login: 'Entre para continuar suas conexões.', signup: 'Sua próxima conexão começa por aqui.', recover: 'Vamos enviar um link para o seu e-mail.', reset: 'Escolha uma senha para voltar à sua conta.' })[mode]}</p>
          {auth.session && mode !== 'reset' ? <div className="login-current"><p>Você está conectado como <strong>{auth.session.display_name || auth.session.name}</strong>.</p><Link className="login-submit" href={homeFor(auth.session.role)}>Ir para meu espaço <ArrowRight size={20} /></Link><button className="login-text-button" onClick={auth.leave} disabled={busy}>Sair desta conta</button></div> : <>
            {['login', 'signup'].includes(mode) && <fieldset className="login-profiles" disabled={busy}><legend>Eu sou</legend><div>{profiles.map(({ role: value, label, icon: Icon }) => <label key={value} className={role === value ? 'selected' : ''}><input type="radio" name="profile" value={value} checked={role === value} onChange={() => { setRole(value); setError('') }} /><Icon size={21} weight={role === value ? 'fill' : 'regular'} /><span>{label}</span></label>)}</div></fieldset>}
            <form onSubmit={submit} aria-busy={busy}>
              <fieldset className="login-fields" disabled={busy}>
                {mode === 'signup' && <label className="login-field"><span>Como podemos chamar você?</span><input name="name" autoComplete="name" placeholder="Seu nome ou negócio" required minLength={2} maxLength={120} /></label>}
                {mode !== 'reset' && <label className="login-field"><span>E-mail</span><input name="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" required /></label>}
                {mode !== 'recover' && <label className="login-field"><span>{mode === 'reset' ? 'Nova senha' : 'Senha'}</span><span className="login-password"><input name="password" type={visible ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder={mode === 'login' ? 'Sua senha' : 'Pelo menos 8 caracteres'} required minLength={mode === 'login' ? 1 : 8} maxLength={128} /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}>{visible ? <EyeSlash size={21} /> : <Eye size={21} />}</button></span></label>}
              </fieldset>
              {mode === 'login' && <button className="login-forgot" type="button" onClick={() => changeMode('recover')} disabled={busy}>Esqueci minha senha</button>}
              {(error || auth.error) && <ErrorNotice autoFocus title="Vamos tentar de novo">{error || auth.error}</ErrorNotice>}
              {notice && <p className="login-notice" role="status"><CheckCircle size={22} />{notice}</p>}
              <button className="login-submit" disabled={busy}>{busy ? 'Só um instante…' : ({ login: 'Entrar na minha conta', signup: 'Criar minha conta', recover: 'Enviar link de recuperação', reset: 'Salvar nova senha' })[mode]}<ArrowRight size={20} /></button>
              {['recover', 'reset'].includes(mode) && <button className="login-text-button" type="button" onClick={() => { changeMode('login'); if (reset) navigate('/login') }} disabled={busy}>Voltar para entrar</button>}
            </form>
          </>}
          {developerAccessEnabled && <div className="login-developer"><Link href="/demo"><Code size={19} />Entrar como desenvolvedor<ArrowRight size={16} /></Link><p>Contas de teste para conhecer todos os perfis.</p></div>}
        </div>
      </section>
    </main>
    <footer className="login-footer"><span>Conexa · Conexões que vêm do campo.</span><span>Ambiente acadêmico · pagamentos e entregas simulados</span></footer>
  </div>
}
