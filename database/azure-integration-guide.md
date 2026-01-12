# Azure Storage Integration Guide

## Overview
This guide explains how to integrate Azure Blob Storage for media file uploads in the MediaShare application.

## Why Azure Blob Storage?

- **Cost-effective** for large media files
- **Scalable** storage for images and videos
- **CDN integration** for fast global delivery
- **Flexible** pricing based on usage

While Supabase stores metadata, Azure stores the actual media files.

## Setup Steps

### 1. Create Azure Storage Account

1. Go to [Azure Portal](https://portal.azure.com)
2. Click **Create a resource** → **Storage account**
3. Fill in details:
   - **Subscription**: Your Azure subscription
   - **Resource Group**: Create new or use existing
   - **Storage account name**: `mediasharestorage` (must be unique)
   - **Region**: Choose closest to your users
   - **Performance**: Standard
   - **Redundancy**: LRS (Locally Redundant Storage) for development
4. Click **Review + Create** → **Create**

### 2. Create Blob Container

1. Open your storage account
2. Navigate to **Containers** in the left sidebar
3. Click **+ Container**
4. Name: `media-uploads`
5. Public access level: **Private** (we'll use SAS tokens)
6. Click **Create**

### 3. Generate SAS Token

1. In your storage account, go to **Shared access signature**
2. Configure permissions:
   - **Allowed services**: ✅ Blob
   - **Allowed resource types**: ✅ Container, ✅ Object
   - **Allowed permissions**: ✅ Read, ✅ Write, ✅ Create
   - **Start time**: Now
   - **Expiry time**: 1 year from now (or as needed)
   - **Allowed protocols**: HTTPS only
3. Click **Generate SAS and connection string**
4. **Copy the SAS token** (starts with `?sv=...`)

### 4. Configure Environment Variables

Add these to your `.env` file in the project root:

```env
# Azure Storage Configuration
VITE_AZURE_STORAGE_ACCOUNT_NAME=mediasharestorage
VITE_AZURE_STORAGE_CONTAINER_NAME=media-uploads
VITE_AZURE_STORAGE_SAS_TOKEN=?sv=2021-06-08&ss=b&srt=co&sp=rwc... # Your full SAS token
```

### 5. Install Azure SDK

```bash
npm install @azure/storage-blob
```

### 6. Update Storage Service

Update `src/services/storageService.js`:

```javascript
import { BlobServiceClient } from '@azure/storage-blob';
import { config } from '@/lib/config/config';

const accountName = config.azure.accountName;
const sasToken = config.azure.sasToken;
const containerName = config.azure.containerName;

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net${sasToken}`
);

const containerClient = blobServiceClient.getContainerClient(containerName);

export const storageService = {
  async uploadFile(file, userId, mediaId) {
    const fileExtension = file.name.split('.').pop();
    const blobName = `${userId}/${mediaId}.${fileExtension}`;
    
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    
    await blockBlobClient.uploadData(file, {
      blobHTTPHeaders: {
        blobContentType: file.type
      }
    });
    
    // Remove SAS token from URL for storage (add it dynamically when needed)
    const url = blockBlobClient.url.split('?')[0];
    
    return {
      url,
      blobName,
      size: file.size,
      contentType: file.type
    };
  },
  
  async deleteFile(blobName) {
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
  },
  
  getFileUrl(blobName) {
    // Add SAS token for secure access
    return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}${sasToken}`;
  }
};
```

### 7. Update Config

Update `src/lib/config/config.js`:

```javascript
export const config = {
  // ... existing config
  
  azure: {
    accountName: import.meta.env.VITE_AZURE_STORAGE_ACCOUNT_NAME,
    containerName: import.meta.env.VITE_AZURE_STORAGE_CONTAINER_NAME,
    sasToken: import.meta.env.VITE_AZURE_STORAGE_SAS_TOKEN,
  },
  
  // Remove or comment out supabase storage config
  // supabase: {
  //   storageBucket: "media-uploads",
  // }
};
```

## Flow Diagram

```
┌─────────────┐
│   User      │
│  Uploads    │
│   File      │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Azure Blob     │
│  Storage        │ ← File stored here
└──────┬──────────┘
       │
       │ Returns URL
       ▼
┌─────────────────┐
│  Supabase       │
│  Database       │ ← URL + Metadata stored
└─────────────────┘
```

## Security Best Practices

1. **Never commit SAS tokens** to version control
2. **Rotate SAS tokens** periodically
3. **Use HTTPS only** for all requests
4. **Set expiration** on SAS tokens
5. **Monitor usage** in Azure Portal

## Cost Optimization

- **Delete unused blobs** when media is removed
- **Use LRS** redundancy for dev/test
- **Enable CDN** for production (optional)
- **Set lifecycle policies** to move old media to cool storage

## Testing

Test the integration:

1. Upload a test image in the app
2. Check Azure Portal → Storage Account → Containers → media-uploads
3. Verify file appears in the container
4. Check Supabase database → media table → verify URL is stored
5. View the media in the app to confirm it displays correctly

## Troubleshooting

### Error: "SAS token is invalid"
- Check the token hasn't expired
- Verify the token includes the `?` at the start
- Ensure permissions include Read, Write, Create

### Error: "CORS policy blocked"
- Go to Azure Storage → Resource sharing (CORS)
- Add allowed origins: `http://localhost:5173` (dev), your production domain
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: *

### Files not displaying
- Verify ContentType is set correctly
- Check blob URL includes SAS token when accessed
- Confirm browser can access the blob (check Network tab)
