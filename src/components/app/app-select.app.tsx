import type { ReactNode } from 'react'
import type { JSX } from 'react/jsx-runtime'
import { Slot } from '@radix-ui/react-slot'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  type SelectItemProps,
  type SelectProps,
  type SelectTriggerProps,
} from '@/components/ui/select'
import { cn } from '@/utils/styles/cn.util'

type Option = {
  icon?: JSX.Element
  text: string
  description?: string
  value: string
}

type AppSelectProps = SelectProps &
  Pick<SelectTriggerProps, 'className' | 'id' | 'name' | 'size'> & {
    options?: Option[]
    placeholder?: string
    renderDisplay?: (value?: string) => ReactNode
  }

// TODO convert this to InputSelect
function AppSelect({
  children,
  className,
  id,
  name,
  options = [],
  placeholder = 'Choose',
  renderDisplay,
  size,
  value,
  ...otherProps
}: AppSelectProps) {
  return (
    <Select value={value} {...otherProps}>
      <SelectTrigger
        className={cn('w-full', className)}
        id={id}
        name={name}
        size={size}
      >
        {renderDisplay
          ? renderDisplay(value)
          : (value ?? <SelectValue placeholder={placeholder} />)}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.length === 0
            ? children
            : options.map((o) => <AppSelectOption key={o.text} {...o} />)}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

type AppSelectOptionProps = Omit<SelectItemProps, 'textValue'> & Option

function AppSelectOption({
  children,
  description,
  icon,
  text,
  ...otherProps
}: AppSelectOptionProps) {
  return (
    <SelectItem textValue={text} {...otherProps}>
      {icon && description ? (
        <AppAllTogetherOption
          icon={icon}
          description={description}
          text={text}
        />
      ) : icon && !description ? (
        <AppWithIconOnlyOption icon={icon} text={text} />
      ) : !icon && description ? (
        <AppWithDescriptionOnlyOption description={description} text={text} />
      ) : text ? (
        <span>{text}</span>
      ) : (
        children
      )}
    </SelectItem>
  )
}

type OptionWithoutValue = Omit<Option, 'value'>

function AppWithIconOnlyOption({
  icon,
  text,
}: Omit<OptionWithoutValue, 'description'>) {
  return (
    <div className="flex items-center gap-2">
      <Slot className="mt-0.5" aria-hidden="true">
        {icon}
      </Slot>

      <span>{text}</span>
    </div>
  )
}

function AppWithDescriptionOnlyOption({
  description,
  text,
}: Omit<OptionWithoutValue, 'icon'>) {
  return (
    <div className="grid gap-0.5">
      <span>{text}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </div>
  )
}

function AppAllTogetherOption({ description, icon, text }: OptionWithoutValue) {
  return (
    <div className="flex gap-2">
      <Slot className="mt-0.5" aria-hidden="true">
        {icon}
      </Slot>
      <span className="grid gap-0.5">
        <span>{text}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </span>
    </div>
  )
}

export type { AppSelectProps, AppSelectOptionProps, Option }

export { AppSelect, AppSelectOption }
