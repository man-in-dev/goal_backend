const axios = require('axios');

const API_BASE = 'http://localhost:8000/api';

async function testAdmission() {
    try {
        console.log('🧪 Testing Admission Enquiry Endpoints...\n');

        // Test 1: Check if server is running
        console.log('1. Testing server connection...');
        const healthCheck = await axios.get('http://localhost:8000/');
        console.log('✅ Server is running:', healthCheck.data.message);

        // Test 2: Submit admission enquiry
        console.log('\n2. Testing admission enquiry submission...');
        const enquiryData = {
            name: 'Test Student',
            email: 'test.student@example.com',
            phone: '+91-9876543210',
            course: 'medical',
            studyLevel: '12th',
            address: '123 Test Street, Test City',
            message: 'I am interested in joining the medical entrance course.',
            source: 'website'
        };

        const submitResponse = await axios.post(`${API_BASE}/admission/enquiry`, enquiryData);
        console.log('✅ Enquiry submitted successfully:', submitResponse.data.success);
        console.log('   Enquiry ID:', submitResponse.data.data._id);
        console.log('   Status:', submitResponse.data.data.status);

        const enquiryId = submitResponse.data.data._id;

        // Test 3: Submit another enquiry to test duplicate prevention
        console.log('\n3. Testing duplicate enquiry prevention...');
        try {
            await axios.post(`${API_BASE}/admission/enquiry`, enquiryData);
            console.log('❌ Duplicate prevention failed - should have been blocked');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Duplicate prevention working:', error.response.data.error);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }

        // Test 4: Submit a different enquiry
        console.log('\n4. Testing another enquiry submission...');
        const enquiryData2 = {
            name: 'Another Student',
            email: 'another.student@example.com',
            phone: '+91-9876543211',
            course: 'engineering',
            studyLevel: '11th',
            address: '456 Another Street, Another City',
            message: 'Interested in engineering entrance course.',
            source: 'website'
        };

        const submitResponse2 = await axios.post(`${API_BASE}/admission/enquiry`, enquiryData2);
        console.log('✅ Second enquiry submitted successfully:', submitResponse2.data.success);

        // Test 5: Get all enquiries (requires authentication)
        console.log('\n5. Testing get all enquiries (requires auth)...');
        try {
            await axios.get(`${API_BASE}/admission/enquiries`);
            console.log('❌ Should have required authentication');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Authentication required correctly');
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }

        // Test 6: Test validation errors
        console.log('\n6. Testing validation errors...');
        const invalidData = {
            name: '', // Empty name
            email: 'invalid-email', // Invalid email
            phone: '', // Empty phone
            course: 'invalid-course', // Invalid course
            studyLevel: '' // Empty study level
        };

        try {
            await axios.post(`${API_BASE}/admission/enquiry`, invalidData);
            console.log('❌ Validation should have failed');
        } catch (error) {
            if (error.response?.status === 400) {
                console.log('✅ Validation working correctly');
                console.log('   Error:', error.response.data.error);
            } else {
                console.log('❌ Unexpected error:', error.response?.data || error.message);
            }
        }

        console.log('\n🎉 Admission enquiry tests completed!');
        console.log('\n📝 Note: Admin endpoints (get all enquiries, update status, etc.) require authentication.');
        console.log('   You can test them after implementing user authentication.');

    } catch (error) {
        console.error('❌ Test failed:', error.response?.data || error.message);

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Make sure the backend server is running:');
            console.log('   cd backend');
            console.log('   npm run dev');
            console.log('   Server should be running on http://localhost:8000');
        }
    }
}

testAdmission(); 