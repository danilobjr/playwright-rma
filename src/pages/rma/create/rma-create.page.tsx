import type { ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
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

import {
  rmaCreateFormDefaultValues,
  rmaCreateFormSchema,
  type RmaCreateFormInput,
  type RmaCreateFormValues,
} from './rma-create-form.model'

const PENDING_STATUS = 'Pending'

type RmaCreatePageProps = {
  cancelAction: ReactNode
  isSubmitting: boolean
  nextRmaId: string
  submitError?: string
  onSubmit: (values: RmaCreateFormValues) => void
}

function RmaCreatePage({
  cancelAction,
  isSubmitting,
  nextRmaId,
  submitError,
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

  return (
    <section className="flex justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader className="border-b">
          <CardTitle>
            <h2 className="text-2xl font-semibold tracking-tight">
              Request details
            </h2>
          </CardTitle>
          <CardDescription>RMA ID is generated automatically</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="pb-4">
            <FieldGroup>
              <div className="flex flex-col gap-4 md:flex-row">
                <Field>
                  <FieldLabel htmlFor="rma-id">RMA ID</FieldLabel>
                  <Input id="rma-id" readOnly value={nextRmaId} />
                </Field>
                <Field className="md:w-56">
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <div className="flex h-8 items-center rounded-lg border border-input bg-transparent px-2.5">
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
              <div className="flex flex-col gap-4 md:flex-row">
                <Field data-invalid={Boolean(errors.customerName)}>
                  <FieldLabel htmlFor="customer-name">Customer Name</FieldLabel>
                  <Input
                    id="customer-name"
                    aria-describedby={
                      errors.customerName ? 'customer-name-error' : undefined
                    }
                    aria-invalid={Boolean(errors.customerName)}
                    {...register('customerName')}
                  />
                  <FieldError
                    id="customer-name-error"
                    errors={[errors.customerName]}
                  />
                </Field>
                <Field data-invalid={Boolean(errors.productId)}>
                  <FieldLabel htmlFor="product-id">Product ID</FieldLabel>
                  <Input
                    id="product-id"
                    aria-describedby={
                      errors.productId ? 'product-id-error' : undefined
                    }
                    aria-invalid={Boolean(errors.productId)}
                    {...register('productId')}
                  />
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
                  {...register('reason')}
                />
                <FieldDescription id="reason-description">
                  Include condition, defect details, and customer-provided
                  notes.
                </FieldDescription>
                <FieldError id="reason-error" errors={[errors.reason]} />
              </Field>

              {submitError ? (
                <Alert variant="destructive">
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            {cancelAction}
            <Button disabled={isSubmitting} type="submit">
              <Check aria-hidden="true" />
              Submit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  )
}

export { RmaCreatePage }
