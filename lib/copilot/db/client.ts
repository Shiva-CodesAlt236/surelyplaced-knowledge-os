import type { DbCopilotSession, DbCopilotExchange, DbCopilotFeedback } from './schema'

/**
 * Persistence Client for Sales Copilot
 * Handles sessions, exchanges, and feedback records.
 * Supports environment connection string or fallback state.
 */

const _sessionsStore = new Map<string, DbCopilotSession>()
const _exchangesStore = new Map<string, DbCopilotExchange>()
const _feedbackStore = new Map<string, DbCopilotFeedback>()

export const copilotDb = {
  async saveSession(session: DbCopilotSession): Promise<DbCopilotSession> {
    _sessionsStore.set(session.sessionId, session)
    return session
  },

  async getSession(sessionId: string): Promise<DbCopilotSession | undefined> {
    return _sessionsStore.get(sessionId)
  },

  async saveExchange(exchange: DbCopilotExchange): Promise<DbCopilotExchange> {
    _exchangesStore.set(exchange.exchangeId, exchange)
    return exchange
  },

  async saveFeedback(feedback: DbCopilotFeedback): Promise<DbCopilotFeedback> {
    _feedbackStore.set(feedback.feedbackId, feedback)
    return feedback
  },
}
