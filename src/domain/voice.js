export function voiceProposal(event) {
  if (event.type !== 'response.function_call_arguments.done') return null
  if (event.name !== 'propose_offer_command') throw new Error('Ferramenta indisponível. Continue por texto.')
  if (typeof event.arguments !== 'string' || event.arguments.length > 2400) throw new Error('Sugestão inválida. Continue por texto.')
  let args
  try { args = JSON.parse(event.arguments) } catch { throw new Error('Sugestão inválida. Continue por texto.') }
  if (!args || Array.isArray(args) || Object.keys(args).length !== 1 || typeof args.command !== 'string' || !args.command.trim() || args.command.length > 2000) throw new Error('Sugestão inválida. Continue por texto.')
  return args.command.trim()
}
