const bcrypt = require('bcrypt');

exports.handler = async (event) => {
    const { username, password } = JSON.parse(event.body);

    // Replace this with your stored user credentials (hashed passwords)
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
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Invalid username or password" })
        };
    }

    // Verify the password against the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Invalid username or password" })
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Login successful" })
    };
};
