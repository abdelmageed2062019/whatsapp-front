// contactSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadContacts, getContacts } from "../../services/contactService";

export const uploadContactsAsync = createAsyncThunk(
  "contacts/uploadContacts",
  async ({ name, content }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", content);
      formData.append("list_name", name);

      const response = await uploadContacts(formData);
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

export const getContactsAsync = createAsyncThunk(
  "contacts/getContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getContacts();
      return response;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue({ message: error.message });
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    status: "idle",
    error: null,
    currentFileName: "",
    currentFileContent: null,
    fetchStatus: "idle",
    fetchError: null,
  },
  reducers: {
    setCurrentFileName: (state, action) => {
      state.currentFileName = action.payload;
    },
    setCurrentFileContent: (state, action) => {
      state.currentFileContent = action.payload;
    },
    clearCurrentFile: (state) => {
      state.currentFileName = "";
      state.currentFileContent = null;
    },
    clearError: (state) => {
      state.error = null;
      state.fetchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadContactsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadContactsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
        state.currentFileName = "";
        state.currentFileContent = null;
        state.error = null;
      })
      .addCase(uploadContactsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getContactsAsync.pending, (state) => {
        state.fetchStatus = "loading";
        state.fetchError = null;
      })
      .addCase(getContactsAsync.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.contacts = action.payload;
        state.fetchError = null;
      })
      .addCase(getContactsAsync.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.fetchError = action.payload;
      });
  },
});

export const {
  setCurrentFileName,
  setCurrentFileContent,
  clearCurrentFile,
  clearError,
} = contactSlice.actions;

export default contactSlice.reducer;

export const selectAllContacts = (state) => state.contacts.contacts;
export const selectContactsStatus = (state) => state.contacts.status;
export const selectContactsError = (state) => state.contacts.error;
export const selectCurrentFileName = (state) => state.contacts.currentFileName;
export const selectCurrentFileContent = (state) =>
  state.contacts.currentFileContent;
export const selectContactsFetchStatus = (state) => state.contacts.fetchStatus;
export const selectContactsFetchError = (state) => state.contacts.fetchError;
