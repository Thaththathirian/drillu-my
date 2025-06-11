import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../config/axios";
import { apiCache, cacheHelpers } from "../../utils/apiCache";

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Enhanced fetch with caching awareness
export const fetchTestResults = createAsyncThunk(
  "testResults/fetchTestResults",
  async ({ testId, courseId, moduleId, forceRefresh = false }, { rejectWithValue, getState }) => {
    console.log("🚀 Starting fetchTestResults:", { testId, courseId, moduleId, forceRefresh });
    
    // Validate required parameters
    if (!testId || !courseId || !moduleId) {
      const error = "Missing required parameters: testId, courseId, or moduleId";
      console.error("❌ Validation Error:", error);
      return rejectWithValue(error);
    }

    // Generate cache key
    const cacheKey = apiCache.generateKey("/test_result", {
      test_id: testId,
      course_id: courseId,
      module_id: moduleId,
    });

    try {
      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cachedData = apiCache.get(cacheKey);
        if (cachedData && cachedData.status === "success") {
          console.log("✅ Using cached test results");
          
          // Validate cached data matches request
          const resultData = cachedData.data;
          if (resultData && resultData.test) {
            const cachedTestId = String(resultData.test.id);
            const requestedTestId = String(testId);
            
            if (cachedTestId === requestedTestId) {
              return resultData;
            } else {
              console.warn("⚠️ Cached data test ID mismatch, fetching fresh data");
              apiCache.delete(cacheKey);
            }
          }
        }
      }

      console.log("📡 Making fresh API request to /test_result");
      
      const response = await axios.post(`/test_result`, {
        test_id: testId,
        course_id: courseId,
        module_id: moduleId,
      }, {
        skipCache: forceRefresh // Skip axios cache if force refresh
      });
      
      console.log("📦 Fresh API Response:", response);

      // Check if response exists
      if (!response || !response.data) {
        throw new Error("Empty response from server");
      }

      // Check for successful response
      if (response.data.status === "success") {
        console.log("✅ API Success - Data received:", response.data.data);
        
        // Validate that returned data matches requested parameters
        const resultData = response.data.data;
        if (resultData && resultData.test) {
          const returnedTestId = String(resultData.test.id);
          const requestedTestId = String(testId);
          
          if (returnedTestId !== requestedTestId) {
            console.warn("⚠️ API returned data for different test:", {
              requested: requestedTestId,
              returned: returnedTestId
            });
            return rejectWithValue(`Data mismatch: Expected test ${requestedTestId}, got ${returnedTestId}`);
          }
        }
        
        // Cache the successful response
        apiCache.set(cacheKey, response.data, 2 * 60 * 1000); // 2 minutes cache
        
        return resultData;
      } 
      
      // Handle API error responses
      if (response.data.status === "error") {
        const errorMessage = response.data.message || "API returned error status";
        console.error("❌ API Error Status:", errorMessage);
        return rejectWithValue(errorMessage);
      }

      // Handle unexpected response format
      console.warn("⚠️ Unexpected response format:", response.data);
      return rejectWithValue("Unexpected response format from server");

    } catch (error) {
      console.error("❌ API Request Error:", error);
      
      // Clear potentially stale cache on error
      apiCache.delete(cacheKey);
      
      // Handle different types of errors
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           `Server error: ${error.response.status}`;
        console.error("❌ Server Error Response:", error.response.data);
        return rejectWithValue(errorMessage);
      } else if (error.request) {
        console.error("❌ Network Error - No Response:", error.request);
        return rejectWithValue("Network error: Unable to connect to server");
      } else {
        console.error("❌ Request Setup Error:", error.message);
        return rejectWithValue(`Request error: ${error.message}`);
      }
    }
  }
);

const initialState = {
  results: null,
  status: "idle",
  error: null,
  currentTestId: null,
  currentCourseId: null,
  currentModuleId: null,
  lastFetchParams: null,
  isInitialized: false,
  isCached: false, // Track if current data is from cache
};

