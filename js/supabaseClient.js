/**
 * CODE BRAINS — Supabase Client Module
 * ─────────────────────────────────────────────────────────────
 * Provides a centralized, reusable Supabase client instance
 * configured with the project URL and publishable anon key.
 */

(function(window) {
    const STORAGE_KEY = 'codebrains_universal_cloud_config_v2';
    let clientInstance = null;

    function getActiveConfig() {
        const globalCfg = window.CODEBRAINS_GLOBAL_CONFIG || {};
        let config = {
            provider: globalCfg.activeProvider || 'supabase',
            supabaseUrl: (globalCfg.supabase && globalCfg.supabase.url) || '',
            supabaseKey: (globalCfg.supabase && (globalCfg.supabase.anonKey || globalCfg.supabase.publishableKey)) || 'sb_publishable_CBfCxHZJBKdon1YuQIVJpg_Tkgppa39',
            foldersTable: (globalCfg.supabase && globalCfg.supabase.foldersTable) || 'cb_folders',
            filesTable: (globalCfg.supabase && globalCfg.supabase.filesTable) || 'cb_files',
            storageBucket: (globalCfg.supabase && globalCfg.supabase.storageBucket) || 'files'
        };

        try {
            const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('codebrains_supabase_config_v1');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.supabaseUrl && !parsed.supabaseUrl.includes('xyzcompany')) {
                    config.supabaseUrl = parsed.supabaseUrl;
                }
                if (parsed.supabaseKey) {
                    config.supabaseKey = parsed.supabaseKey;
                }
                if (parsed.provider) {
                    config.provider = parsed.provider;
                }
            }
        } catch (e) {
            console.warn("[SupabaseClient] Error reading config from storage:", e);
        }

        return config;
    }

    function getSupabaseClient() {
        if (clientInstance) return clientInstance;
        const config = getActiveConfig();

        if (!config.supabaseUrl || !config.supabaseKey || config.supabaseUrl.includes('xyzcompany')) {
            return null;
        }

        if (typeof window.supabase === 'undefined' || typeof window.supabase.createClient !== 'function') {
            console.error("[SupabaseClient] Supabase SDK library (@supabase/supabase-js) is not loaded.");
            return null;
        }

        try {
            clientInstance = window.supabase.createClient(config.supabaseUrl, config.supabaseKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true
                }
            });
            return clientInstance;
        } catch (err) {
            console.error("[SupabaseClient] Failed to initialize Supabase client:", err);
            return null;
        }
    }

    function resetSupabaseClient() {
        clientInstance = null;
        return getSupabaseClient();
    }

    async function testConnection() {
        const client = getSupabaseClient();
        if (!client) {
            return {
                ok: false,
                message: "Missing Supabase Project URL or Publishable Key"
            };
        }

        try {
            const config = getActiveConfig();
            const { data, error } = await client.from(config.foldersTable).select('id').limit(1);
            if (error) {
                if (error.message && (error.message.includes('does not exist') || error.code === '42P01')) {
                    return {
                        ok: false,
                        tableMissing: true,
                        message: `Table "${config.foldersTable}" does not exist. Run the SQL schema in Supabase SQL Editor.`
                    };
                }
                return { ok: false, message: error.message };
            }
            return { ok: true, message: "Connected to Supabase PostgreSQL Database successfully!" };
        } catch (err) {
            return { ok: false, message: err.message || "Failed to connect to Supabase." };
        }
    }

    window.CodeBrainsSupabase = {
        getConfig: getActiveConfig,
        getClient: getSupabaseClient,
        resetClient: resetSupabaseClient,
        testConnection: testConnection
    };
})(window);
