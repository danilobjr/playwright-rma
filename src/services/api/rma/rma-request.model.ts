type RmaStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed'

type RmaRequest = {
  rmaId: string
  status: RmaStatus
  customerName: string
  productId: string
  reason: string
  createdAt: string
}

type CreateRmaRequestInput = {
  customerName: string
  productId: string
  reason: string
}

export type { CreateRmaRequestInput, RmaRequest, RmaStatus }
