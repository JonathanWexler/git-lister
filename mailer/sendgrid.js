import sgMail from '@sendgrid/mail';
import {mailMessageGenerator} from '#mailer/mailHTML.js'
import dotenv from 'dotenv';
dotenv.config();
console.log('process.env.SENDGRID_API_KEY', process.env.SENDGRID_API_KEY)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const demoData = {
  "repo1": {
    title: "Interview Atlas App",
    content: "17 changes made to the help.js file"
  },
  "repo2": {
    title: "Contruction App",
    content: "22 changes made to the intro.js file"
  }
}
const timeElapsed = Date.now();
const today = new Date(timeElapsed);
const html = `
<div style="display:flex;flex-direction:column;">
<h1>
  Here is your report:
</h1>
<div class="project">
  <h3 class="name">
    Project Name
  </h3>
  <ul>
    <li>Item uploaded today</li>
  </ul>
</div>
</div>
`
const msg = {
  to: 'jonathanrwexler@gmail.com', // Change to your recipient
  from: 'report@gitlister.com', // Change to your verified sender
  subject: `Gitlister Report ${today.toDateString()}`,
  // text: 'Here is the update:',
  html: mailMessageGenerator(demoData),
}

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })
