import fs from 'fs/promises'
import { createClient } from '@supabase/supabase-js'

const envPath = new URL('../.env.local', import.meta.url)
let content = ''
try {
  content = await fs.readFile(envPath, { encoding: 'utf8' })
} catch {
  console.error('.env.local not found or unreadable')
  process.exit(2)
}

for (const line of content.split(/\r?\n/)) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const idx = trimmed.indexOf('=')
  if (idx === -1) continue
  const key = trimmed.slice(0, idx)
  const val = trimmed.slice(idx + 1)
  process.env[key] = val
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL and one of SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY in .env.local'
  )
  process.exit(2)
}

const supabase = createClient(url, serviceKey)

try {
  const res = await supabase.auth.admin.listUsers({ per_page: 1 })
  console.log('Supabase connection OK — admin.listUsers response:')
  console.log(JSON.stringify(res, null, 2))
} catch (err) {
  console.error('Supabase request failed:')
  console.error(err instanceof Error ? err.message : String(err))
  process.exitCode = 3
}
