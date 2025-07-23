export default abstract class PaymentService {
  abstract getPaymentServiceProviderInfos: () => Promise<any>
  abstract createSubscription: (payload: any) => Promise<any>
}
