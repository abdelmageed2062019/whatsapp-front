import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  storeConversation,
  //   getConversations,
} from "../../services/conversationService"; // Ensure you have this import

// Async thunk for storing conversation data
export const storeConversationAsync = createAsyncThunk(
  "conversation/storeConversation",
  async (data, { rejectWithValue }) => {
    try {
      const response = await storeConversation(data);
      return response; // Assuming response contains the stored conversation details
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to store conversation"
      );
    }
  }
);

// Async thunk for fetching conversations
// export const fetchConversationsAsync = createAsyncThunk(
//   "conversation/fetchConversations",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await getConversations();
//       return response; // Assuming response contains the list of conversations
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data || "Failed to fetch conversations"
//       );
//     }
//   }
// );

// Create conversation slice
export const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [], // To store a list of conversations
    status: "idle", // idle | loading | succeeded | failed
    error: null, // For error messages
  },
  reducers: {
    clearConversations: (state) => {
      state.conversations = []; // Clear conversations if needed
    },
  },
  extraReducers: (builder) => {
    // Handling storeConversationAsync
    builder
      .addCase(storeConversationAsync.pending, (state) => {
        state.status = "loading"; // Set loading status
      })
      .addCase(storeConversationAsync.fulfilled, (state, action) => {
        state.status = "succeeded"; // Set succeeded status
        state.conversations.push(action.payload); // Add the new conversation to the list
      })
      .addCase(storeConversationAsync.rejected, (state, action) => {
        state.status = "failed"; // Set failed status
        state.error = action.payload; // Store error message
      });
    // Handling fetchConversationsAsync
    //  .addCase(fetchConversationsAsync.pending, (state) => {
    //    state.status = "loading"; // Set loading status
    //  })
    //  .addCase(fetchConversationsAsync.fulfilled, (state, action) => {
    //    state.status = "succeeded"; // Set succeeded status
    //    state.conversations = action.payload; // Set the conversations list
    //  })
    //  .addCase(fetchConversationsAsync.rejected, (state, action) => {
    //    state.status = "failed"; // Set failed status
    //    state.error = action.payload; // Store error message
    //  });
  },
});

// Export the actions from the slice
export const { clearConversations } = conversationSlice.actions;

// Selectors
export const selectConversations = (state) => state.conversation.conversations;
export const selectConversationStatus = (state) => state.conversation.status;
export const selectConversationError = (state) => state.conversation.error;

// Export the reducer to be used in the store
export default conversationSlice.reducer;
