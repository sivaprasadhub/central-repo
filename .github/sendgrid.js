const fs = require('fs');

const filePath = process.argv[2]; // Path to email.txt file passed as argument
const content = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);

const from = (content[0] && content[0].split(': ')[1]) || '';
const to = (content[1] && content[1].split(': ')[1]) || '';
const subject = (content[2] && content[2].split(': ')[1]) || '';
const body = content.slice(3).join('\n');

const sendgrid = require('@sendgrid/mail');
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to,
  from,
  subject,
  text: body,
};

sendgrid
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
    process.exit(1);
  });
