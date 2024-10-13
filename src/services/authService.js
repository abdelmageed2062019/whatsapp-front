import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.error(
      "Login error:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const signup = async (
  name,
  email,
  phone,
  company,
  country_code,
  password
) => {
  try {
    const data = {
      name,
      email,
      phone,
      company,
      country_code,
      password,
    };

    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status === true) {
      console.log("Signup success: ", response.data);
      return response.data;
    }

    return response.data;
  } catch (error) {
    console.error("Signup error: ", error);
    throw error;
  }
};
