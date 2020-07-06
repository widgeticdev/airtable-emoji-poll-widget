import { FieldType } from "@airtable/blocks/models";
import emojis from "./emojis";
// helper functions for interfacing between Airtable & Widgetic

// fields match Widgetic's input controllers to Airtable's field types
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

// generate field options for each input controller
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
      const choices = options.map((x) => {
        let result = {};
        result.name = emojis[x.value];
        result.color = "blueLight2";
        return result;
      });
      return { choices };
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

// final generateField function
const generateField = (attributeData) => {
  const key = attributeData.control.split("/")[2];
  const val = fields[key];
  const options = fieldOptions(key, attributeData.options.options);
  const label = attributeData.options.label;
  const field = {
    name: label,
    type: FieldType[val],
    options,
  };
  return field;
};

const helper = {
  generateField,
};

export default helper;
