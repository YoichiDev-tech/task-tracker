import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.https://mfhtmnytbkcxhwxgdjml.supabase.co/rest/v1/;
const supabaseAnonKey = import.meta.env.sb_publishable_TM9KX9QpBsAQheDP7Nx4bA_A8Q14nDR;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);