import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  useViewport,
  Box,
  useGlobalConfig,
} from "@airtable/blocks/ui";
import backend from "./backend";
import { globalConfig, session, base } from "@airtable/blocks";
import React, { useEffect } from "react";
import shortid from "shortid";
import Editor from "./Editor";
import {
  id as widgetId,
  skins,
  content,
  contentMeta,
  skinMeta,
} from "./widget.json";
const compositionId = "5efba5c5ecb2a19c168b4567";
var isEditorVisible = false;

function EmojiPoll() {
  // Block viewport
  const viewport = useViewport();

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

  // Block global settings
  const globalConfigSyn = useGlobalConfig();
  let blockID = globalConfig.get("id");
  if (!blockID) {
    blockID = shortid.generate();
    globalConfig.setAsync("id", blockID);
  }

  // set the skin for the composition
  const skin = globalConfigSyn.get("skin");
  if (!skin) {
    globalConfigSyn.setAsync("skin", skins[0]);
  }

  // create the Widgetic composition inside the Block
  useEffect(() => {
    const target = clearTarget();
    window.Widgetic.UI.composition(target, compositionId, {
      autoscale: "off",
      resize: "fill",
      skin,
    });
  });

  const clearTarget = () => {
    const blockID = globalConfig.get("id");
    const target = document.getElementById(blockID);
    if (target) {
      target.innerHTML = "";
      return target;
    }
  };

  // Block HTML template
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
      <Editor visible={isEditorVisible} skinMeta={skinMeta} />
    </Box>
  );
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
