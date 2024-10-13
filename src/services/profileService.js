import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_BASE_URL}`;

export const getUserData = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.data) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.log(error);
  }
};

export const updateUserData = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/user/update`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Unexpected response format");
    }
  } catch (error) {
    console.log(error);
  }
};

export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `${API_URL}/auth/change-password`,
      passwordData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data && res.data.data) {
      console.log("Password changed successfully");
    }
  } catch (error) {
    console.log(error);
  }
};
