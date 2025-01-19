import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'


const supabaseUrl = "https://rowkvxtgovjsbzgdxyza.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvd2t2eHRnb3Zqc2J6Z2R4eXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyMzI4NjYsImV4cCI6MjA1MjgwODg2Nn0.M1wi2OA8cNBZJqVJtYg4V4SlY0jMfF-EiJuI-IoZRig"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})