import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
export const isRemote = Boolean(url && key)
export const supabase = isRemote ? createClient(url, key, { auth: { persistSession: false } }) : null
