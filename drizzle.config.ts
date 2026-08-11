import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'

// Load .env.local if DATABASE_URL is not set in environment
if (!process.env.DATABASE_URL) {
  config({ path: '.env.local' })
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
})
