import sgMail from '@sendgrid/mail';


const newCommentMail = ({
  comment, commenter, deliverableName
}, email) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: 'info@phasevue.com',
    subject: 'new comment notification',
    html: `
    <div >
  <h2 style="text-align:center;">${comment}<h2>
  <h2 style="text-align:center;">${commenter}<h2>
  <h2 style="text-align:center;">${deliverableName}<h2>
  <h2 style="text-align:center;">${email}<h2>
  
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

export default newCommentMail;
