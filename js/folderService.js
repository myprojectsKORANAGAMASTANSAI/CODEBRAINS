/**
 * CODE BRAINS — Supabase Folder Service
 * ─────────────────────────────────────────────────────────────
 * Handles CRUD operations for folders stored in the Supabase
 * PostgreSQL `cb_folders` table.
 */

(function(window) {
    const TABLE_NAME = 'cb_folders';

    async function getFolders() {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) return null;

        const { data, error } = await client
            .from(TABLE_NAME)
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error("[FolderService] getFolders error:", error);
            throw new Error(error.message);
        }

        return (data || []).map(f => ({
            id: f.id,
            parentId: f.parent_id || 'root',
            name: f.name,
            category: f.category || 'General',
            date: f.date || (f.created_at ? f.created_at.split('T')[0] : new Date().toISOString().split('T')[0])
        }));
    }

    async function createFolder({ id, parentId = 'root', name, category = 'General', date }) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        const folderId = id || ('f_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6));
        const formattedDate = date || new Date().toISOString().split('T')[0];

        const payload = {
            id: folderId,
            parent_id: parentId || 'root',
            name: name.trim(),
            category: category || 'General',
            date: formattedDate,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await client
            .from(TABLE_NAME)
            .upsert(payload)
            .select();

        if (error) {
            console.error("[FolderService] createFolder error:", error);
            throw new Error(error.message);
        }

        return {
            id: folderId,
            parentId: payload.parent_id,
            name: payload.name,
            category: payload.category,
            date: payload.date
        };
    }

    async function renameFolder(id, newName) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        const { error } = await client
            .from(TABLE_NAME)
            .update({ 
                name: newName.trim(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error("[FolderService] renameFolder error:", error);
            throw new Error(error.message);
        }

        return true;
    }

    async function deleteFolder(id) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        // 1. Find all files in this folder to clean up from Storage
        try {
            const { data: filesToDelete } = await client
                .from('cb_files')
                .select('id, storage_path')
                .eq('folder_id', id);

            if (filesToDelete && filesToDelete.length > 0) {
                for (const file of filesToDelete) {
                    if (file.storage_path && window.CodeBrainsStorageService) {
                        await window.CodeBrainsStorageService.deleteFile(file.storage_path);
                    }
                }
            }
        } catch (e) {
            console.warn("[FolderService] Storage cleanup during folder delete:", e);
        }

        // 2. Delete the folder from PostgreSQL (cascade deletes files row)
        const { error } = await client
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("[FolderService] deleteFolder error:", error);
            throw new Error(error.message);
        }

        return true;
    }

    window.CodeBrainsFolderService = {
        getFolders: getFolders,
        createFolder: createFolder,
        renameFolder: renameFolder,
        deleteFolder: deleteFolder
    };
})(window);
