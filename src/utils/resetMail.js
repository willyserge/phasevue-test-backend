import mailgun from 'mailgun-js';


const resetMail = ({
  email, url
}) => {
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
  const data = {
    from: 'no-reply@phasevue.com',
    to: email,
    subject: 'Password reset',
    html: `

    <div style="max-width: 700px; margin:auto; padding: 50px 20px; font-size: 110%;">
    <h2 style=" text-transform: uppercase;color: teal;">Password reset</h2>
    <p> 
    We received a request to reset your password. You can reset your password with this button:
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

export default resetMail;
