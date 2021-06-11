import sgMail from '@sendgrid/mail';


const clientInviteMail = ({
  email, url, inviter, projectName, deliverableName
}) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'phasevue-review request',
    html: `
    <div >
  <h2 style="text-align:center;">Phasevue<h2>
  <div>
    <div  style="display: flex; justify-content: center; align-items: center;">
       <p>
      You have been invited by <span style="color:teal;">${inviter}</span> to review the <span style="color:teal;">${deliverableName}</span> deliverable on the <span style="color:teal;">${projectName}</span>  project
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
