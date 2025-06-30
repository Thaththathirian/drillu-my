import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "config/axios";
import { apiCache } from "../../utils/apiCache";

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const fetchCourseTypes = createAsyncThunk(
  "courseTypes/fetchCourseTypes",
  async (collegeId, { rejectWithValue }) => {
    console.log("Fetching course types for collegeId:", collegeId);
    
    // Generate cache key
    const cacheKey = apiCache.generateKey("/course_types", { collegeId });
    
    try {
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData && cachedData.status === "success") {
        console.log("✅ Using cached course types data");
        return cachedData.data;
      }

      console.log("📡 Making fresh API call to /course_types");
      const response = await axios.get("/course_types");
      console.log("Course Types API Response:", response);
      
      if (response.data.status === "success") {
        // Cache the successful response for 15 minutes
        apiCache.set(cacheKey, response.data, 15 * 60 * 1000);
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to fetch course types");
    } catch (error) {
      console.error("Course Types API Error:", error);
      // Clear potentially stale cache on error
      apiCache.delete(cacheKey);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCoursesByType = createAsyncThunk(
  "courseTypes/fetchCoursesByType",
  async ({ collegeId, courseTypeId }, { rejectWithValue }) => {
    console.log("Fetching courses by type:", { collegeId, courseTypeId });
    
    // Generate cache key
    const cacheKey = apiCache.generateKey("/courses_by_type", { collegeId, courseTypeId });
    
    try {
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData && cachedData.status === "success") {
        console.log("✅ Using cached courses by type data");
        return {
          data: cachedData.data,
          fromCache: true,
        };
      }

      console.log("📡 Making fresh API call to /courses with course_type filter");
      const response = await axios.get(`/courses?course_type=${courseTypeId}`);
      console.log("Courses by Type API Response:", response);
      
      if (response.data.status === "success") {
        // Cache the successful response for 10 minutes
        apiCache.set(cacheKey, response.data, 10 * 60 * 1000);
        return {
          data: response.data.data,
          fromCache: false,
        };
      }
      return rejectWithValue(response.data.message || "Failed to fetch courses by type");
    } catch (error) {
      console.error("Courses by Type API Error:", error);
      // Clear potentially stale cache on error
      apiCache.delete(cacheKey);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  courseTypes: [],
  coursesByType: [],
  status: "idle",
  coursesStatus: "idle",
  error: null,
  coursesError: null,
  lastFetch: null,
  isCached: false,
  currentCourseTypeId: null,
};

const courseTypesSlice = createSlice({
  name: "courseTypes",
  initialState,
  reducers: {
    clearCourseTypes: (state) => {
      state.courseTypes = [];
      state.status = "idle";
      state.error = null;
      state.lastFetch = null;
      state.isCached = false;
      // Clear cache as well
      apiCache.clearByPattern("course_types");
    },
    clearCoursesByType: (state) => {
      state.coursesByType = [];
      state.coursesStatus = "idle";
      state.coursesError = null;
      state.currentCourseTypeId = null;
      // Clear courses by type cache
      apiCache.clearByPattern("courses_by_type");
    },
    clearError: (state) => {
      state.error = null;
      state.coursesError = null;
    },
    setCurrentCourseTypeId: (state, action) => {
      const newCourseTypeId = action.payload;

      // Clear data if switching to different course type
      if (
        state.currentCourseTypeId &&
        String(state.currentCourseTypeId) !== String(newCourseTypeId)
      ) {
        console.log("🔄 Different course type detected, clearing previous courses");
        state.coursesByType = [];
        state.coursesStatus = "idle";
        state.coursesError = null;
      }

      state.currentCourseTypeId = newCourseTypeId;
    },
    forceRefreshCourseTypes: (state) => {
      console.log("🔄 Force refreshing course types");
      apiCache.clearByPattern("course_types");
      apiCache.clearByPattern("courses_by_type");
      state.status = "idle";
      state.coursesStatus = "idle";
      state.error = null;
      state.coursesError = null;
      state.isCached = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Course Types
      .addCase(fetchCourseTypes.pending, (state) => {
        console.log("Course types fetch pending");
        state.status = "loading";
        state.error = null;
        state.isCached = false;
      })
      .addCase(fetchCourseTypes.fulfilled, (state, action) => {
        console.log("Course types fetch succeeded:", action.payload);
        state.status = "succeeded";
        state.courseTypes = action.payload;
        state.error = null;
        state.lastFetch = Date.now();
        state.isCached = action.meta?.fromCache || false;
      })
      .addCase(fetchCourseTypes.rejected, (state, action) => {
        console.log("Course types fetch failed:", action.payload);
        state.status = "failed";
        state.error = action.payload;
        state.isCached = false;
      })
      // Fetch Courses by Type
      .addCase(fetchCoursesByType.pending, (state) => {
        console.log("Courses by type fetch pending");
        state.coursesStatus = "loading";
        state.coursesError = null;
      })
      .addCase(fetchCoursesByType.fulfilled, (state, action) => {
        console.log("Courses by type fetch succeeded:", action.payload);
        state.coursesStatus = "succeeded";
        state.coursesByType = action.payload.data;
        state.coursesError = null;
      })
      .addCase(fetchCoursesByType.rejected, (state, action) => {
        console.log("Courses by type fetch failed:", action.payload);
        state.coursesStatus = "failed";
        state.coursesError = action.payload;
      });
  },
});

export const { 
  clearCourseTypes, 
  clearCoursesByType, 
  clearError, 
  setCurrentCourseTypeId,
  forceRefreshCourseTypes 
} = courseTypesSlice.actions;

export default courseTypesSlice.reducer;