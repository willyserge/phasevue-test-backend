import sgMail from '@sendgrid/mail';

const WelcomeMail = (email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'Welcome to phasevue',
    html: '<h3> Welcome to phasavue </h3>'
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

export default WelcomeMail;
