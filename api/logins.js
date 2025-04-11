const crypto = require('crypto');

export default async function handler(event) {
    try {
        // Retrieve the encryption key from Vercel's environment variables
        const encryptionKey = process.env.ENCRYPT;
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
                hashedPassword: "$2b$10$690mZ3yK32y.1.Dg.SalWObM9KTVio4I0i3WpAwgDGqCimHnMCGMq" // Example hash for "adminpassword"
            },
            {
                username: "andrew",
                hashedPassword: "$2b$10$/x2xlcTuH8vuH2Sv8nI2ueOUQW4Ng0p5IXohcpyCYXcZQ2KiDM.4O" // Example hash for "andrewpassword"
            },
            {
                username: "guest",
                hashedPassword: "$2b$10$CVdVPxuBUDn34vUewFAShOpwOslfbRbPVuiGlo7WHLYL8.x6yHA/O" // Example hash for "guestpassword"
            }
        ];

        // Find the user with the given username
        const user = storedCredentials.find(u => u.username === username);
        if (!user) {
            console.log("User not found:", username);
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid username or password" }),
            };
        }

        console.log("User found. Decrypting password...");
        // Decrypt the stored password
        const decipher = crypto.createDecipher('aes-256-cbc', encryptionKey);
        let decryptedPassword = decipher.update(user.encryptedPassword, 'hex', 'utf8');
        decryptedPassword += decipher.final('utf8');

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