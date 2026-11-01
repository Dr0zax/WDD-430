import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY;

export function createServerClient(accessToken) {
    return createClient(supabaseUrl, supabaseKey, accessToken ? {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    } : undefined);
}
