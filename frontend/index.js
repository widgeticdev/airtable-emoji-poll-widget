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
import helper from "./fields";
import emojis from "./emojis";
const { fields, fieldOptions } = helper;
import {
  id as widgetId,
  skins,
  content,
  contentMeta,
  skinMeta,
} from "./widget.json";
import { FieldType } from "@airtable/blocks/models";

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
// sets up the bases if not already there
const generateField = (attributeData) => {
  const key = attributeData.control.split("/")[2];
  const val = fields[key];
  console.log("attributeData", attributeData);
  const options = fieldOptions(key, attributeData.options.options);
  const label = attributeData.options.label;
  return {
    name: label,
    type: FieldType[val],
    options,
  };
};
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
    console.log("differenceSet", differentFields);
    // for multimedia content
    differentFields.unshift({
      name: "Name",
      type: FieldType.SINGLE_LINE_TEXT,
    });
    console.log("fields are ", differentFields);
    const fields = differentFields;
    if (base.unstable_hasPermissionToCreateTable("Content", fields)) {
      await base.unstable_createTableAsync("Content", fields);
      // and create records
      const contentTable = base.getTableByName("Content");
      const attribute = contentMeta.input.attribute;
      console.log("data for content", content[0].content);
      const records = content[0].content.map((e) => {
        let val = {};
        val.Name = "#";
        const answer = e[attribute];
        val.Answer = answer;
        val["Emoji Image"] = emojis[answer];
        return val;
      });
      contentTable.createRecordsAsync(records);
    }
  }
  if (!detailsTable && contentMeta.bulkEditor) {
    const name = "Details";
    const detailCell = content[0].content[0];
    console.log("attributes");
    const fields = contentMeta.bulkEditor.attributes.map((attribute) =>
      generateField(attributes[attribute])
    );
    console.log("fields for details table", fields);
    if (base.unstable_hasPermissionToCreateTable(name, fields)) {
      await base.unstable_createTableAsync(name, fields);
      const record = [];
      const detailsTable = base.getTableByName("Details");
      detailsTable.createRecordAsync(record);
    }
  }
};

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

  useEffect(() => {
    return viewport.unwatch("isFullscreen");
  });

  if (contentMeta.bulkEditor) {
    const detailsTable = base.getTableByName("Details");
    detailsTable.watch([], function (model) {});
  }
  const contentTable = base.getTableByName("Content");
  contentTable.watch([{ name: "hello" }], function (data) {});

  // Block fulscreen button
  viewport.watch("isFullscreen", function (viewport) {
    if (!viewport._isFullscreen && editorVisible) {
      setEditorVisible(false);
    }
  });

  // Block HTML template
  return <EmojiPoll isEditorVisible={editorVisible} content={content} />;
}

loadScriptFromURLAsync("https://cdn.jsdelivr.net/npm/@widgetic/sdk/lib/sdk.js")
  .then(() => setupTables())
  .then(() => {
    window.Widgetic.init(
      "5525287d09c7e201498b4567_5ep4alabc9wk00kc08c8o4kw008ksowogsg4w0wwkog8ww80o0",
      "https://airtable.widgetic.com/callback"
    );
    if (!globalConfig.get("skin")) {
      globalConfig.setAsync("skin", skins[0]);
    }
    initializeBlock(() => <EmojiPollBlock />);
  });
