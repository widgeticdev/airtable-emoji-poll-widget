import { FieldType } from "@airtable/blocks/models";
export default {
  "date-time": FieldType.DATE_TIME,
  font: null,
  position: null,
  audio: null,
  browser: null,
  color: null,
  dropdown: FieldType.SINGLE_SELECT,
  image: FieldType.MULTIPLE_ATTACHMENTS,
  orderPicker: null,
  rss: FieldType.URL,
  scale: FieldType.NUMBER,
  range: FieldType.NUMBER,
  slider: null,
  stepper: FieldType.NUMBER,
  text: FieldType.SINGLE_LINE_TEXT,
  textarea: FieldType.MULTILINE_TEXT,
  toggle: null,
  url: FieldType.URL,
  video: FieldType.URL,
};
