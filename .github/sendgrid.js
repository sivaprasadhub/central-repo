#!/usr/bin/env node
const fs = require('fs');
const sgMail = require('@sendgrid/mail');

// Read email content from the provided file path
const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);

// Extract email details
const from = content[0]?.split(': ')[1] || '';
const to = content[1]?.split(': ')[1] || '';
const subject = content[2]?.split(': ')[1] || '';
const body = content.slice(3).join('\n');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create email message
const msg = {
  to,
  from,
  subject,
  text: body,
};

// Send email
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error('Error sending email:', error);
    process.exit(1);
  });
