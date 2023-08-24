const accountSid = 'AC7898d1cff989f262b5413d25e1038f1b'; // Your Account SID from www.twilio.com/console
const authToken = '6c4bd2aaebdccf544e7e988730ff6b90'; // Your Auth Token from www.twilio.com/console

const twilio = require("twilio");
const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from Node',
    to: '+12345678901', // Text this number
    from: '+12345678901', // From a valid Twilio number
  })
  .then((message) => console.log(message.sid));