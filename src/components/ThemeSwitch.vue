<script setup lang="ts">
import { SavedTheme, useSavedTheme } from '@/utils/compostions/theme'

import UiRadioSwitch from '@/components/ui/ui-radio-switch/UiRadioSwitch.vue'
import type { UiRadioSwitchOption } from '@/components/ui/ui-radio-switch/UiRadioSwitch.types'

interface ThemeSwitchProps {
  vertical?: boolean
}

const props = defineProps<ThemeSwitchProps>()

const savedTheme = useSavedTheme()

const themeOptions: UiRadioSwitchOption[] = [
  {
    value: SavedTheme.Light,
    label: 'L',
  },
  {
    value: null,
    label: 'A',
  },
  {
    value: SavedTheme.Dark,
    label: 'D',
  },
]
</script>

<template>
  <UiRadioSwitch v-model="savedTheme" :options="themeOptions" :vertical="props.vertical" />
</template>
