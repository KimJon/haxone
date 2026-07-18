const fetch = require('node-fetch');

async function test() {
  const consumerKey = 'sW5rrT5z4WzFUKj4zp5i7XCk6+sDy1nr';
  const consumerSecret = 'Ppyk27O3G4DKboVftHOPAUI5A14=';

  const authRes = await fetch('https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret
    })
  });
  
  const authData = await authRes.json();
  console.log('Auth:', authData);
}
test();
