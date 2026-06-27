export interface UiTabsLinkOption {
  href: string
  label: string
}

export interface UiTabsLinksProps {
  modelValue: string
  options: UiTabsLinkOption[]
}

export type UiTabsRadiosValue = string | number | boolean | null

export interface UiTabsRadioOption {
  value: UiTabsRadiosValue
  label: string
}

export interface UiTabsRadiosProps {
  id?: string
  name?: string
  modelValue: UiTabsRadiosValue
  options: UiTabsRadioOption[]
}
