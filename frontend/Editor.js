import React from 'react'
import { globalConfig } from '@airtable/blocks'
import { Loader, Box, Heading } from '@airtable/blocks/ui'
import mapping from './translator'

class Editor extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      skin: {}
    }
  }

  componentDidMount () {
    const skinId = globalConfig.get('skinId') || this.props.skin.id
    if (skinId === 'p1_5e32af95ecb2a1857e8b4568') {
      this.setState({
        skin: this.props.skin,
        loading: false
      })
    } else {
      window.Widgetic.api(`skins/${skinId}`, 'GET').then((skin) => {
        // current skin values
        this.setState({ skin, loading: false })
      })
    }
  }

  generateTab (generateOnChange, tabName, controls, index) {
    // tab is an object straight out of widget skinMeta
    return (
      <Box key={parseInt(index)} paddingLeft='1rem' paddingRight='1rem'>
        {Object.keys(controls).map((control, index2) =>
          this.generateControl(
            generateOnChange,
            control,
            controls[control],
            index2
          )
        )}
      </Box>
    )
  }

  generateOnChange (property) {
    const updateSkin = (newVal) => {
      const presetSkinRegex = /^p[1-9]{1}_/
      const currentSkin = this.state.skin
      const skinId = currentSkin.id
      currentSkin[property] = newVal
      window.Widgetic.auth.token(globalConfig.get('token'))
      if (presetSkinRegex.test(skinId)) {
        window.Widgetic.api('skins', 'POST', JSON.stringify(currentSkin)).then(
          (skin) => {
            globalConfig.setAsync('skinId', skin.id)
            this.setState({ skin })
          }
        )
      } else {
        window.Widgetic.api(
          `skins/${skinId}`,
          'PUT',
          JSON.stringify(currentSkin)
        ).then((skin) => {
          this.setState({ skin })
        })
      }
    }
    return updateSkin
  }

  generateControl (generateOnChange, propertyName, controlOptions, index) {
    const control = controlOptions.control.split('/')[2]
    const onChange = generateOnChange(propertyName)
    const values = this.state.skin
    const controlValues = values[control]
    const InputController = mapping(
      onChange,
      control,
      controlOptions.options,
      controlValues,
      index
    )
    return InputController
  }

  render () {
    const { skinMeta, visible } = this.props
    const { tabs } = skinMeta

    const EditorFrame = (
      <Box
        width='324px'
        height='100%'
        display={visible ? 'block' : 'none'}
        backgroundColor='rgb(250, 250, 250)'
        overflowY='auto'
        paddingBottom='1rem'
      >
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
        >
        {
          this.state.loading ?
          <Loader scale={0.3} /> :
          Object.keys(tabs).map((tab, index) =>
            this.generateTab(
              this.generateOnChange.bind(this),
              tab,
              tabs[tab],
              index
            )
          )
        }
        </Box>
      </Box>
    )

    return EditorFrame
  }

}
export default Editor
