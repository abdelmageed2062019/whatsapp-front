import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

// Login function
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
    // Return error response instead of logging it
    return error.response
      ? error.response.data
      : { message: "Login failed. Please check your credentials." };
  }
};

// Signup function
export const signup = async (name, email, phone, company, password) => {
  try {
    const data = {
      name,
      email,
      phone,
      company,
      password,
      plan_id: 1,
    };

    const response = await axios.post(`${API_URL}/auth/register`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status === true) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    // Return error response instead of logging it
    return error.response
      ? error.response.data
      : { message: "Signup failed. Please try again." };
  }
};
