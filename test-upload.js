const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testUpload() {
  const form = new FormData();
  // Create a dummy image file
  fs.writeFileSync('dummy.png', Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==', 'base64'));
  form.append('pdf', fs.createReadStream('dummy.png'));
  form.append('name', 'dummy_image');

  try {
    const res = await axios.post('http://localhost:8000/api/upload/file', form, {
      headers: form.getHeaders(),
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}
testUpload();
