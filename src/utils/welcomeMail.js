import mailgun from 'mailgun-js';


const WelcomeMail = (email) => {
  const DOMAIN = process.env.MAILGUN_DOMAIN;
  const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });
  const data = {
    from: 'no-reply@phaseView.com',
    to: email,
    subject: 'Welcome to phasevue',
    html: `
    <h3>Welcome to phasevue</h3>
`
  };
  mg.messages().send(data, (error, body) => {
    console.log(body);
  });
};

export default WelcomeMail;
