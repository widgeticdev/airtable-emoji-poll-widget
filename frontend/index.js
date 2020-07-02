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
      content: this.props.content,
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
        <Editor
          visible={this.props.isEditorVisible}
          skinMeta={skinMeta}
          setSkin={this.setSkin}
        />
      </Box>
    );
  }
}
// sets up the bases if not already there

function EmojiPollBlock() {
  // Block viewport
  const viewport = useViewport();
  const [editorVisible, setEditorVisible] = useState(false);
  const [content, setContent] = useState(content[0]);
  // Block settings button
  useSettingsButton(function () {
    if (viewport.isFullscreen) {
      setEditorVisible(!editorVisible);
    } else {
      viewport.enterFullscreenIfPossible();
      setEditorVisible(true);
    }
  });

  const setupTables = async () => {
    // create the tables
    await Promise.all();
    // and set up listeners on the fields
  };
  // if content is available, returns it otherwise returns false
  const readContent = async () => {
    const currentContent = {};
    const tableNames = ["Content", "Details", "Results"];
    // check if the block has all the tables
    const tablesExist = tableNames.map((tableName) => {
      return base.getTableByNameIfExists(tableName);
    });
    if (!(tablesExist[0] && tablesExist[1] && tablesExist[2])) {
      await setupTables();
    }
    // at this point, these tables are guaranteed to exist
    const inputTable = base.getTableByName("Content");
    // read
    const answers = inputTable.getFieldIfExists(
      contentMeta.input.options.label
    );
    const detailsTable = base.getTableByName("Details");
  };
  useEffect(() => {
    readContent();
    return viewport.unwatch("isFullscreen");
  });

  // Block fulscreen button
  viewport.watch("isFullscreen", function (viewport) {
    if (!viewport._isFullscreen && editorVisible) {
      setEditorVisible(false);
    }
  });

  // Block HTML template
  return <EmojiPoll isEditorVisible={editorVisible} content={content} />;
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
  initializeBlock(() => <EmojiPollBlock />);
});
