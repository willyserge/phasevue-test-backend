import mailgun from 'mailgun-js';


const inviteMail = ({
  email, url, inviter, projectName
}) => {
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
  const data = {
    from: 'no-reply@phaseView.com',
    to: email,
    subject: `invitation from ${inviter}`,
    html: `
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
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
};

export default inviteMail;
