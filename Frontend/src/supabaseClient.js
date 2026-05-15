import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://wkzyzwplpwnheyrspoyl.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_LZRT583_5Rd1xH8ZwdE3tg_BaI_Sppz';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabasePublishableKey =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(
    supabaseUrl,
    supabasePublishableKey,
    {
    db: {
      schema: 'chat'
    }
  }
)
