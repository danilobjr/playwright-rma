# RMA

This context defines language for managing return merchandise authorization requests in the browser-only demo app.

## Language

**RMA Request**:
A request to authorize a product return for a customer, identified by an RMA ID.
_Avoid_: Return request, authorization, case

**RMA ID**:
A human-readable identifier for an RMA Request, formatted as `RMA-{year}-{sequence}`.
_Avoid_: Request ID, ticket ID

**Status**:
The lifecycle state of an RMA Request. Valid statuses are `Pending`, `Approved`, `Rejected`, and `Completed`.
_Avoid_: State, phase

**Pending**:
The initial Status for every newly created RMA Request.
_Avoid_: New, open

**Customer name**:
Free-text name of the customer associated with an RMA Request.
_Avoid_: Customer, client, account

**Submitted date**:
The local calendar date when an RMA Request entered the system.
_Avoid_: Date, created date

**Product ID**:
A product identifier with fixed `PRD-` prefix and a four-character uppercase alphanumeric suffix.
_Avoid_: SKU, product code

**Reason**:
Customer-provided explanation for why the product is being returned.
_Avoid_: Notes, description, issue

**Duplicate RMA Request**:
An RMA Request with matching Customer name, Product ID, and Reason after trimming, whitespace normalization, and case-insensitive comparison. A matching Pending request is always duplicate; a matching Approved, Rejected, or Completed request is duplicate only on the same local calendar day.
_Avoid_: Duplicate record, repeated return
