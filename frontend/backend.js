import axios from "axios";

// interface with Widgetic's api that provides composition IDs
const backend = axios.create({
  baseURL: "https://airtable.widgetic.com",
});
export default backend;
