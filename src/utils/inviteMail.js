import sgMail from '@sendgrid/mail';


const inviteMail = ({
  email, url, inviter, projectName
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'Project invitation',
    html:  `
    <div style="max-width: 700px; margin:auto; padding: 50px 20px; font-size: 110%;">
    <h2 style="text-align: center; text-transform: uppercase;color: teal;">Project Invitation</h2>
    <p> You've been invited by ${inviter} to collaborate on the <strong>${projectName}</strong> project
    </p>
    
    <a href=${url} style="background: teal; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">Accept invitation</a>

    <p>If the button doesn't work for any reason, you can also click on the link below:</p>

    <div>${url}</div>
    </div>
`
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

export default inviteMail;
