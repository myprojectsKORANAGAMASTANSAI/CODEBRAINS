/**
 * CODE BRAINS — Centralized Cloud Database Configuration
 * ─────────────────────────────────────────────────────────────
 * This file is loaded by all devices (Mobile, Laptop, Desktop, Tablet)
 * to ensure that every device connects to the EXACT SAME central database.
 * 
 * When deployed to Vercel or any host, this file provides the single
 * source of truth for database synchronization across all platforms.
 */

window.CODEBRAINS_GLOBAL_CONFIG = {
    // Active Cloud Provider: 'supabase' | 'firebase' | 'local'
    activeProvider: 'supabase',

    // ── SUPABASE (PostgreSQL + Realtime) ──
    supabase: {
        url: '', // e.g. https://your-project.supabase.co
        anonKey: 'sb_publishable_CBfCxHZJBKdon1YuQIVJpg_Tkgppa39',
        foldersTable: 'cb_folders',
        filesTable: 'cb_files'
    },

    // ── FIREBASE REALTIME DATABASE (Optional backup provider) ──
    firebase: {
        databaseUrl: 'https://codebrains-cloud-db-default-rtdb.firebaseio.com/',
        dbNamespace: 'codebrains_master_store_v2',
        syncIntervalSeconds: 8
    },

    // Global App Settings
    autoSyncOnAction: true,
    enableRealtimeListener: true
};
