import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchChats,
  fetchMessagesByThread,
  sendChatMessage,
  createChatThread,
} from "../api/chatAPI";

// ✅ Get all threads
export const getChatThreads = createAsyncThunk(
  "chat/getThreads",
  async (_, thunkAPI) => {
    try {
      return await fetchChats();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Create a new thread & send first message
export const startNewChat = createAsyncThunk(
  "chat/startNewChat",
  async ({ recipientId, message }, thunkAPI) => {
    try {
      return await createChatThread({ recipientId, message });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Load messages in a thread
export const loadMessages = createAsyncThunk(
  "chat/loadMessages",
  async (threadId, thunkAPI) => {
    try {
      return await fetchMessagesByThread(threadId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Send a message to an existing thread
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ threadId, message }, thunkAPI) => {
    try {
      const response = await sendChatMessage({ threadId, message });
      return response.chatMessage;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ✅ Initial state
const initialState = {
  threads: [],
  currentMessages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearMessages(state) {
      state.currentMessages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔁 Fetch threads
      .addCase(getChatThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChatThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })

      // ➕ Start new chat (create + send first message)
      .addCase(startNewChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startNewChat.fulfilled, (state, action) => {
        state.loading = false;

        const { thread, chatMessage } = action.payload;

        const exists = state.threads.some((t) => t._id === thread._id);
        if (!exists) {
          state.threads.push(thread);
        }

        state.currentMessages = [chatMessage];
      })

      // 📩 Load messages
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMessages = action.payload;
      })

      // 📤 Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.currentMessages.push(action.payload); // chatMessage object
      })

      // ❌ Handle errors
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        }
      );
  },
});

export const { clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
