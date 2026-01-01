# Supabase Storage Setup Guide

This guide will walk you through setting up Supabase Storage for image uploads in your application.

## Step 1: Verify Storage Bucket

Since you already have an `images` bucket, verify the following settings:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click on your `images` bucket
4. Verify the bucket settings:
   - **Public bucket**: ✅ Should be enabled (so images can be accessed via public URLs)
   - **File size limit**: Should be at least 5MB (or adjust the API limit accordingly)
   - **Allowed MIME types**: Should include `image/jpeg, image/jpg, image/png, image/webp, image/gif`

If the bucket is not public, you can make it public by:
1. Clicking on the bucket
2. Going to **Settings**
3. Enabling **Public bucket**

## Step 2: Set Up Storage Policies

Since you already have the `images` bucket, you just need to set up Row Level Security (RLS) policies to control access. These policies will allow authenticated users to upload images and public users to view them.

### Policy 1: Allow Authenticated Users to Upload

1. Go to **Storage** → **Policies** → Select the `images` bucket
2. Click **New Policy**
3. Choose **For full customization**, click **Use this template**
4. Configure the policy:
   - **Policy name**: `Allow authenticated users to upload images`
   - **Allowed operation**: `INSERT`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'images'::text) AND (auth.role() = 'authenticated'::text)
     ```
   - **WITH CHECK expression**: 
     ```sql
     (bucket_id = 'images'::text) AND (auth.role() = 'authenticated'::text)
     ```
5. Click **Review** and then **Save policy**

### Policy 2: Allow Public Read Access

1. Click **New Policy** again
2. Choose **For full customization**, click **Use this template**
3. Configure the policy:
   - **Policy name**: `Allow public read access`
   - **Allowed operation**: `SELECT`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'images'::text)
     ```
4. Click **Review** and then **Save policy**

### Policy 3: Allow Authenticated Users to Update/Delete Their Own Files

1. Click **New Policy** again
2. Choose **For full customization**, click **Use this template**
3. Configure the policy:
   - **Policy name**: `Allow authenticated users to update/delete images`
   - **Allowed operation**: `UPDATE, DELETE`
   - **Policy definition**: 
     ```sql
     (bucket_id = 'images'::text) AND (auth.role() = 'authenticated'::text)
     ```
   - **WITH CHECK expression**: 
     ```sql
     (bucket_id = 'images'::text) AND (auth.role() = 'authenticated'::text)
     ```
4. Click **Review** and then **Save policy**

## Step 3: Create Folder Structure (Optional)

You can organize images by creating folders within the bucket:

- `hero/` - For hero section images
- `projects/` - For project images
- `team/` - For team member photos
- `services/` - For service images

These folders will be created automatically when you upload files to those paths.

## Step 5: Verify Setup

### Test Upload via Supabase Dashboard

1. Go to **Storage** → **images** bucket
2. Click **Upload file**
3. Select an image and upload it
4. Verify the file appears in the bucket
5. Click on the file to see its public URL

### Test via API

You can test the upload functionality by:

1. Logging into your admin panel
2. Going to the Hero section admin page
3. Clicking "Upload Image" for any featured project
4. Selecting an image file
5. Verifying the image uploads and the URL is populated

## Step 6: Environment Variables

Make sure your `.env.local` file has the required Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Error: "new row violates row-level security policy"

**Solution**: Make sure you've set up the storage policies correctly and that the user is authenticated.

### Error: "The resource already exists"

**Solution**: The file with that name already exists. The upload function generates unique filenames, but if you're testing, try uploading a different file.

### Images not displaying

**Solution**: 
1. Check that the bucket is set to **Public**
2. Verify the public URL is correct
3. Check browser console for CORS errors
4. Ensure the image URL is accessible

### Upload fails with 401 Unauthorized

**Solution**:
1. Make sure the user is logged in
2. Verify the authentication token is being sent
3. Check that the storage policies allow authenticated users to upload

## Security Best Practices

1. **File Type Validation**: The API already validates file types on the server side
2. **File Size Limits**: Set appropriate limits in the bucket settings
3. **Authentication**: Only authenticated users can upload (enforced by RLS policies)
4. **Unique Filenames**: Files are automatically renamed to prevent conflicts
5. **Folder Organization**: Use folders to organize different types of images

## Additional Configuration

### Custom File Size Limits

To change the file size limit, update the `maxSize` constant in `src/app/api/upload/route.ts`:

```typescript
const maxSize = 10 * 1024 * 1024 // 10MB
```

### Custom Allowed File Types

To allow additional file types, update the `validTypes` array in `src/app/api/upload/route.ts`:

```typescript
const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
```

### Custom Storage Paths

To upload to different folders, pass the `folder` parameter when calling the upload API:

```typescript
formData.append('folder', 'projects')
```

## Next Steps

After completing this setup:

1. Test image uploads from the admin panel
2. Verify images display correctly on the frontend
3. Consider adding image optimization/compression if needed
4. Set up image cleanup for deleted content (optional)

