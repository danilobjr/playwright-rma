import type { RmaListFilters } from '@/services/api/rma/rma-request.service'

const rmaListDefaultFormFilterValues: RmaListFilters = {
  search: '',
  status: '',
  submittedDate: undefined,
}

export { rmaListDefaultFormFilterValues }
