import CloudinaryStoragePkg from 'multer-storage-cloudinary';
console.log('Type:', typeof CloudinaryStoragePkg);
console.log('Keys:', Object.keys(CloudinaryStoragePkg || {}));
try {
    const { CloudinaryStorage } = CloudinaryStoragePkg;
    console.log('CloudinaryStorage:', typeof CloudinaryStorage);
} catch (e) {
    console.error(e);
}
