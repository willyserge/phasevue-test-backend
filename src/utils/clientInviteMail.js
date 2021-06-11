import sgMail from '@sendgrid/mail';


const clientInviteMail = ({
  email, url, inviter, projectName, deliverableName
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'Project invitation',
    html:  `
    <div >
  <h2 style="text-align:center;">Phasevue<h2>
  <div>
    <div  style="display: flex; justify-content: center; zlign-items: center;">
       <p>
      You have been invited by ${inviter} to review the ${deliverableName} deliverable on the ${projectName}  project
    </p>
    </div>
    
    <div style="display: flex; justify-content: center;">
      <a href=${url} style=" text-align:center; background: teal; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block; border-radius: 20px; ">Review</a>
    </div>
  </div>
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

export default clientInviteMail;
