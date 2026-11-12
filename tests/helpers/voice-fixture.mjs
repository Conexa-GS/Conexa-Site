// Explicitly fake provider: never requests audio, tokens, network or storage.
export function createVoiceFixture() {
  const starts = [], stops = [], texts = []
  let current
  return {
    starts, stops, texts,
    transcript(text) { current?.onTranscript(text) },
    suggest(text) { current?.onSuggestion(text) },
    service: {
      async start(options) {
        current = options; starts.push(options.mode)
        let stopped = false
        const controls = {
          async stop() { if (stopped) return; stopped = true; stops.push(options.mode); options.onState({ phase: 'closed', reason: 'Sessão simulada encerrada; nenhum microfone foi usado.' }) },
          sendText(text) { texts.push(text) },
        }
        options.onState({ phase: 'connecting', controls })
        options.onState({ phase: 'active', controls, expires: Date.now() + 60000, maxResponses: 4 })
        return controls
      },
    },
  }
}
