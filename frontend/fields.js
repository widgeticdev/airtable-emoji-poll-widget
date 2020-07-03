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

const fieldOptions = {
  "date-time": {
    dateFormat: {
      name: "iso",
      format: "YYYY-MM-DD",
    },
    timeFormat: {
      name: "24hour",
      format: "HH:mm",
    },
    timeZone: "client",
  },
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
  text: null,
  textarea: "MULTILINE_TEXT",
  toggle: {
    icon: "check",
    color: "greenBright",
  },
  url: "URL",
  video: "URL",
};

const helper = {
  fields,
  fieldOptions,
};
export default helper;
