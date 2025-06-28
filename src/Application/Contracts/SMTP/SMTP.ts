export interface SMTPOptions {
  from: string
  to: string
  subject: string
  text: string
}

export interface SMTP {
  deliver(options: SMTPOptions): Promise<void>
}
