import axios from "axios";

const login = async (userdata) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, userdata);
    return response.data;
  } catch (e) {
    const { response } = e;
    return response.data;
  }
};

export const userService = {
  login,
};
