import sgMail from '@sendgrid/mail';


const clientClientEmail = ({
  clientEmail, projectName, inviter
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: clientEmail,
    from: 'info@phasevue.com',
    subject: 'new project client',
    html: `
    <div >
        <h2 style="text-align:center;">${inviter}<h2>
        <h2 style="text-align:center;">${projectName}<h2>
        <h2 style="text-align:center;">${clientEmail}<h2>
    <div>
  
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

export default clientClientEmail;
