import {config} from "@/lib/config/config";
import {generateId} from "@/lib/utils/helpers";
import {BlobServiceClient} from "@azure/storage-blob";

const accountName = config.azure.accountName;
const sasToken = config.azure.sasToken;
const containerName = config.azure.containerName;

if (!accountName || !sasToken) {
	console.warn("Azure Storage not configured. File uploads will fail.");
}

// Create blob service client with SAS token
const blobServiceClient =
	accountName && sasToken
		? new BlobServiceClient(
				`https://${accountName}.blob.core.windows.net?${sasToken}`,
			)
		: null;

const containerClient = blobServiceClient
	? blobServiceClient.getContainerClient(containerName)
	: null;

export const storageService = {
	/**
	 * Upload file to Azure Blob Storage
	 * @param {File} file - The file to upload
	 * @param {string} userId - User ID for organizing files
	 * @param {string} mediaId - Optional media ID, auto-generated if not provided
	 * @returns {Promise<{url: string, blobName: string, size: number, contentType: string}>}
	 */
	async uploadFile(file, userId, mediaId = null) {
		if (!containerClient) {
			throw new Error("Azure Storage not configured");
		}

		const id = mediaId || generateId();
		const fileExtension = file.name.split(".").pop();
		const blobName = `${userId}/${id}.${fileExtension}`;

		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		// Upload file with content-type
		await blockBlobClient.uploadData(file, {
			blobHTTPHeaders: {
				blobContentType: file.type,
			},
		});

		// Return URL without SAS token (will be added when accessing)
		const url = blockBlobClient.url.split("?")[0];

		return {
			url,
			blobName,
			size: file.size,
			contentType: file.type,
		};
	},

	/**
	 * Delete file from Azure Blob Storage
	 * @param {string} blobName - Name of the blob to delete
	 * @returns {Promise<{success: boolean}>}
	 */
	async deleteFile(blobName) {
		if (!containerClient) {
			throw new Error("Azure Storage not configured");
		}

		const blockBlobClient = containerClient.getBlockBlobClient(blobName);
		await blockBlobClient.delete();

		return {success: true};
	},

	/**
	 * Get public URL for a blob with SAS token
	 * @param {string} url - The blob URL from database
	 * @returns {string} URL with SAS token
	 */
	getFileUrl(url) {
		if (!url) return "";

		// If already has SAS token, return as-is
		if (url.includes("?")) return url;

		// Add SAS token for access
		return `${url}?${sasToken}`;
	},

	/**
	 * Get blob URL from blob name
	 * @param {string} blobName - The blob name
	 * @returns {string} Full URL with SAS token
	 */
	getBlobUrl(blobName) {
		if (!accountName || !sasToken) return "";
		return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
	},
};