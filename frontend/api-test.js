// Quick API endpoint test for debugging
const API_BASE = 'https://stock-flow-management-system.onrender.com/api';

async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    console.log(`${method} ${endpoint}: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Response:', result);
    } else {
      console.log('Error response:', await response.text());
    }
  } catch (error) {
    console.error(`${endpoint} failed:`, error.message);
  }
}

async function testAPI() {
  console.log('🔍 Testing API endpoints...\n');
  
  // Test different authentication patterns
  console.log('=== Authentication Endpoints ===');
  await testEndpoint('/login', 'POST', {email: 'test@test.com', password: 'test123'});
  await testEndpoint('/auth/login', 'POST', {email: 'test@test.com', password: 'test123'});
  await testEndpoint('/user/login', 'POST', {email: 'test@test.com', password: 'test123'});
  
  console.log('\n=== Other Endpoints ===');
  await testEndpoint('/product');
  await testEndpoint('/category');
  await testEndpoint('/order');
  
  console.log('\n✅ Test completed!');
}

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testAPI();
}
