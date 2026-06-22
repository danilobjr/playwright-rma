import { X } from 'lucide-react'
import { toast } from 'sonner'

import { Toaster } from '@/components/ui/sonner'

type RichToastVariant = 'success' | 'error' | 'warning'

type RichToastProps = {
  id: string | number
  title: string
  description: string
  variant?: RichToastVariant
}

const variantConfig: Record<
  RichToastVariant,
  {
    iconBg: string
    iconColor: string
    iconName: 'check' | 'triangle-alert' | 'circle-alert'
  }
> = {
  success: {
    iconBg: 'bg-[#ECFDF5]',
    iconColor: 'text-[#047857]',
    iconName: 'check',
  },
  error: {
    iconBg: 'bg-[#FEF2F2]',
    iconColor: 'text-[#B91C1C]',
    iconName: 'triangle-alert',
  },
  warning: {
    iconBg: 'bg-[#FFFBEB]',
    iconColor: 'text-[#B45309]',
    iconName: 'circle-alert',
  },
}

function RichToast({
  id,
  title,
  description,
  variant = 'success',
}: RichToastProps) {
  const config = variantConfig[variant]

  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-white p-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.05)]"
      style={{ borderColor: '#E4E4E7' }}
    >
      <div
        className={`flex size-8 items-center justify-center rounded-full ${config.iconBg}`}
      >
        {config.iconName === 'check' ? (
          <svg
            className={`size-4 ${config.iconColor}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : config.iconName === 'triangle-alert' ? (
          <svg
            className={`size-4 ${config.iconColor}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        ) : (
          <svg
            className={`size-4 ${config.iconColor}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0.5">
        <span className="text-sm font-semibold text-[#09090B]">{title}</span>
        <span className="text-[13px] text-[#71717A]">{description}</span>
      </div>

      <button
        type="button"
        className="flex size-4 items-center justify-center text-[#A1A1AA] hover:text-[#71717A]"
        onClick={() => toast.dismiss(id)}
      >
        <X className="size-full" />
        <span className="sr-only">Dismiss</span>
      </button>
    </div>
  )
}

function AppToaster() {
  return <Toaster />
}

export { AppToaster, RichToast }
