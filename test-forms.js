// Test script to verify form endpoints are working
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testHealthCheck() {
    try {
        console.log('Testing health check...');
        const response = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health check passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

async function testAdmissionEnquiry() {
    try {
        console.log('Testing admission enquiry...');
        const response = await axios.post(`${API_BASE_URL}/admission/enquiry`, {
            name: 'Test User',
            email: 'test@example.com',
            phone: '9876543210',
            course: 'medical',
            studyLevel: '12th',
            address: 'Test Address',
            message: 'Test message',
            source: 'website'
        });
        console.log('✅ Admission enquiry test passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Admission enquiry test failed:', error.response?.data || error.message);
        return false;
    }
}

async function testEnquiryModal() {
    try {
        console.log('Testing enquiry modal form...');
        const response = await axios.post(`${API_BASE_URL}/admission/enquiry`, {
            name: 'Test User Modal',
            email: 'testmodal@example.com',
            phone: '9876543212',
            course: 'engineering',
            studyLevel: '11th',
            address: 'Test Address Modal',
            message: 'Test enquiry from modal',
            source: 'website'
        });
        console.log('✅ Enquiry modal test passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Enquiry modal test failed:', error.response?.data || error.message);
        return false;
    }
}

async function testContactForm() {
    try {
        console.log('Testing contact form...');
        const response = await axios.post(`${API_BASE_URL}/contact/submit`, {
            name: 'Test User',
            email: 'test@example.com',
            phone: '9876543210',
            state: 'Bihar',
            district: 'Patna',
            subject: 'Test Subject',
            message: 'Test message',
            location: 'Test Location',
            department: 'Admissions'
        });
        console.log('✅ Contact form test passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ Contact form test failed:', error.response?.data || error.message);
        return false;
    }
}

async function testGAETForm() {
    try {
        console.log('Testing GAET form...');
        const response = await axios.post(`${API_BASE_URL}/gaet/submit`, {
            name: 'Test User',
            email: 'test@example.com',
            phone: '9876543210',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            dateOfBirth: '2000-01-01',
            gender: 'male',
            address: 'Test Address',
            city: 'Test City',
            state: 'Bihar',
            pincode: '800001',
            schoolName: 'Test School',
            currentClass: '12th',
            examCenter: 'Patna',
            examDate: '2025-06-15',
            paymentMethod: 'online',
            agreeToTerms: true
        });
        console.log('✅ GAET form test passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ GAET form test failed:', error.response?.data || error.message);
        return false;
    }
}

async function testGVETForm() {
    try {
        console.log('Testing GVET form...');
        const response = await axios.post(`${API_BASE_URL}/gvet/submit`, {
            name: 'Test User',
            email: 'test2@example.com',
            phone: '9876543211',
            fatherName: 'Test Father',
            motherName: 'Test Mother',
            dateOfBirth: '2000-01-01',
            gender: 'male',
            category: 'general',
            address: 'Test Address',
            city: 'Test City',
            state: 'Bihar',
            pincode: '800001',
            schoolName: 'Test School',
            currentClass: '12th appearing',
            examCenter: 'Patna',
            examDate: '2025-06-18',
            paymentMethod: 'online',
            agreeToTerms: true
        });
        console.log('✅ GVET form test passed:', response.data);
        return true;
    } catch (error) {
        console.error('❌ GVET form test failed:', error.response?.data || error.message);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Starting form integration tests...\n');

    const results = {
        health: await testHealthCheck(),
        admission: await testAdmissionEnquiry(),
        enquiryModal: await testEnquiryModal(),
        contact: await testContactForm(),
        gaet: await testGAETForm(),
        gvet: await testGVETForm()
    };

    console.log('\n📊 Test Results:');
    console.log('Health Check:', results.health ? '✅ PASS' : '❌ FAIL');
    console.log('Admission Enquiry:', results.admission ? '✅ PASS' : '❌ FAIL');
    console.log('Enquiry Modal:', results.enquiryModal ? '✅ PASS' : '❌ FAIL');
    console.log('Contact Form:', results.contact ? '✅ PASS' : '❌ FAIL');
    console.log('GAET Form:', results.gaet ? '✅ PASS' : '❌ FAIL');
    console.log('GVET Form:', results.gvet ? '✅ PASS' : '❌ FAIL');

    const allPassed = Object.values(results).every(result => result);
    console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

    if (allPassed) {
        console.log('\n🎉 Form integration is working correctly!');
    } else {
        console.log('\n⚠️  Please check the backend server and database connection.');
    }
}

runTests().catch(console.error);
