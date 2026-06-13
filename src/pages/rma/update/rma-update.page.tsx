type RmaUpdatePageProps = {
  rmaId: string
}

function RmaUpdatePage({ rmaId }: RmaUpdatePageProps) {
  return <p className="sr-only">{rmaId}</p>
}

export { RmaUpdatePage }
