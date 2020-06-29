import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  useViewport,
  Box
} from '@airtable/blocks/ui'
import React, { useState } from 'react'
import EmojiPoll from './EmojiPoll'
import Editor from './Editor'
import { skinMeta, skins } from './widget.json'

const loadSDK = loadScriptFromURLAsync(
  'https://cdn.jsdelivr.net/npm/@widgetic/sdk/lib/sdk.js'
)

function EmojiPollBlock () {
  const [isShowSettings, setIsShowSettings] = useState(false)
  const viewport = useViewport()
  useSettingsButton(function () {
    if (viewport.isFullscreen) {
      viewport.exitFullscreen()
    } else {
      viewport.enterFullscreenIfPossible()
    }
    setIsShowSettings(!isShowSettings)
  })
  return <>
    <Box
      display="flex"
      flex-direction="row"
      alignItems="center"
      justifyContent="center">

      <Editor
      visible={isShowSettings}
      skinMeta={skinMeta} skin={skins[0]} />

      <EmojiPoll />
    </Box>
  </>
}

loadSDK.then(() => {
  window.Widgetic.init(
    '5525287d09c7e201498b4567_5ep4alabc9wk00kc08c8o4kw008ksowogsg4w0wwkog8ww80o0',
    'https://airtable.widgetic.com/callback'
  )
  initializeBlock(() => <EmojiPollBlock />)
})
