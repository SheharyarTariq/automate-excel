import { createClient } from "@supabase/supabase-js";
import { config } from "../config";

const supabaseUrl = config.supabaseUrl || "https://placeholder.supabase.co";
const supabaseAnonKey = config.supabaseAnonKey || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
