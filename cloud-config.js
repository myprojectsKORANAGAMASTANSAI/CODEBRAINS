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
    // Active Cloud Provider: 'firebase' | 'supabase' | 'custom'
    activeProvider: 'firebase',

    // ── FIREBASE REALTIME DATABASE (Recommended for Instant Live Sync) ──
    firebase: {
        // Shared Realtime Database endpoint for CODE BRAINS
        databaseUrl: 'https://codebrains-cloud-db-default-rtdb.firebaseio.com/',
        // Unique cluster / root path for your organization's projects
        dbNamespace: 'codebrains_master_store_v2',
        // Auto Realtime sync interval in seconds (if SSE is not supported)
        syncIntervalSeconds: 8
    },

    // ── SUPABASE (PostgreSQL + Realtime) ──
    supabase: {
        url: '', // e.g. https://your-project.supabase.co
        anonKey: '', // e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
        foldersTable: 'cb_folders',
        filesTable: 'cb_files'
    },

    // Global App Settings
    autoSyncOnAction: true,
    enableRealtimeListener: true
};
