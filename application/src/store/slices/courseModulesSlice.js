import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "config/axios";
import { apiCache, cacheHelpers } from "../../utils/apiCache";

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const fetchCourseModules = createAsyncThunk(
  "courseModules/fetchCourseModules",
  async (
    { courseId, moduleId = null, forceRefresh = false },
    { rejectWithValue }
  ) => {
    console.log(
      "Fetching course modules for courseId:",
      courseId,
      "moduleId:",
      moduleId,
      "forceRefresh:",
      forceRefresh
    );

    // Generate cache key
    const cacheKey = apiCache.generateKey("/course_modules", {
      courseId,
      moduleId,
    });

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData && cachedData.status === "success") {
          console.log("✅ Using cached course modules data");
          return {
            data: cachedData.data.modules,
            fromCache: true,
          };
        }
      }

      console.log("📡 Making fresh API request to /course_modules");
      const url = moduleId
        ? `/course_modules/${courseId}/${moduleId}`
        : `/course_modules/${courseId}`;
      const response = await axios.get(url, {
        skipCache: forceRefresh,
      });

      console.log("Course Modules API Response:", response);

      if (response.data.status === "success") {
        // Cache the successful response for 10 minutes
        apiCache.set(cacheKey, response.data, 10 * 60 * 1000);
        return {
          data: response.data.data.modules,
          fromCache: false,
        };
      }
      return rejectWithValue(
        response.data.message || "Failed to fetch course modules"
      );
    } catch (error) {
      console.error("Course Modules API Error:", error);
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
  currentCourseId: null,
  lastFetch: null,
  isCached: false,
};

const courseModulesSlice = createSlice({
  name: "courseModules",
  initialState,
  reducers: {
    clearCourseModules: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.currentCourseId = null;
      state.lastFetch = null;
      state.isCached = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCourseId: (state, action) => {
      const newCourseId = action.payload;

      // Clear data if switching to different course
      if (
        state.currentCourseId &&
        String(state.currentCourseId) !== String(newCourseId)
      ) {
        console.log("🔄 Different course detected, clearing previous modules");
        state.items = [];
        state.status = "idle";
        state.error = null;
        state.isCached = false;
      }

      state.currentCourseId = newCourseId;
    },
    forceRefreshCourseModules: (state, action) => {
      console.log("🔄 Force refreshing course modules");
      const { courseId } = action.payload;

      // Clear cache for this course's modules
      cacheHelpers.invalidateCourseCache(courseId);

      state.status = "idle";
      state.error = null;
      state.isCached = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseModules.pending, (state) => {
        console.log("Course modules fetch pending");
        state.status = "loading";
        state.error = null;
        state.isCached = false;
      })
      .addCase(fetchCourseModules.fulfilled, (state, action) => {
        console.log("Course modules fetch succeeded:", action.payload);
        state.status = "succeeded";
        state.items = action.payload.data;
        state.error = null;
        state.lastFetch = Date.now();
        state.isCached = action.payload.fromCache || false;
      })
      .addCase(fetchCourseModules.rejected, (state, action) => {
        console.log("Course modules fetch failed:", action.payload);
        state.status = "failed";
        state.error = action.payload;
        state.isCached = false;
      });
  },
});

export const {
  clearCourseModules,
  clearError,
  setCurrentCourseId,
  forceRefreshCourseModules,
} = courseModulesSlice.actions;

export default courseModulesSlice.reducer;
