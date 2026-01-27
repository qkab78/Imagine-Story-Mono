export interface EmailVerificationTokenProps {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

export class EmailVerificationToken {
  private constructor(private readonly props: EmailVerificationTokenProps) {}

  static create(props: EmailVerificationTokenProps): EmailVerificationToken {
    return new EmailVerificationToken(props)
  }

  get id(): string {
    return this.props.id
  }

  get userId(): string {
    return this.props.userId
  }

  get token(): string {
    return this.props.token
  }

  get expiresAt(): Date {
    return this.props.expiresAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  isExpired(): boolean {
    return new Date() > this.props.expiresAt
  }
}
