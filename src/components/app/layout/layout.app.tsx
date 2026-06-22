import type { ReactNode } from 'react'

import { AppToaster } from '@/components/app/app-toaster.app'

import { useLayoutSnapshot } from './use-layout.hook'

type LayoutProps = {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const { breadcrumbs, title, description, topRightAction } =
    useLayoutSnapshot()

  return (
    <>
      <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7">
          <header className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex max-w-3xl flex-col gap-2">
              {breadcrumbs.length > 0 ? (
                <nav
                  aria-label="Breadcrumb"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  {breadcrumbs.map((breadcrumb, index) => (
                    <span className="contents" key={`${breadcrumb}-${index}`}>
                      {index > 0 ? (
                        <span className="text-muted-foreground/70">/</span>
                      ) : null}
                      <span
                        className={
                          index === breadcrumbs.length - 1
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }
                      >
                        {breadcrumb}
                      </span>
                    </span>
                  ))}
                </nav>
              ) : null}
              {title ? (
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              ) : null}
              {description ? (
                <p className="text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {topRightAction ? (
              <div className="flex w-full items-center gap-3 sm:w-auto">
                {topRightAction}
              </div>
            ) : null}
          </header>
          {children}
        </div>
      </main>
      <AppToaster />
    </>
  )
}

export { Layout }
