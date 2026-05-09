import {config} from "@/lib/config/config";
import {generateId} from "@/lib/utils/helpers";
import {BlobServiceClient} from "@azure/storage-blob";

const accountName = config.azure.accountName;
const sasToken = config.azure.sasToken;
const containerName = config.azure.containerName;

if (!accountName || !sasToken) {
	console.warn("Azure Storage not configured. File uploads will fail.");
}

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
	async uploadFile(file, userId, mediaId = null) {
		if (!containerClient) {
			throw new Error("Azure Storage not configured");
		}

		const id = mediaId || generateId();
		const fileExtension = file.name.split(".").pop();
		const blobName = `${userId}/${id}.${fileExtension}`;

		const blockBlobClient = containerClient.getBlockBlobClient(blobName);

		await blockBlobClient.uploadData(file, {
			blobHTTPHeaders: {
				blobContentType: file.type,
			},
		});

		const url = blockBlobClient.url.split("?")[0];

		return {
			url,
			blobName,
			size: file.size,
			contentType: file.type,
		};
	},

	async deleteFile(blobName) {
		if (!containerClient) {
			throw new Error("Azure Storage not configured");
		}

		const blockBlobClient = containerClient.getBlockBlobClient(blobName);
		await blockBlobClient.delete();

		return {success: true};
	},

	getFileUrl(url) {
		if (!url) return "";
		if (url.includes("?")) return url;
		return `${url}?${sasToken}`;
	},

	getBlobUrl(blobName) {
		if (!accountName || !sasToken) return "";
		return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
	},
};