const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
    try {
        console.log('🧪 Testing Authentication Endpoints...\n');

        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const healthCheck = await axios.get('http://localhost:3000/');
        console.log('✅ Server is running:', healthCheck.data.message);

        // Test 2: Register a new user
        console.log('\n2. Testing user registration...');
        const registerData = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            role: 'user'
        };

        const registerResponse = await axios.post(`${API_BASE}/auth/register`, registerData);
        console.log('✅ Registration successful:', registerResponse.data.success);
        console.log('   User ID:', registerResponse.data.user.id);
        console.log('   Token received:', !!registerResponse.data.token);

        const token = registerResponse.data.token;

        // Test 3: Login with the same user
        console.log('\n3. Testing user login...');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const loginResponse = await axios.post(`${API_BASE}/auth/login`, loginData);
        console.log('✅ Login successful:', loginResponse.data.success);
        console.log('   User name:', loginResponse.data.user.name);

        // Test 4: Get current user with token
        console.log('\n4. Testing get current user...');
        const userResponse = await axios.get(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Get current user successful:', userResponse.data.success);
        console.log('   User data:', userResponse.data.data.name);

        // Test 5: Test logout
        console.log('\n5. Testing logout...');
        const logoutResponse = await axios.post(`${API_BASE}/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('✅ Logout successful:', logoutResponse.data.success);

        console.log('\n🎉 All authentication tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the backend server is running:');
            console.log('   cd backend');
            console.log('   npm run dev');
        }
    }
}

testAuth(); 