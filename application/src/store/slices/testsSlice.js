import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const fetchTests = createAsyncThunk(
  "tests/fetchTests",
  async ({ courseId, moduleId }, { rejectWithValue }) => {
    console.log("Fetching tests for:", { courseId, moduleId });
    try {
      const response = await axios.post(`/test`, {
        course_id: courseId,
        module_id: moduleId,
      });
      console.log("Tests API Response:", response);
      if (response.data.status === "success") {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to fetch tests");
    } catch (error) {
      console.error("Tests API Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  tests: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const testsSlice = createSlice({
  name: "tests",
  initialState,
  reducers: {
    clearTests: (state) => {
      state.tests = [];
      state.status = "idle";
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTests.pending, (state) => {
        console.log("Tests fetch pending");
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        console.log("Tests fetch succeeded:", action.payload);
        state.status = "succeeded";
        state.tests = action.payload;
        state.error = null;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        console.log("Tests fetch failed:", action.payload);
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearTests, clearError } = testsSlice.actions;
export default testsSlice.reducer;
