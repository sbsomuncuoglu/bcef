import axios from "axios"

export default {
  async getMetaData() {
    let res = await axios.get("http://18.215.135.131:4000/metadata");
    return res.data;
  }
}