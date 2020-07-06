import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  Box,
  useViewport,
} from "@airtable/blocks/ui";

import { globalConfig, session } from "@airtable/blocks";
import { useRecords, useBase } from "@airtable/blocks/ui";
import React, { useState } from "react";
import shortid from "shortid";
import Editor from "./Editor";
import backend from "./backend";
import urls from "./urls";
import setupTables from "./setupTables";

import { id as widgetId, skins, contentMeta, skinMeta } from "./widget.json";

class EmojiPoll extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      composition: null,
      content: props.content,
    };
    this.setSkin = this.setSkin.bind(this);
  }
  componentDidMount() {
    const skin = globalConfig.get("skin");
    const target = document.getElementById(globalConfig.get("id"));
    console.log("the passed props", this.props.content);
    const { content } = this.props;
    const composition = window.Widgetic.UI.composition(
      target,
      this.props.compId,
      {
        autoscale: "off",
        resize: "fill",
        skin,
      }
    );
    composition.setContent(content);
    this.setState({ composition });
  }
  componentDidUpdate(previousContent) {
    if (
      JSON.stringify(previousContent.content) !=
      JSON.stringify(this.props.content)
    ) {
      console.log("update props called");
      this.state.composition.setContent(this.props.content);
    }
    // console.log("the composition is ", this.state.composition.api.content);
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
        <div
          id={blockID}
          style={{
            width:
              "calc(100% - " + (this.props.isEditorVisible ? 324 : 0) + "px)",
            height: "100%",
          }}
        ></div>
        <Editor
          done={this.props.done}
          visible={this.props.isEditorVisible}
          skinMeta={skinMeta}
          setSkin={this.setSkin}
        />
      </Box>
    );
  }
}

function EmojiPollBlock(props) {
  const { compId } = props;
  // Block viewport
  const viewport = useViewport();

  // from label to translator attribute
  let translator = {};
  Object.keys(contentMeta.attributes).forEach((attribute) => {
    translator[contentMeta.attributes[attribute].options.label] = attribute;
  });
  const [editorVisible, setEditorVisible] = useState(false);
  // Block settings button
  useSettingsButton(function () {
    if (viewport.isFullscreen) {
      setEditorVisible(!editorVisible);
    } else {
      viewport.enterFullscreenIfPossible();
      setEditorVisible(true);
    }
  });
  // read the current tables and translate the content to
  // 'content' object
  const base = useBase();
  const contentTable = base.getTableByName("Content");
  const detailsTable = base.getTableByName("Details");
  const contents = useRecords(contentTable);
  const details = useRecords(detailsTable);
  const relevantDetail = details[0];
  let content = contents.map((content, index) => {
    const contentItem = {};
    if (index === 0) {
      const fields = Object.keys(translator);
      fields.forEach((field) => {
        if (field != "Answer" && field != "Emoji Icon") {
          const key = translator[field];
          contentItem[key] = relevantDetail.getCellValueAsString(field);
        }
      });
    }
    contentItem[translator["Answer"]] = content.getCellValueAsString("Answer");
    contentItem[translator["Emoji Icon"]] =
      urls[content.getCellValueAsString("Emoji Icon")];
    contentItem.id = "c" + index;
    contentItem.order = index + 1;
    return contentItem;
  });
  console.log(content);

  // Block fulscreen button
  viewport.watch("isFullscreen", function (viewport) {
    if (!viewport._isFullscreen && editorVisible) {
      setEditorVisible(false);
    }
  });

  const done = () => {
    viewport.exitFullscreen();
  };

  // Block HTML template
  return (
    <EmojiPoll
      done={done}
      compId={compId}
      isEditorVisible={editorVisible}
      content={content}
    />
  );
}

const retrieveCompositionId = async () => {
  let compId = globalConfig.get("compId");
  if (!compId) {
    const result = await backend.post("/block/init", {
      userId: session.currentUser.id,
      widgetId,
    });
    globalConfig.setAsync("compId", result.data.compositionId);
    compId = result.data.compositionId;
  }
  return compId;
};
loadScriptFromURLAsync("https://cdn.jsdelivr.net/npm/@widgetic/sdk/lib/sdk.js")
  .then(() => retrieveCompositionId())
  .then((compositionId) => setupTables(compositionId))
  .then((compositionId) => {
    if (!globalConfig.get("skin")) {
      globalConfig.setAsync("skin", skins[0]);
    }
    initializeBlock(() => <EmojiPollBlock compId={compositionId} />);
  });
