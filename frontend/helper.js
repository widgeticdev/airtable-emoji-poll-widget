import { FieldType } from "@airtable/blocks/models";
import emojis from "./emojis";
const fields = {
  "date-time": "DATE_TIME",
  font: null,
  position: null,
  audio: null,
  browser: null,
  color: null,
  dropdown: "SINGLE_SELECT",
  image: "MULTIPLE_ATTACHMENTS",
  orderPicker: null,
  rss: "URL",
  scale: "NUMBER",
  range: "NUMBER",
  slider: null,
  stepper: "NUMBER",
  text: "SINGLE_LINE_TEXT",
  textarea: "MULTILINE_TEXT",
  toggle: "CHECKBOX",
  url: "URL",
  video: "URL",
};

const fieldOptions = (input, options) => {
  switch (input) {
    case "date-time": {
      return {
        dateFormat: {
          name: "iso",
          format: "YYYY-MM-DD",
        },
        timeFormat: {
          name: "24hour",
          format: "HH:mm",
        },
        timeZone: "client",
      };
    }
    case "font": {
      return null;
    }
    case "position": {
      return null;
    }
    case "audio": {
      return null;
    }
    case "browser": {
      return null;
    }
    case "color": {
      return null;
    }
    case "dropdown": {
      console.log("passed options", options);
      const choices = options.map((x) => {
        let result = {};
        console.log("x is ", x);
        result.name = emojis[x.label];
        result.color = "blueLight2";
        return result;
      });
      return {
        choices,
      };
    }
    case "image": {
      return null;
    }
    case "orderPicker": {
      return null;
    }
    case "rss": {
      return null;
    }
    case "scale": {
      return null;
    }
    case "range": {
      return null;
    }
    case "slider": {
      return null;
    }
    case "stepper": {
      return null;
    }
    case "text": {
      return null;
    }
    case "textarea": {
      return null;
    }
    case "toggle": {
      return {
        icon: "check",
        color: "greenBright",
      };
    }
    case "url": {
      return null;
    }
    case "video": {
      return null;
    }
  }
};
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

const helper = {
  generateField,
};

export default helper;
