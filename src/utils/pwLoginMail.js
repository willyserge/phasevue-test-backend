import sgMail from '@sendgrid/mail';


const passwordlessLoginMail = ({ email, url }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'confirm login attempt',
    html: `
      <h3>${url}</h3>
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

export default passwordlessLoginMail;
