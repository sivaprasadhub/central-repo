#!/usr/bin/env node
const fs = require('fs');
const sgMail = require('@sendgrid/mail');

// Use the CLI arg or INPUT_ARGS env var
const filePath = process.argv[2] || process.env.INPUT_ARGS;

if (!filePath) {
  console.error('Error: No email file path provided.');
  process.exit(1);
}

let content;
try {
  content = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(Boolean);
} catch (err) {
  console.error(`Failed to read file: ${filePath}`, err);
  process.exit(1);
}

const from = (content[0] && content[0].split(': ')[1]) || '';
const to = (content[1] && content[1].split(': ')[1]) || '';
const subject = (content[2] && content[2].split(': ')[1]) || '';
const body = content.slice(3).join('\n');

if (!from || !to || !subject || !body) {
  console.error('Missing email parameters (from, to, subject, body). Check email.txt format.');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = { to, from, subject, text: body };

sgMail
  .send(msg)
  .then(() => console.log('Email sent successfully'))
  .catch((error) => {
    console.error('Error sending email:', error);
    process.exit(1);
  });
