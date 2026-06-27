export type UiRadioSwitchValue = string | number | boolean | null

export interface UiRadioSwitchOption {
  value: UiRadioSwitchValue
  label: string
}

export interface UiRadioSwitchProps {
  id?: string
  name?: string
  modelValue: UiRadioSwitchValue
  options: UiRadioSwitchOption[]
  vertical?: boolean
}
