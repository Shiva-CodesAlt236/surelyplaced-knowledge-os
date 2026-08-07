import type { CopilotAIProvider } from './types'
import { mockProvider } from './mock'
import { productionProvider } from './production'

/**
 * Environment-based Copilot AI Provider selection.
 * Defaults to mock provider unless COPILOT_AI_PROVIDER=production.
 */
export function getCopilotAIProvider(): CopilotAIProvider {
  const providerType = process.env.NEXT_PUBLIC_COPILOT_AI_PROVIDER || process.env.COPILOT_AI_PROVIDER || 'mock'
  if (providerType === 'production') {
    return productionProvider
  }
  return mockProvider
}

export * from './types'
export { mockProvider } from './mock'
export { productionProvider } from './production'
