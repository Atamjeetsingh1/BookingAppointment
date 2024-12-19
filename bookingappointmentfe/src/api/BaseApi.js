import axios from "axios";

const makeApiCall = async (method, url, data = {}, includeAuthHeader = true) => {
  console.log("makeApiCall ==>", url)
  const config = {
    method,
    url,
    data,
  };

  if (includeAuthHeader) {

    const token = localStorage.getItem('access_token');
    config.headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  try {
    console.log("config headers", config);
    let result = await axios.request(config);
    return result;
  } catch (err) {
    return err;
  }
};

export default makeApiCall;
