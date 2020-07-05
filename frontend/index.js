import {
  initializeBlock,
  loadScriptFromURLAsync,
  useSettingsButton,
  Box,
  useViewport,
} from "@airtable/blocks/ui";
//TODO hook up the backend
import backend from "./backend";
import { globalConfig, session, base } from "@airtable/blocks";
import React, { useEffect, useState } from "react";
import shortid from "shortid";
import Editor from "./Editor";
import helper from "./helper";
import emojis from "./emojis";
import { FieldType } from "@airtable/blocks/models";

const { generateField } = helper;
import {
  id as widgetId,
  skins,
  content as demoContent,
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
        <div
          id={blockID}
          style={{
            width:
              "calc(100% - " + (this.props.isEditorVisible ? 324 : 0) + "px)",
            height: "100%",
          }}
        ></div>
        <Editor
          visible={this.props.isEditorVisible}
          skinMeta={skinMeta}
          setSkin={this.setSkin}
        />
      </Box>
    );
  }
}
const setupTables = async () => {
  // create the tables
  const contentTable = base.getTableByNameIfExists("Content");
  const detailsTable = base.getTableByNameIfExists("Details");
  const attributes = contentMeta.attributes;
  if (!contentTable) {
    const detailFields = contentMeta.bulkEditor.attributes.map((x) =>
      generateField(attributes[x])
    );
    const attributeFields = Object.keys(attributes).map((x) =>
      generateField(attributes[x])
    );
    const differentFields = attributeFields.filter((field) => {
      const matches = detailFields.filter(
        (dField) => dField.name === field.name
      );
      return matches.length ? false : true;
    });
    // for multimedia content
    differentFields.unshift({
      name: "Name",
      type: FieldType.SINGLE_LINE_TEXT,
    });
    const fields = differentFields;
    if (base.unstable_hasPermissionToCreateTable("Content", fields)) {
      await base.unstable_createTableAsync("Content", fields);
      // and create records
      const contentTable = base.getTableByName("Content");
      const attribute = contentMeta.input.attribute;
      const records = demoContent[0].content.map((e) => {
        let val = {};
        val.Name = "#";
        const answer = e[attribute];
        val.Answer = answer;
        val["Emoji Image"] = { name: emojis[answer] };
        return val;
      });
      contentTable.createRecordsAsync(records);
    }
  }
  if (!detailsTable && contentMeta.bulkEditor) {
    const name = "Details";
    const detailCell = demoContent[0].content[0];
    const fields = contentMeta.bulkEditor.attributes.map((attribute) =>
      generateField(attributes[attribute])
    );
    console.log("fields for details table", fields);
    if (base.unstable_hasPermissionToCreateTable(name, fields)) {
      await base.unstable_createTableAsync(name, fields);
      let record = {};
      contentMeta.bulkEditor.attributes.forEach((element) => {
        if (detailCell[element]) {
          const key = attributes[element].options.label;
          record[key] = detailCell[element];
        }
      });
      console.log("record is ", record);
      const detailsTable = base.getTableByName("Details");
      detailsTable.createRecordAsync(record);
    }
  }
};

function EmojiPollBlock() {
  // Block viewport
  const viewport = useViewport();
  const [editorVisible, setEditorVisible] = useState(false);
  const [content, setContent] = useState({});
  // Block settings button
  useSettingsButton(function () {
    if (viewport.isFullscreen) {
      setEditorVisible(!editorVisible);
    } else {
      viewport.enterFullscreenIfPossible();
      setEditorVisible(true);
    }
  });

  // mandatory call to unwatch
  useEffect(() => {
    return () => viewport.unwatch("isFullscreen");
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
  .then(() => setupTables())
  .then(() => retrieveCompositionId())
  .then((compositionId) => {
    // data is data read by readTables, convert it to content
    window.Widgetic.init(
      "5525287d09c7e201498b4567_5ep4alabc9wk00kc08c8o4kw008ksowogsg4w0wwkog8ww80o0",
      "https://airtable.widgetic.com/callback"
    );
    if (!globalConfig.get("skin")) {
      globalConfig.setAsync("skin", skins[0]);
    }
    // from label to translator attribute
    let translator = {};
    Object.keys(contentMeta.attributes).forEach((attribute) => {
      translator[contentMeta.attributes[attribute].options.label] = attribute;
    });
    initializeBlock(() => (
      <EmojiPollBlock compId={compositionId} translator={translator} />
    ));
  });
