import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "config/axios";
import { apiCache } from "../../utils/apiCache";

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (collegeId, { rejectWithValue }) => {
    console.log("Fetching courses for collegeId:", collegeId);
    
    // Generate cache key
    const cacheKey = apiCache.generateKey("/courses", { collegeId });
    
    try {
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData && cachedData.status === "success") {
        console.log("✅ Using cached courses data");
        return cachedData.data;
      }

      console.log("📡 Making fresh API call to /courses");
      const response = await axios.get("/courses");
      console.log("API Response:", response);
      
      if (response.data.status === "success") {
        // Cache the successful response for 15 minutes
        apiCache.set(cacheKey, response.data, 15 * 60 * 1000);
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to fetch courses");
    } catch (error) {
      console.error("API Error:", error);
      // Clear potentially stale cache on error
      apiCache.delete(cacheKey);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
  lastFetch: null,
  isCached: false,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourses: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.lastFetch = null;
      state.isCached = false;
      // Clear cache as well
      apiCache.clearByPattern("courses");
    },
    clearError: (state) => {
      state.error = null;
    },
    forceRefreshCourses: (state) => {
      console.log("🔄 Force refreshing courses");
      apiCache.clearByPattern("courses");
      state.status = "idle";
      state.error = null;
      state.isCached = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        console.log("Courses fetch pending");
        state.status = "loading";
        state.error = null;
        state.isCached = false;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        console.log("Courses fetch succeeded:", action.payload);
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
        state.lastFetch = Date.now();
        // Check if this was from cache (would need to be passed in meta)
        state.isCached = action.meta?.fromCache || false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        console.log("Courses fetch failed:", action.payload);
        state.status = "failed";
        state.error = action.payload;
        state.isCached = false;
      });
  },
});

export const { clearCourses, clearError, forceRefreshCourses } = coursesSlice.actions;
export default coursesSlice.reducer;