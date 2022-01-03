import sgMail from '@sendgrid/mail';
import {mailMessageGenerator} from '#mailer/mailHTML.js'
import {welcomeMessage} from '#mailer/welcomeHTML.js'
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


  const sendMessage = (subject, html, email) => {
    const msg = {
      to: email || 'logorithms@gmail.com',
      from: 'report@gitlister.com',
      subject,
      html,
    }
    
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  export const reportEmail = () => {
    const subject = `Gitlister Report ${today.toDateString()}`;
    sendMessage(subject, mailMessageGenerator(demoData))
  }

  export const welcomeEmail = (username, email) => {
    const subject = `Welcome to Gitlister`;
    sendMessage(subject, welcomeMessage(username), email)
  }