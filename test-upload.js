const { PrismaClient } = require('@prisma/client');
const { put } = require('@vercel/blob');
const fs = require('fs');

const prisma = new PrismaClient();

async function testUpload() {
  console.log("Starting upload test...");
  
  try {
    // 1. Create a dummy file
    const fileName = 'test-logo.png';
    const fileContent = Buffer.from('fake-image-data');
    fs.writeFileSync(fileName, fileContent);
    
    console.log(`Created dummy file: ${fileName}`);

    // 2. Mock a File object (since we are in Node, not Browser)
    // Vercel Blob's 'put' accepts a Blob, Buffer, or Stream.
    const blob = await put(fileName, fileContent, { access: 'public' });
    console.log(`Successfully uploaded to Vercel Blob: ${blob.url}`);

    // 3. Save to DB (mimicking the server action logic)
    const asset = await prisma.mediaAsset.create({
      data: {
        url: blob.url,
        storageKey: blob.url,
        filename: fileName,
        altText: fileName,
        mimeType: 'image/png',
        size: fileContent.length,
        uploadedById: null, // Mocking unauthenticated or system upload
      },
    });

    console.log(`Successfully saved to DB: ${asset.id}`);
    console.log(`Asset URL: ${asset.url}`);

    // 4. Cleanup
    fs.unlinkSync(fileName);
    console.log("Cleanup complete.");
    
    return { success: true };
  } catch (e) {
    console.error("Test failed:", e);
    return { success: false, error: e };
  } finally {
    await prisma.$disconnect();
  }
}

testUpload().then(res => {
  if (res.success) {
    console.log("\n✅ END-TO-END LOGIC VERIFIED: File uploaded and DB record created.");
    process.exit(0);
  } else {
    console.log("\n❌ TEST FAILED");
    process.exit(1);
  }
});
