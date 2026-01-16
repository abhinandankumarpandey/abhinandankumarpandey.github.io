
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://dzkfldxificeblvziagj.supabase.co';
const supabaseKey = 'sb_publishable_SJf-NNdR_UQwozQFzFIGSQ_w759OwZI';

export const supabase = createClient(supabaseUrl, supabaseKey);
