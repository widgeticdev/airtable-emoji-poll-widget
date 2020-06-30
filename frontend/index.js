import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  useViewport,
  Box,
} from "@airtable/blocks/ui";
import { globalConfig, session } from "@airtable/blocks";
import backend from "./backend";
import React, { useState } from "react";
import EmojiPoll from "./EmojiPoll";
import Editor from "./Editor";
import { skinMeta, skins, id as widgetId } from "./widget.json";

const loadSDK = loadScriptFromURLAsync(
  "https://cdn.jsdelivr.net/npm/@widgetic/sdk/lib/sdk.js"
);

const refreshToken = () => {
  const currentUser = session.currentUser;
  const accessToken = globalConfig.get("token");
  const expires = globalConfig.get("expires");
  return new Promise((resolve, reject) => {
    if (accessToken && Date.now() < expires) {
      // token's valid for another 30 minutes
      console.log("found saved token", accessToken);
      resolve(accessToken);
    } else {
      console.log("refreshing token");
      console.log("currentUser", currentUser);
      backend
        .post("/block/auth", {
          widgetId,
          siteName: currentUser.id || "localhost",
        })
        .then(({ data }) => {
          console.log("found data", data);
          globalConfig.setAsync("token", data.token);
          globalConfig.setAsync("expires", Date.now() + 86300000);
          resolve(data.token);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

function EmojiPollBlock() {
  const [isShowSettings, setIsShowSettings] = useState(false);
  const viewport = useViewport();
  useSettingsButton(function () {
    if (viewport.isFullscreen) {
      viewport.exitFullscreen();
    } else {
      viewport.enterFullscreenIfPossible();
    }
    setIsShowSettings(!isShowSettings);
  });

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
      <EmojiPoll />

      <Editor visible={isShowSettings} skinMeta={skinMeta} />
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
  globalConfig.setAsync("skin", skins[0]);
  initializeBlock(() => <EmojiPollBlock />);
});
