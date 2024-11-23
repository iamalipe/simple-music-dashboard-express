const sendEmail = (email:string, subject:string, message:string) => {
  console.info(`EMAIL : ${email}, SUBJECT : ${subject}, MESSAGE : ${message}`);
};

export default {
  sendEmail
}