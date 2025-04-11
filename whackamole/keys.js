const crypto = require('crypto');

function encryptPassword(password, key) {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// Your encryption key
const encryptionKey = 'thiskey1willnever2besolved3'; // Use the same key as your server-side logic

// Example passwords to encrypt
const passwords = ['adminpassword', 'andrewpassword', 'guestpassword'];

// Encrypt each password
passwords.forEach((password, index) => {
    const encryptedPassword = encryptPassword(password, encryptionKey);
    console.log(`Password ${index + 1}: ${encryptedPassword}`);
});