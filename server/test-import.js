import pkg from 'multer-storage-cloudinary';
console.log('Type of pkg:', typeof pkg);
console.log('pkg.CloudinaryStorage:', pkg.CloudinaryStorage);

try {
    new pkg({ cloudinary: {}, params: { folder: 'test' } });
    console.log('new pkg() worked');
} catch (e) {
    console.log('new pkg() failed:', e.message);
}
