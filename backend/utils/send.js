import nodemailer from 'nodemailer'

export async function send({subject,to,text,html}){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'alberto.mueller95@ethereal.email',
            pass: 'UyjUZWQrxJ66QGfXx8'
        }
    });

        await transporter.sendMail({
        from: 'alberto.mueller95@ethereal.email', 
        to: to,
        subject: subject, 
        text: text,
        html: html, 
      });
}
