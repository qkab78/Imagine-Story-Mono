export interface AuthUserProps {
  id: string
  email: string
  password: string | null
  firstname: string
  lastname: string
  role: number
  createdAt: Date
  updatedAt: Date
}

export class AuthUser {
  private constructor(private readonly props: AuthUserProps) {}

  static create(props: AuthUserProps): AuthUser {
    return new AuthUser(props)
  }

  get id(): string {
    return this.props.id
  }
  get email(): string {
    return this.props.email
  }
  get password(): string | null {
    return this.props.password
  }
  get firstname(): string {
    return this.props.firstname
  }
  get lastname(): string {
    return this.props.lastname
  }
  get role(): number {
    return this.props.role
  }
  get createdAt(): Date {
    return this.props.createdAt
  }
  get updatedAt(): Date {
    return this.props.updatedAt
  }

  getFullName(): string {
    return `${this.props.firstname} ${this.props.lastname}`
  }
}
