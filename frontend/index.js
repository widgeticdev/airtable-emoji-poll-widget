import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  Box,
  useViewport,
} from "@airtable/blocks/ui";
import backend from "./backend";
import { globalConfig, session, base } from "@airtable/blocks";
import React, { useEffect, useState } from "react";
import shortid from "shortid";
import Editor from "./Editor";
import {
  id as widgetId,
  skins,
  content,
  contentMeta,
  skinMeta,
} from "./widget.json";

class EmojiPoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      composition: null,
    };
    this.setSkin = this.setSkin.bind(this);
  }
  componentDidMount() {
    const compositionId = "5efba5c5ecb2a19c168b4567";
    const skin = globalConfig.get("skin");
    const target = document.getElementById(globalConfig.get("id"));
    const composition = window.Widgetic.UI.composition(target, compositionId, {
      autoscale: "off",
      resize: "fill",
      skin,
    });
    this.setState({ composition });
  }

  setSkin(skin) {
    this.state.composition.setSkin(skin);
  }

  render() {
    // Block global settings
    let blockID = globalConfig.get("id");
    if (!blockID) {
      blockID = shortid.generate();
      globalConfig.setAsync("id", blockID);
    }
    return (
      <Box
        className="widgetic-widget"
        position="absolute"
        width="100%"
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
      >
        <div id={blockID} style={{ width: "100%", height: "100%" }}></div>
        <Editor visible={true} skinMeta={skinMeta} setSkin={this.setSkin} />
      </Box>
    );
  }
}

function EmojiPollBlock() {
  // Block viewport
  const viewport = useViewport();
  let isEditorVisible = false;
  // Block settings button
  useSettingsButton(function () {
    if (viewport.isFullscreen) {
      isEditorVisible = isEditorVisible ? false : true;
    } else {
      viewport.enterFullscreenIfPossible();
      isEditorVisible = true;
    }
  });

  // Block fulscreen button
  viewport.watch("isFullscreen", function (viewport) {
    if (!viewport._isFullscreen && isEditorVisible) isEditorVisible = false;
    // console.log("isEditorVisible after exit fullscreen:", isEditorVisible);}
  });

  // create the Widgetic composition inside the Block
  // const clearTarget = () => {
  //   const blockID = globalConfig.get("id");
  //   const target = document.getElementById(blockID);
  //   if (target) {
  //     target.innerHTML = "";
  //     return target;
  //   }
  // };

  // Block HTML template
  return <EmojiPoll />;
}

loadScriptFromURLAsync(
  "https://cdn.jsdelivr.net/npm/@widgetic/sdk/lib/sdk.js"
).then(() => {
  window.Widgetic.init(
    "5525287d09c7e201498b4567_5ep4alabc9wk00kc08c8o4kw008ksowogsg4w0wwkog8ww80o0",
    "https://airtable.widgetic.com/callback"
  );
  if (!globalConfig.get("skin")) {
    globalConfig.setAsync("skin", skins[0]);
  }
  initializeBlock(() => <EmojiPoll />);
});
