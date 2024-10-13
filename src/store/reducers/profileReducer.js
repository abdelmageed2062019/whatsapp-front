import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { updateUserData, changePassword } from "../../services/profileService"; // Add the changePassword service

// Thunk for updating the profile
export const updateProfileAsync = createAsyncThunk(
  "profile/updateProfileAsync",
  async (profileData, { rejectWithValue }) => {
    try {
      const res = await updateUserData(profileData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for changing the password
export const changePasswordAsync = createAsyncThunk(
  "profile/changePasswordAsync",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await changePassword(passwordData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state
const initialState = {
  name: "",
  company: "",
  tax_number: "",
  currPassword: "",
  newPassword: "",
  status: "idle",
  passwordStatus: "idle", // Separate status for password change
  error: null,
  passwordError: null, // Separate error for password change
};

// Create a slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updateProfile(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile Cases
      .addCase(updateProfileAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.name = action.payload?.name || state.name;
        state.company = action.payload?.company || state.company;
        state.tax_number = action.payload?.tax_number || state.tax_number;
        state.error = null; // Clear any previous errors
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Change Password Cases
      .addCase(changePasswordAsync.pending, (state) => {
        state.passwordStatus = "loading";
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.passwordStatus = "succeeded";
        state.currPassword = ""; // Clear password fields after success
        state.newPassword = "";
        state.passwordError = null; // Clear any previous password errors
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.passwordStatus = "failed";
        state.passwordError = action.payload;
      });
  },
});

// Export the action creators
export const { updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
