import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './schema'

// Cette fonction crée une connexion à la base de données
export function useDB() {
  const config = useRuntimeConfig()
  const sql = neon(config.databaseUrl)
  return drizzle(sql, { schema })
}

export { schema }
