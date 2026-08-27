/**
 * CODE BRAINS — Supabase Storage Service
 * ─────────────────────────────────────────────────────────────
 * Handles uploading raw files, documents, and images to Supabase Storage,
 * generating public URLs, and deleting physical files from the bucket.
 */

(function(window) {
    const BUCKET_NAME = 'files';

    function sanitizeFileName(name) {
        return (name || 'unnamed_file')
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/_{2,}/g, '_');
    }

    /**
     * Upload a physical File/Blob object to Supabase Storage
     * @param {File|Blob} fileObject The browser File or Blob
     * @param {string} folderId Folder identifier
     * @param {string} originalName Original file name
     * @returns {Promise<{ storagePath: string, url: string, mimeType: string, size: string }>}
     */
    async function uploadToStorage(fileObject, folderId = 'root', originalName = null) {
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) {
            throw new Error("Supabase client is not connected. Check your Project URL in Cloud Settings.");
        }

        const fileName = originalName || fileObject.name || 'file';
        const cleanName = sanitizeFileName(fileName);
        const uniqueId = Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const storagePath = `${folderId || 'root'}/${uniqueId}_${cleanName}`;
        const mimeType = fileObject.type || 'application/octet-stream';

        const { data, error } = await client.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileObject, {
                contentType: mimeType,
                cacheControl: '3600',
                upsert: true
            });

        if (error) {
            console.error("[StorageService] Upload failed:", error);
            throw new Error(`Storage upload failed: ${error.message}`);
        }

        // Retrieve public URL for direct preview and download
        const { data: urlData } = client.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

        const publicUrl = urlData ? urlData.publicUrl : '';

        // Calculate formatted size
        const bytes = fileObject.size || 0;
        const formattedSize = bytes > 1048576 
            ? (bytes / 1048576).toFixed(1) + ' MB' 
            : (bytes / 1024).toFixed(1) + ' KB';

        return {
            storagePath: storagePath,
            url: publicUrl,
            mimeType: mimeType,
            size: formattedSize
        };
    }

    /**
     * Delete a physical object from Supabase Storage
     * @param {string} storagePath The path inside the 'files' bucket
     */
    async function deleteFromStorage(storagePath) {
        if (!storagePath) return true;
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) return false;

        try {
            const { error } = await client.storage
                .from(BUCKET_NAME)
                .remove([storagePath]);

            if (error) {
                console.warn("[StorageService] Failed to delete object from storage:", error);
                return false;
            }
            return true;
        } catch (e) {
            console.warn("[StorageService] Storage delete error:", e);
            return false;
        }
    }

    /**
     * Get a public download / preview URL for a storage path
     * @param {string} storagePath 
     */
    function getFileUrl(storagePath) {
        if (!storagePath) return '';
        const client = window.CodeBrainsSupabase?.getClient();
        if (!client) return '';

        const { data } = client.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);

        return data ? data.publicUrl : '';
    }

    window.CodeBrainsStorageService = {
        uploadFile: uploadToStorage,
        deleteFile: deleteFromStorage,
        getFileUrl: getFileUrl,
        BUCKET_NAME: BUCKET_NAME
    };
})(window);
