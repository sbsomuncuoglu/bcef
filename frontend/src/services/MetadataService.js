import axios from "axios"

export default {
  async getMetaData() {
    let res = await axios.get("http://localhost:4000/metadata");
    return res.data;
  }
}