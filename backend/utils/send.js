import nodemailer from 'nodemailer'

export async function send({subject,to,text,html}){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'frederick.gutmann57@ethereal.email',
            pass: 'nu6rAWRawRbFcs4BJ9'
        }
    });

        await transporter.sendMail({
        from: 'frederick.gutmann57@ethereal.email', 
        to: to,
        subject: subject, 
        text: text,
        html: html, 
      });
}
