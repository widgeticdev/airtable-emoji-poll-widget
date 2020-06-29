import axios from 'axios'

const backend = axios.create({
  // baseURL: 'http://localhost:9801'
  baseURL: 'https://airtable.widgetic.com'
})
export default backend
