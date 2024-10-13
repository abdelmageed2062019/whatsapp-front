import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadFiles, getFiles } from "../../services/filesServices";

// Async Thunks
export const uploadFilesAsync = createAsyncThunk(
  "files/uploadFiles",
  async ({ name, content, id }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("path", content);
      formData.append("type", name);
      formData.append("user_id", id);
      const response = await uploadFiles(formData);
      return response; // Return only the data from the response object
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Upload failed";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const getFilesAsync = createAsyncThunk(
  "files/getFiles",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getFiles(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

// Initial State
const initialState = {
  files: [],
  uploadStatus: "idle",
  uploadError: null,
  currentFileName: "",
  currentFileContent: null,
  filesFetchStatus: "idle",
  filesFetchError: null,
};

// Create Slice
const fileSlice = createSlice({
  name: "files",
  initialState,
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
    clearErrors: (state) => {
      state.uploadError = null;
      state.filesFetchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle uploadFilesAsync
      .addCase(uploadFilesAsync.pending, (state) => {
        state.uploadStatus = "loading";
        state.uploadError = null;
      })
      .addCase(uploadFilesAsync.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.files.push(action.payload); // Add the new file to the list
        state.currentFileName = "";
        state.currentFileContent = null;
      })
      .addCase(uploadFilesAsync.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.uploadError = action.payload;
      })
      // Handle getFilesAsync
      .addCase(getFilesAsync.pending, (state) => {
        state.filesFetchStatus = "loading";
        state.filesFetchError = null;
      })
      .addCase(getFilesAsync.fulfilled, (state, action) => {
        state.filesFetchStatus = "succeeded";
        state.files = action.payload;
      })
      .addCase(getFilesAsync.rejected, (state, action) => {
        state.filesFetchStatus = "failed";
        state.filesFetchError = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  setCurrentFileName,
  setCurrentFileContent,
  clearCurrentFile,
  clearErrors,
} = fileSlice.actions;

export default fileSlice.reducer;

// Selectors
export const selectAllFiles = (state) => state.files.files;
export const selectUploadStatus = (state) => state.files.uploadStatus;
export const selectUploadError = (state) => state.files.uploadError;
export const selectCurrentFileName = (state) => state.files.currentFileName;
export const selectCurrentFileContent = (state) =>
  state.files.currentFileContent;
export const selectFilesFetchStatus = (state) => state.files.filesFetchStatus;
export const selectFilesFetchError = (state) => state.files.filesFetchError;
