const crypto = require('crypto');
const functions = require('firebase-functions');

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

// Define and export the login function
exports.logins = functions.https.onRequest(async (req, res) => {
    try {
        // Retrieve the encryption key from Firebase's environment variables
        const encryptionKey = functions.config().encryption.key;
        if (!encryptionKey) {
            console.error("Encryption key not found in environment variables!");
            return res.status(500).send({ message: "Internal Server Error" });
        }

        console.log("Encryption key successfully retrieved.");

        // Handle CORS preflight (OPTIONS) request
        if (req.method === 'OPTIONS') {
            return res.status(200).set({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }).send({});
        }

        // Ensure it's a POST request
        if (req.method !== 'POST') {
            console.log("Invalid HTTP method:", req.method);
            return res.status(405).send({ message: "Method Not Allowed" });
        }

        // Parse username and password from the request body
        const { username, password } = req.body;
        console.log("Received login attempt for username:", username);

        // Replace this with your stored encrypted passwords
        const storedCredentials = [
            { username: "admin", encryptedPassword: encryptPassword("adminpassword", encryptionKey) },
            { username: "andrew", encryptedPassword: encryptPassword("andrewpassword", encryptionKey) },
            { username: "guest", encryptedPassword: encryptPassword("guestpassword", encryptionKey) },
        ];

        // Find the user with the given username
        const user = storedCredentials.find((u) => u.username === username);
        if (!user) {
            console.log("User not found:", username);
            return res.status(401).send({ message: "Invalid username or password" });
        }

        console.log("User found. Decrypting password...");
        // Use helper function to decrypt the stored password
        const decryptedPassword = decryptPassword(user.encryptedPassword, encryptionKey);
        console.log("Decrypted password:", decryptedPassword);

        // Compare decrypted password with input password
        if (password !== decryptedPassword) {
            console.log("Password mismatch for user:", username);
            return res.status(401).send({ message: "Invalid username or password" });
        }

        // Success response
        console.log("Login successful for user:", username);
        return res.status(200).send({ message: "Login successful" });
    } catch (error) {
        console.error("Error in logins.js:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});