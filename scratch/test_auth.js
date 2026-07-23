const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
    const timestamp = Date.now();
    const testUser = {
        full_name: "Test User",
        email: `test_${timestamp}@example.com`,
        phone: `${timestamp}`.slice(-10),
        password: "password123",
        account_type: "VEHICLE_OWNER"
    };

    console.log("--- Testing Registration ---");
    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        console.log("Registration Response:", JSON.stringify(regData, null, 2));

        if (regRes.ok) {
            console.log("\n--- Testing Login ---");
            const loginRes = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });
            const loginData = await loginRes.json();
            console.log("Login Response:", JSON.stringify(loginData, null, 2));
        }
    } catch (error) {
        console.error("Test failed:", error);
    }
}

testAuth();
