
interface PaymentErrorsPayload {
  code: string
  title: string
  message: string
}

export default class PaymentErrors extends Error {
  errors: PaymentErrorsPayload[]

  constructor(errors: PaymentErrorsPayload[]) {
    super("Payment errors")
    this.name = 'PaymentErrors'
    
    this.errors = errors
  }
}

