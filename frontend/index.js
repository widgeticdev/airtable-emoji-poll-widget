import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  useViewport,
  Box,
} from "@airtable/blocks/ui";
import backend from "./backend";
import { globalConfig, session } from "@airtable/blocks";
import React, { useState, useEffect } from "react";
import shortid from "shortid";
import Editor from "./Editor";
import { id as widgetId, skins, content, skinMeta } from "./widget.json";

function EmojiPoll() {
  let blockID = globalConfig.get("id");
  if (!blockID) {
    blockID = shortid.generate();
    globalConfig.setAsync("id", blockID);
  }
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
  useEffect(() => {
    const target = clearTarget();
    const skin = globalConfig.get("skin");
    retrieveCompositionId().then((compositionId) => {
      window.Widgetic.UI.composition(target, compositionId, {
        autoscale: "on",
        resize: "fill",
        skin,
      });
    });
  });

  const retrieveCompositionId = () => {
    // if a composition has already been saved,
    // returns it
    // otherwise, creates one
    return new Promise((resolve, reject) => {
      const compId = globalConfig.get("compId");
      if (compId) {
        console.log("Found composition", compId);
        resolve(compId);
      } else {
        console.log("creating new composition");
        refreshToken()
          .then((token) => {
            console.log("refreshed the token: ", token);
            // it has been set as an attribute
            window.Widgetic.auth.token(token);
            // create a composition
            const orderedContent = content[0].content.map((val, index) => {
              val.id = index + 1;
              return val;
            });
            const composition = {
              name: "My Composition",
              content: orderedContent,
              skin_id: skins[0].id,
              widget_id: widgetId,
            };
            return window.Widgetic.api(
              "compositions",
              "POST",
              JSON.stringify(composition)
            );
          })
          .then((composition) => {
            console.log("composition creation successful ", composition.id);
            globalConfig.setAsync("compId", composition.id);
            resolve(composition.id);
          })
          .catch((e) => reject(e));
      }
    });
  };

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

  const clearTarget = () => {
    const blockID = globalConfig.get("id");
    const target = document.getElementById(blockID);
    if (target) {
      target.innerHTML = "";
      return target;
    }
  };

  // const Settings = mapping()
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
      <div id={blockID} style={{ width: "100%", height: "100%" }}></div>;
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
  if (!globalConfig.get("skin")) {
    globalConfig.setAsync("skin", skins[0]);
  }
  initializeBlock(() => <EmojiPoll />);
});
