import nodemailer from 'nodemailer'
import { SMTP, SMTPOptions } from '../../Application/Contracts/SMTP/SMTP'
import { logger } from '../Logger/PinoLoggerAdapter'

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: '1f32261d0103b5',
    pass: 'cecfe4e965edaa'
  }
})

export const nodeMailerAdapter: SMTP = {
  async deliver(options: SMTPOptions): Promise<void> {
    if (process.env.APP_ENV === 'test') {
      return Promise.resolve()
    }
    transporter.sendMail(options, function (error, info) {
      if (error) {
        logger.error('Error delivering e-mail', error)
      } else {
        logger.info('E-mail Delivered', info.response)
      }
    })
  }
}
