// Test Piston API directly
const testPistonAPI = async () => {
  try {
    console.log('Testing Piston API...');
    
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'javascript',
        version: '*',
        files: [
          {
            name: 'main.js',
            content: 'console.log("Hello from Piston API!");'
          }
        ]
      })
    });

    const result = await response.json();
    console.log('Piston API Response:', JSON.stringify(result, null, 2));
    
    if (result.run && result.run.stdout) {
      console.log('✅ Piston API is working!');
      console.log('Output:', result.run.stdout);
    } else {
      console.log('❌ Unexpected response format');
    }
  } catch (error) {
    console.error('❌ Piston API Error:', error.message);
  }
};

// Run the test
testPistonAPI();
