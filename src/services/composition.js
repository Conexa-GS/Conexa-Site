// Keep the draft ID for retries: a failed submission must not create another draft.
export async function sendComposition(api, { demandId, items, hours, draft, onDraft }) {
  let proposal = draft
  if (!proposal) {
    try { proposal = { ...await api('draft', { id: demandId, items, hours }), version: 1 } }
    catch (error) {
      // Preserve an uncertain save for review rather than silently sending it.
      const data = await api('list').catch(() => null)
      const saved = data?.loads.find(load => load.demand_id === demandId && load.status === 'draft')
      if (saved) onDraft(saved)
      throw error
    }
  }
  onDraft(proposal)
  try {
    await api('submit', { id: proposal.id, version: proposal.version })
  } catch (error) {
    // A network failure may happen after the database committed the submission.
    const data = await api('list').catch(() => null)
    const saved = data?.loads.find(load => load.id === proposal.id)
    if (saved?.status === 'draft') onDraft(saved)
    if (!saved || !['awaiting_producers', 'awaiting_quotes', 'awaiting_final_approval', 'awaiting_payment'].includes(saved.status)) throw error
  }
  return proposal
}
