import sgMail from '@sendgrid/mail';
import {mailMessageGenerator} from '#mailer/mailHTML.js'
import {welcomeMessage} from '#mailer/welcomeHTML.js'
import dotenv from 'dotenv';
dotenv.config();

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

  const sendMessage = (subject, html, email) => {
    console.log('sending email to ', email);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY_GITLISTER)
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
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    const subject = `Gitlister Report ${today.toDateString()}`;
    sendMessage(subject, mailMessageGenerator(demoData))
  }

  export const welcomeEmail = (username, email) => {
    const subject = `Welcome to Gitlister`;
    const html = welcomeMessage(username);
    sendMessage(subject, html, email);
  }