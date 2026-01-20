export interface SyncSubscriptionInputDTO {
  userId: string
  isPremium: boolean
}

export interface SyncSubscriptionOutputDTO {
  success: boolean
  user: {
    id: string
    role: number
  }
}
