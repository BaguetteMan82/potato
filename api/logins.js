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
                encryptedPassword: "d11fbaafa58bbc6105a2426c5db6fd4c",
            },
            {
                username: "andrew",
                encryptedPassword: "c77962800851b428e9653055dc1410e1",
            },
            {
                username: "guest",
                encryptedPassword: "f8f414e58dcaadc150e7b23b49f2efdb",
            },
        ];

        console.log("Finding user...");
        const user = storedCredentials.find((u) => u.username === username);
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



/* const storedCredentials = [
    {
        username: "admin",
        encryptedPassword: "d11fbaafa58bbc6105a2426c5db6fd4c",
    },
    {
        username: "andrew",
        encryptedPassword: "c77962800851b428e9653055dc1410e1",
    }, thiskey1willnever2besolved3
    {
        username: "guest",
        encryptedPassword: "f8f414e58dcaadc150e7b23b49f2efdb",
    },
]; *\