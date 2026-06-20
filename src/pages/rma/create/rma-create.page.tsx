import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import {
  CheckIcon,
  CircleAlertIcon,
  HashIcon,
  PackageIcon,
  UserIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { RmaStatus } from '@/services/api/rma/rma-request.model'

import {
  PRODUCT_ID_PREFIX,
  rmaCreateFormDefaultValues,
  rmaCreateFormSchema,
  sanitizeProductIdSuffix,
  type RmaCreateFormInput,
  type RmaCreateFormValues,
} from './rma-create-form.model'

const PENDING_STATUS = 'Pending'

type DuplicateAlert = {
  matchingRmaId: string
  matchingStatus: RmaStatus
}

type RmaCreatePageProps = {
  cancelAction: ReactNode
  duplicateAlert?: DuplicateAlert
  isSubmitting: boolean
  nextRmaId: string
  submitError?: string
  onDuplicateFieldsChange: () => void
  onSubmit: (values: RmaCreateFormValues) => void
}

function RmaCreatePage({
  cancelAction,
  duplicateAlert,
  isSubmitting,
  nextRmaId,
  submitError,
  onDuplicateFieldsChange,
  onSubmit,
}: RmaCreatePageProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RmaCreateFormInput, unknown, RmaCreateFormValues>({
    resolver: zodResolver(rmaCreateFormSchema),
    defaultValues: rmaCreateFormDefaultValues,
  })
  const customerNameRegistration = register('customerName')
  const productIdRegistration = register('productId')
  const reasonRegistration = register('reason')
  const duplicateAlertMessage = duplicateAlert
    ? duplicateAlert.matchingStatus === PENDING_STATUS
      ? 'A matching Pending RMA Request already exists.'
      : `A matching ${duplicateAlert.matchingStatus} RMA Request already exists today.`
    : undefined

  return (
    <section className="flex min-w-0 justify-center">
      <Card className="w-full max-w-[760px] overflow-hidden rounded-xl">
        <CardHeader className="border-b">
          <CardTitle>
            <h2 className="text-2xl font-semibold tracking-tight">
              Request details
            </h2>
          </CardTitle>
          <CardDescription>RMA ID is generated automatically</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="p-6">
            <FieldGroup className="gap-[18px]">
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="rma-id">RMA ID</FieldLabel>
                    <FieldDescription className="text-xs">
                      Read-only
                    </FieldDescription>
                  </div>
                  <div className="relative">
                    <HashIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      className="h-10 bg-muted/80 pl-9 text-muted-foreground"
                      id="rma-id"
                      readOnly
                      value={nextRmaId}
                    />
                  </div>
                </Field>
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <div className="flex h-10 items-center rounded-lg border border-input bg-transparent px-3">
                    <Badge variant="secondary">{PENDING_STATUS}</Badge>
                  </div>
                  <input
                    id="status"
                    readOnly
                    type="hidden"
                    value={PENDING_STATUS}
                  />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field data-invalid={Boolean(errors.customerName)}>
                  <FieldLabel htmlFor="customer-name">Customer name</FieldLabel>
                  <div className="relative">
                    <UserIcon
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      className="h-10 pl-9"
                      id="customer-name"
                      aria-describedby={
                        errors.customerName ? 'customer-name-error' : undefined
                      }
                      aria-invalid={Boolean(errors.customerName)}
                      placeholder="Enter customer name"
                      {...customerNameRegistration}
                      onChange={(event) => {
                        onDuplicateFieldsChange()
                        void customerNameRegistration.onChange(event)
                      }}
                    />
                  </div>
                  <FieldError
                    id="customer-name-error"
                    errors={[errors.customerName]}
                  />
                </Field>
                <Field data-invalid={Boolean(errors.productId)}>
                  <FieldLabel htmlFor="product-id">Product ID</FieldLabel>
                  <div className="flex h-10 min-w-0 rounded-lg border border-input bg-transparent transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-3 has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:border-destructive/50 dark:has-[input[aria-invalid=true]]:ring-destructive/40">
                    <span className="flex items-center gap-2 border-r px-3 text-sm text-muted-foreground">
                      <PackageIcon aria-hidden="true" className="size-4" />
                      {PRODUCT_ID_PREFIX}
                    </span>
                    <Input
                      className="h-auto rounded-l-none border-0 focus-visible:ring-0"
                      id="product-id"
                      aria-describedby={
                        errors.productId ? 'product-id-error' : undefined
                      }
                      aria-invalid={Boolean(errors.productId)}
                      inputMode="text"
                      maxLength={4}
                      placeholder="Enter product ID"
                      {...productIdRegistration}
                      onChange={(event) => {
                        onDuplicateFieldsChange()
                        event.currentTarget.value = sanitizeProductIdSuffix(
                          event.currentTarget.value,
                        )
                        void productIdRegistration.onChange(event)
                      }}
                    />
                  </div>
                  <FieldError
                    id="product-id-error"
                    errors={[errors.productId]}
                  />
                </Field>
              </div>
              <Field data-invalid={Boolean(errors.reason)}>
                <FieldLabel htmlFor="reason">Reason</FieldLabel>
                <Textarea
                  id="reason"
                  aria-describedby={
                    errors.reason
                      ? 'reason-error reason-description'
                      : 'reason-description'
                  }
                  aria-invalid={Boolean(errors.reason)}
                  className="min-h-32"
                  placeholder="Describe why the customer is requesting a return."
                  {...reasonRegistration}
                  onChange={(event) => {
                    onDuplicateFieldsChange()
                    void reasonRegistration.onChange(event)
                  }}
                />
                <FieldDescription id="reason-description">
                  Include condition, defect details, and customer-provided
                  notes.
                </FieldDescription>
                <FieldError id="reason-error" errors={[errors.reason]} />
              </Field>

              {duplicateAlert && duplicateAlertMessage ? (
                <Alert className="animate-in duration-200 fade-in slide-in-from-top-1">
                  <CircleAlertIcon aria-hidden="true" />
                  <AlertTitle>Couldn't create</AlertTitle>
                  <AlertDescription>
                    <p>{duplicateAlertMessage}</p>
                    <p>
                      Matching RMA ID: {duplicateAlert.matchingRmaId}. Status:{' '}
                      {duplicateAlert.matchingStatus}.
                    </p>
                  </AlertDescription>
                  <AlertAction>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        params={{ rmaId: duplicateAlert.matchingRmaId }}
                        to="/rma/$rmaId"
                      >
                        View matching request
                      </Link>
                    </Button>
                  </AlertAction>
                </Alert>
              ) : submitError ? (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col-reverse items-stretch justify-end gap-3 border-t p-6 sm:flex-row sm:items-center">
            {cancelAction}
            <Button disabled={isSubmitting} type="submit">
              <CheckIcon aria-hidden="true" />
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  )
}

export { RmaCreatePage }
