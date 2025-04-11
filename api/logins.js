const crypto = require('crypto');
const functions = require('firebase-functions'); // Firebase Functions module

// Helper function to encrypt passwords
function encryptPassword(password, key) {
    const iv = Buffer.alloc(16, 0); // 16 bytes of zero for simplicity
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedPassword = cipher.update(password, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');
    return encryptedPassword;
}

// Helper function to decrypt passwords
function decryptPassword(encryptedPassword, key) {
    const iv = Buffer.alloc(16, 0); // 16 bytes of zero for simplicity
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');
    return decryptedPassword;
}

export default async function handler(event) {
    try {
        // Retrieve the encryption key from Firebase's environment variables
        const encryptionKey = functions.config().encryption.key; // Correctly fetch the key
        if (!encryptionKey) {
            console.error("Encryption key not found in environment variables!");
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Internal Server Error" }),
            };
        }

        console.log("Encryption key successfully retrieved.");

        // Handle CORS preflight (OPTIONS) request
        if (event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                body: JSON.stringify({}),
            };
        }

        // Ensure it's a POST request
        if (event.httpMethod !== 'POST') {
            console.log("Invalid HTTP method:", event.httpMethod);
            return {
                statusCode: 405, // Method Not Allowed
                body: JSON.stringify({ message: "Method Not Allowed" }),
            };
        }

        // Parse username and password from the request body
        const { username, password } = JSON.parse(event.body);
        console.log("Received login attempt for username:", username);

        // Replace this with your stored encrypted passwords
        const storedCredentials = [
            {
                username: "admin",
                encryptedPassword: encryptPassword("adminpassword", encryptionKey),
            },
            {
                username: "andrew",
                encryptedPassword: encryptPassword("andrewpassword", encryptionKey),
            },
            {
                username: "guest",
                encryptedPassword: encryptPassword("guestpassword", encryptionKey),
            },
        ];

        // Find the user with the given username
        const user = storedCredentials.find((u) => u.username === username);
        if (!user) {
            console.log("User not found:", username);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }

        console.log("User found. Decrypting password...");
        // Use helper function to decrypt the stored password
        const decryptedPassword = decryptPassword(user.encryptedPassword, encryptionKey);
        console.log("Decrypted password:", decryptedPassword);

        // Compare decrypted password with input password
        if (password !== decryptedPassword) {
            console.log("Password mismatch for user:", username);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }

        // Success response
        console.log("Login successful for user:", username);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Login successful" }),
        };
    } catch (error) {
        console.error("Error in logins.js:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    }
}