const testResultsSlice = createSlice({
  name: "testResults",
  initialState,
  reducers: {
    // Complete reset of state
    clearTestResults: (state) => {
      console.log("🧹 Clearing all test results state");
      state.results = null;
      state.status = "idle";
      state.error = null;
      state.currentTestId = null;
      state.currentCourseId = null;
      state.currentModuleId = null;
      state.lastFetchParams = null;
      state.isInitialized = false;
      state.isCached = false;
    },
    
    // Clear only error
    clearError: (state) => {
      console.log("🧹 Clearing error state");
      state.error = null;
    },
    
    // Initialize with cache check
    initializeTestResults: (state, action) => {
      console.log("🚀 Initializing test results state:", action.payload);
      const { testId, courseId, moduleId } = action.payload;
      
      // Check if we're switching to a different test
      const isDifferentTest = state.currentTestId && (
        String(state.currentTestId) !== String(testId) ||
        String(state.currentCourseId) !== String(courseId) ||
        String(state.currentModuleId) !== String(moduleId)
      );
      
      if (isDifferentTest) {
        console.log("🔄 Different test detected, clearing previous data");
        state.results = null;
        state.status = "idle";
        state.error = null;
        state.isCached = false;
      }
      
      // Always update current parameters
      state.currentTestId = testId;
      state.currentCourseId = courseId;
      state.currentModuleId = moduleId;
      state.lastFetchParams = { testId, courseId, moduleId };
      state.isInitialized = true;
    },
    
    // Force refresh - clear cache and refetch
    forceRefreshTestResults: (state, action) => {
      console.log("🔄 Force refreshing test results");
      const { testId } = action.payload;
      
      // Clear cache for this test
      cacheHelpers.invalidateTestCache(testId);
      
      // Reset state to trigger refetch
      state.status = "idle";
      state.error = null;
      state.isCached = false;
    },
    
    // Reset to idle state without clearing data
    resetToIdle: (state) => {
      console.log("🔄 Resetting to idle state");
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestResults.pending, (state, action) => {
        console.log("⏳ Test results fetch PENDING");
        
        // Only update status if we're not already loading the same request
        const requestParams = action.meta.arg;
        const isSameRequest = state.lastFetchParams && 
          String(state.lastFetchParams.testId) === String(requestParams.testId) &&
          String(state.lastFetchParams.courseId) === String(requestParams.courseId) &&
          String(state.lastFetchParams.moduleId) === String(requestParams.moduleId);
        
        if (!isSameRequest || state.status !== "loading") {
          state.status = "loading";
          state.error = null;
          state.lastFetchParams = requestParams;
          state.isCached = false;
        }
      })
      
      .addCase(fetchTestResults.fulfilled, (state, action) => {
        console.log("✅ Test results fetch FULFILLED");
        
        // Check if this was from cache by looking at the meta
        const wasCached = action.meta.arg.wasCached || false;
        
        const receivedData = action.payload;
        const requestParams = action.meta.arg;
        
        // Validate data before storing
        if (receivedData && receivedData.test) {
          const receivedTestId = String(receivedData.test.id);
          const requestedTestId = String(requestParams.testId);
          
          if (receivedTestId !== requestedTestId) {
            console.error("❌ Data validation failed: Test ID mismatch", {
              received: receivedTestId,
              requested: requestedTestId
            });
            state.status = "failed";
            state.error = `Data mismatch: Expected test ${requestedTestId}, received ${receivedTestId}`;
            return;
          }
        }
        
        state.status = "succeeded";
        state.results = receivedData;
        state.error = null;
        state.isInitialized = true;
        state.isCached = wasCached;
        
        // Update current tracking
        state.currentTestId = requestParams.testId;
        state.currentCourseId = requestParams.courseId;
        state.currentModuleId = requestParams.moduleId;
        
        // Validate the received data
        if (!receivedData) {
          console.warn("⚠️ Received null/undefined data");
          state.error = "No data received from server";
          state.status = "failed";
        }
      })
      
      .addCase(fetchTestResults.rejected, (state, action) => {
        console.log("❌ Test results fetch REJECTED");
        console.log("💥 Error payload:", action.payload);
        
        state.status = "failed";
        state.error = action.payload || action.error?.message || "Unknown error occurred";
        state.isCached = false;
        
        // Clear mismatched results
        if (state.results && state.results.test) {
          const currentResultTestId = String(state.results.test.id);
          const requestedTestId = String(action.meta.arg.testId);
          
          if (currentResultTestId !== requestedTestId) {
            console.log("🧹 Clearing mismatched previous results");
            state.results = null;
          }
        }
      });
  },
});

export const { 
  clearTestResults, 
  clearError, 
  initializeTestResults,
  forceRefreshTestResults,
  resetToIdle 
} = testResultsSlice.actions;

export default testResultsSlice.reducer;