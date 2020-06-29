import {
  Box,
  Button,
  ColorPalette,
  Input,
  Select,
  Text,
  Switch,
  TextButton,
  Link,
  Label,
  colors,
  colorUtils
} from '@airtable/blocks/ui'
import React from 'react'
import allowedColors from './allowedColors'

const mapping = (onChangeFn, control, controlOptions, currentValue, index) => {
  switch (control) {
    case 'date-time':
      return <></>
    case 'font':
      return <></>
    case 'position':
      return ''
    case 'audio':
      return ''
    case 'browser':
      return ''
    case 'color':
      return (
        <>
          <Label>{controlOptions.label}</Label>
          <p>{controlOptions.help_text}</p>
          <ColorPalette
            color={currentValue}
            allowedColors={Object.keys(allowedColors).map(
              (color) => colors[color]
            )}
            onChange={(newVal) => {
              onChangeFn(colorUtils.getHexForColor(allowedColors[newVal]))
            }}
          />
        </>
      )
    case 'dropdown':
      return (
        <>
          <Label>{controlOptions.label}</Label>
          <p>{controlOptions.help_text}</p>
          <Select
            value={controlOptions.default}
            options={controlOptions.options}
            onChange={(newVal) => {
              onChangeFn(newVal)
            }}
          />
        </>
      )
    case 'image':
      return ''
    case 'orderPicker':
      return ''
    case 'rss':
      return <></>
    case 'scale':
      return ''
    case 'range':
    case 'slider':
    case 'stepper':
      return (
        <>
          <Label>{controlOptions.label}</Label>
          <p>{controlOptions.help_text}</p>
          <Input
            value={controlOptions.default}
            type="number"
            min={0}
            max={100}
            step={1}
            onChange={(e) => {
              onChangeFn(e.targe.value)
            }}
          />
          {controlOptions.unit}
        </>
      )
    case 'text':
      return <></>
    case 'textarea':
      return <></>
    case 'toggle':
      return (
        <>
          <Label>{controlOptions.label}</Label>
          <p>{controlOptions.help_text}</p>
          <Switch
            value={controlOptions.default}
            onChange={(newVal) => {
              onChangeFn(newVal)
            }}
          />
        </>
      )
    case 'url':
      return <></>
    case 'video':
      return ''
  }
}

export default mapping
