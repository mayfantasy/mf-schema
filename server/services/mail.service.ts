import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export const mailService = (
  transporterConfig: SMTPTransport | SMTPTransport.Options | string,
  mailOptions: Mail.Options
) => {
  const transporter = nodemailer.createTransport(transporterConfig)
  return new Promise((res, rej) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        rej(error)
      } else {
        res(`Email sent: ${info.response}`)
      }
    })
  })
}
