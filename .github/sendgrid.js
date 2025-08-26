#!/usr/bin/env node
'use strict';
const fs = require('fs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const [emailFile] = process.argv.slice(2);
const content = fs.readFileSync(emailFile, 'utf8').split(/\r?\n/);
const from = content[0]?.split(': ')[1] || '';
const to = content[1]?.split(': ')[1] || '';
const subject = content[2]?.split(': ')[1] || '';
const body = content.slice(4).join('\n');

sgMail.send({ from, to, subject, text: body })
  .then(() => console.log('Email sent successfully'))
  .catch(err => { console.error('Error:', err.toString()); process.exit(1); });
