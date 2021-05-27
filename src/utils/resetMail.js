import sgMail from '@sendgrid/mail';


const resetMail = ({
  email, url
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'Password reset',
    html:   `

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
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
};

export default resetMail;
