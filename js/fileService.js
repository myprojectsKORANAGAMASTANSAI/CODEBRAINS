/**
 * CODE BRAINS — Supabase File Service
 * ─────────────────────────────────────────────────────────────
 * Coordinates physical file uploads to Supabase Storage and
 * metadata storage in the PostgreSQL `cb_files` table.
 */

(function(window) {
    const TABLE_NAME = 'cb_files';

    async function getFiles() {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) return null;

        const { data, error } = await client
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[FileService] getFiles error:", error);
            throw new Error(error.message);
        }

        return (data || []).map(f => ({
            id: f.id,
            folderId: f.folder_id || 'root',
            name: f.name,
            type: f.type || 'code',
            size: f.size || '1.0 KB',
            storagePath: f.storage_path || null,
            mimeType: f.mime_type || '',
            url: f.url || (f.storage_path ? window.CodeBrainsStorageService?.getFileUrl(f.storage_path) : ''),
            date: f.date || (f.created_at ? f.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
            content: f.content || ''
        }));
    }

    /**
     * Upload a physical File/Blob and persist its metadata to Supabase
     */
    async function uploadFile({ fileObject, folderId = 'root', category = 'auto', textContent = null }) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const fileName = fileObject.name || 'unnamed_file';
        let storagePath = null;
        let publicUrl = '';
        let mimeType = fileObject.type || 'application/octet-stream';
        let formattedSize = '1.0 KB';

        // 1. Upload the physical binary / media to Supabase Storage
        if (window.CodeBrainsStorageService) {
            try {
                const uploadRes = await window.CodeBrainsStorageService.uploadFile(fileObject, folderId, fileName);
                storagePath = uploadRes.storagePath;
                publicUrl = uploadRes.url;
                mimeType = uploadRes.mimeType;
                formattedSize = uploadRes.size;
            } catch (storageErr) {
                console.warn("[FileService] Storage upload failed, attempting fallback:", storageErr);
                throw storageErr;
            }
        }

        // 2. Prepare metadata payload for PostgreSQL
        const payload = {
            id: fileId,
            folder_id: folderId || 'root',
            name: fileName,
            type: category,
            size: formattedSize,
            storage_path: storagePath,
            mime_type: mimeType,
            url: publicUrl,
            date: new Date().toISOString().split('T')[0],
            content: textContent || (typeof textContent === 'string' ? textContent : ''),
            updated_at: new Date().toISOString()
        };

        // 3. Insert metadata into 'cb_files' table
        const { data, error } = await client
            .from(TABLE_NAME)
            .upsert(payload)
            .select();

        // 4. Rollback: If database insert fails, clean up the uploaded storage object
        if (error) {
            console.error("[FileService] Metadata insert failed, cleaning storage:", error);
            if (storagePath && window.CodeBrainsStorageService) {
                await window.CodeBrainsStorageService.deleteFile(storagePath);
            }
            throw new Error(`Database record creation failed: ${error.message}`);
        }

        return {
            id: fileId,
            folderId: payload.folder_id,
            name: payload.name,
            type: payload.type,
            size: payload.size,
            storagePath: payload.storage_path,
            mimeType: payload.mime_type,
            url: payload.url,
            date: payload.date,
            content: payload.content
        };
    }

    /**
     * Create a new text or code file
     */
    async function createCodeFile({ name, folderId = 'root', type = 'code', content = '' }) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        blob.name = name;
        return await uploadFile({
            fileObject: blob,
            folderId: folderId,
            category: type,
            textContent: content
        });
    }

    /**
     * Rename a file
     */
    async function renameFile(id, newName, newType) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        const updatePayload = {
            name: newName.trim(),
            updated_at: new Date().toISOString()
        };
        if (newType) updatePayload.type = newType;

        const { error } = await client
            .from(TABLE_NAME)
            .update(updatePayload)
            .eq('id', id);

        if (error) {
            console.error("[FileService] renameFile error:", error);
            throw new Error(error.message);
        }

        return true;
    }

    /**
     * Move a file to another folder
     */
    async function moveFile(id, targetFolderId) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        const { error } = await client
            .from(TABLE_NAME)
            .update({ 
                folder_id: targetFolderId || 'root',
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            console.error("[FileService] moveFile error:", error);
            throw new Error(error.message);
        }

        return true;
    }

    /**
     * Delete a file from both Storage and Database
     */
    async function deleteFile(id, storagePath = null) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) throw new Error("Supabase client not connected");

        // 1. Delete the physical file from Storage bucket if path is provided
        if (storagePath && window.CodeBrainsStorageService) {
            await window.CodeBrainsStorageService.deleteFile(storagePath);
        } else {
            // Lookup storage_path from DB if not passed
            try {
                const { data } = await client.from(TABLE_NAME).select('storage_path').eq('id', id).single();
                if (data && data.storage_path && window.CodeBrainsStorageService) {
                    await window.CodeBrainsStorageService.deleteFile(data.storage_path);
                }
            } catch (e) {}
        }

        // 2. Delete row from Database
        const { error } = await client
            .from(TABLE_NAME)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("[FileService] deleteFile error:", error);
            throw new Error(error.message);
        }

        return true;
    }

    window.CodeBrainsFileService = {
        getFiles: getFiles,
        uploadFile: uploadFile,
        createCodeFile: createCodeFile,
        renameFile: renameFile,
        moveFile: moveFile,
        deleteFile: deleteFile
    };
})(window);
