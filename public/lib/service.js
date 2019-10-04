require('dotenv').config()
const axios = require('axios')

const api = axios.create({
  baseURL:'https://restcountries.eu/rest/v2',
  timeout:process.env.TIMEOUT || 5000
})
// rest/v2/all
const get = async(url) => {
  console.log(url);
  const response = await api.get(url)
  console.log(response.data);
  const { data } = response;
  if(data) {
    return data
  }
  throw new Error(data.error.type)
}

module.exports = {
  getRates : () => get('/all'),
}
