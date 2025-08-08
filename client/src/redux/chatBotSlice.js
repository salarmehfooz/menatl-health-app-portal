import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

const API_URL = "http://localhost:5000/api/chatbot";

// Async Thunk
export const sendMessageToAI = createAsyncThunk(
  "chat/sendMessageToAI",
  async (messages, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to connect to AI service.");
      }

      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error sending message to AI:", error);
      return rejectWithValue(error.message || "Unexpected error occurred.");
    }
  }
);

const chatBotSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [], // { id, sender, text }
    status: "idle",
    error: null,
    isOpen: false,
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: nanoid(),
        ...action.payload,
      });
    },
    clearChat: (state) => {
      state.messages = [];
      state.status = "idle";
      state.error = null;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setInitialTherapistPrompt: (state) => {
      state.messages.push({
        id: nanoid(),
        sender: "ai",
        text: "Hello, I'm here to listen. Please tell me what's on your mind. I'm here to support you.",
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages.push({
          id: nanoid(),
          sender: "ai",
          text: action.payload,
        });
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.messages.push({
          id: nanoid(),
          sender: "ai",
          text: `Error: ${action.payload}`,
        });
      });
  },
});

export const { addMessage, clearChat, toggleChat, setInitialTherapistPrompt } =
  chatBotSlice.actions;

export default chatBotSlice.reducer;
