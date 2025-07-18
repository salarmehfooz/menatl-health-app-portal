import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createContent,
  fetchAllContent,
  updateContent,
  deleteContent,
} from "../api/contentAPI";

// Thunks
export const addContent = createAsyncThunk(
  "content/add",
  async (contentData) => await createContent(contentData)
);

export const fetchContent = createAsyncThunk(
  "content/fetch",
  async () => await fetchAllContent()
);

export const editContent = createAsyncThunk(
  "content/update",
  async ({ id, updatedData }) => await updateContent(id, updatedData)
);

export const removeContent = createAsyncThunk("content/delete", async (id) => {
  await deleteContent(id);
  return id;
});

// Slice
const contentSlice = createSlice({
  name: "content",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(addContent.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.content);
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(editContent.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeContent.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default contentSlice.reducer;
