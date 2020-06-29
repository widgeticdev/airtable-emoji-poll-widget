import { globalConfig, session } from '@airtable/blocks'
import React, { Component } from 'react'
import shortid from 'shortid'
import backend from './backend'
import { id as widgetId, skins as defaultSkins, content, width, height } from './widget.json'

class EmojiPoll extends Component {
  constructor (props) {
    super(props)
    this.retrieveCompositionId = this.retrieveCompositionId.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
  }

  componentDidMount () {
    const target = this.clearTarget()
    this.retrieveCompositionId().then((compositionId) => {
      const child = document.createElement('widgetic-embed')
      child.setAttribute('width', width)
      child.setAttribute('height', height)
      child.setAttribute('id', compositionId)
      child.setAttribute('autoscale', 'on')
      child.setAttribute('resize', 'fixed')
      target.appendChild(child)
    })
    // setInterval(this.saveChanges(), 5000)
  }

  retrieveCompositionId () {
    // if a composition has already been saved,
    // returns it
    // otherwise, creates one
    return new Promise((resolve, reject) => {
      const compId = globalConfig.get('compId')
      if (compId) {
        console.log('Found composition', compId)
        resolve(compId)
      } else {
        console.log('creating new composition')
        this.refreshToken()
          .then((token) => {
            console.log('refreshed the token: ', token)
            // it has been set as an attribute
            window.Widgetic.auth.token(token)
            // create a composition
            const orderedContent = content[0].content.map((val, index) => {
              val.id = index + 1
              return val
            })
            const composition = {
              name: 'My Composition',
              content: orderedContent,
              skin_id: defaultSkins[0].id,
              widget_id: widgetId
            }
            return window.Widgetic.api(
              'compositions',
              'POST',
              JSON.stringify(composition)
            )
          })
          .then((composition) => {
            console.log('composition creation successful ', composition.id)
            globalConfig.setAsync('compId', composition.id)
            resolve(composition.id)
          })
          .catch((e) => reject(e))
      }
    })
  }

  refreshToken () {
    const currentUser = session.currentUser
    const accessToken = globalConfig.get('token')
    const expires = globalConfig.get('expires')
    return new Promise((resolve, reject) => {
      if (accessToken && Date.now() < expires) {
        // token's valid for another 30 minutes
        console.log('found saved token', accessToken)
        resolve(accessToken)
      } else {
        console.log('refreshing token')
        console.log('currentUser', currentUser)
        backend
          .post('/block/auth', {
            widgetId,
            siteName: currentUser.id || 'localhost'
          })
          .then(({ data }) => {
            console.log('found data', data)
            globalConfig.setAsync('token', data.token)
            globalConfig.setAsync('expires', Date.now() + 86300000)
            resolve(data.token)
          })
          .catch((e) => {
            reject(e)
          })
      }
    })
  }

  clearTarget () {
    const blockID = globalConfig.get('id')
    const target = document.getElementById(blockID)
    if (target) {
      target.innerHTML = ''
      return target
    }
  }

  render () {
    // const Settings = mapping()
    let blockID = globalConfig.get('id')
    if (!blockID) {
      blockID = shortid.generate()
      globalConfig.setAsync('id', blockID)
    }
    return (
      <>
        <div id={blockID}></div>
      </>
    )
  }
}

export default EmojiPoll
