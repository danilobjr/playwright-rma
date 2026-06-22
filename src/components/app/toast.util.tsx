import { toast } from 'sonner'

import { RichToast } from './app-toaster.app'

function successToast(title: string, description: string) {
  toast.custom(
    (id) => (
      <RichToast
        id={id}
        title={title}
        description={description}
        variant="success"
      />
    ),
    { duration: 5000 },
  )
}

function errorToast(title: string, description: string) {
  toast.custom(
    (id) => (
      <RichToast
        id={id}
        title={title}
        description={description}
        variant="error"
      />
    ),
    { duration: 5000 },
  )
}

function warningToast(title: string, description: string) {
  toast.custom(
    (id) => (
      <RichToast
        id={id}
        title={title}
        description={description}
        variant="warning"
      />
    ),
    { duration: 5000 },
  )
}

export { errorToast, successToast, warningToast }
