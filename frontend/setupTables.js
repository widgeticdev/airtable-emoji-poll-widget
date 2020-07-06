import emojis from "./emojis";
import helper from "./helper";
import { contentMeta, content as demoContent } from "./widget.json";
import { FieldType } from "@airtable/blocks/models";
import { base } from "@airtable/blocks";
const { generateField } = helper;
const setupTables = async () => {
  // create the tables
  const contentTable = base.getTableByNameIfExists("Content");
  const detailsTable = base.getTableByNameIfExists("Details");
  const resultsTable = base.getTableByNameIfExists("Results");

  let translator = {};
  Object.keys(contentMeta.attributes).forEach((attribute) => {
    translator[contentMeta.attributes[attribute].options.label] = attribute;
  });
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
      const records = demoContent[0].content.map((contentItem) => {
        let val = {};
        val.Name = "#";
        const answer = contentItem[attribute];
        val.Answer = answer;
        val["Emoji Icon"] = { name: emojis[contentItem["emojiIcon"]] };
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
      contentMeta.bulkEditor.attributes.forEach((attr) => {
        if (detailCell[attr]) {
          const key = attributes[attr].options.label;
          const val =
            attr === "voteDeadlineTime"
              ? new Date(detailCell[attr])
              : detailCell[attr];
          record[key] = val;
        }
      });
      console.log("going into the details table", record);
      const detailsTable = base.getTableByName("Details");
      detailsTable.createRecordAsync(record);
    }
  }
  if (!resultsTable) {
    const name = "Results";
    const fields = [
      {
        name: "Title",
        type: FieldType.SINGLE_LINE_TEXT,
      },
      {
        name: "Link",
        type: FieldType.URL,
      },
    ];
    if (base.unstable_hasPermissionToCreateTable(name, fields)) {
      await base.unstable_createTableAsync(name, fields);
    } else {
      alert("Not allowed");
    }
  }
};

export default setupTables;
