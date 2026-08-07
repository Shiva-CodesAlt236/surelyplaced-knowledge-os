import type { ICopilotAIProvider } from './types'
import { MockCopilotProvider } from './mock'
import { ProductionCopilotProvider } from './production'

let cachedProvider: ICopilotAIProvider | null = null

/**
 * Returns the configured Copilot AI Provider.
 * Defaults to `MockCopilotProvider` unless `COPILOT_AI_PROVIDER=production`.
 */
export function getCopilotAIProvider(): ICopilotAIProvider {
  if (cachedProvider) return cachedProvider

  const providerType = process.env.NEXT_PUBLIC_COPILOT_AI_PROVIDER || process.env.COPILOT_AI_PROVIDER || 'mock'

  if (providerType === 'production') {
    cachedProvider = new ProductionCopilotProvider()
  } else {
    cachedProvider = new MockCopilotProvider()
  }

  return cachedProvider
}
