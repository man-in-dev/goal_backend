const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testRoutes() {
    try {
        console.log('🧪 Testing API Routes...\n');

        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthCheck = await axios.get(`${API_BASE}/health`);
        console.log('✅ Health endpoint working:', healthCheck.data.message);

        // Test 2: Auth routes
        console.log('\n2. Testing auth routes...');
        try {
            await axios.get(`${API_BASE}/auth/me`);
            console.log('❌ Should have required authentication');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Auth routes working (401 as expected)');
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        // Test 3: Admission routes
        console.log('\n3. Testing admission routes...');
        try {
            await axios.post(`${API_BASE}/admission/enquiry`, {
                name: 'Test',
                email: 'test@example.com',
                phone: '1234567890',
                course: 'medical',
                studyLevel: '12th'
            });
            console.log('✅ Admission enquiry endpoint working');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Admission routes working (400 validation error as expected)');
                console.log('   Error:', error.response.data.error);
            } else {
                console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
            }
        }

        console.log('\n🎉 Route testing completed!');

    } catch (error) {
        console.error('❌ Test failed:', error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the backend server is running:');
            console.log('   npm run dev');
        }
    }
}

testRoutes(); 