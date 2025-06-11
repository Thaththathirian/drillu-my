import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "config/axios";
import { apiCache } from "../../utils/apiCache";

axios.defaults.withCredentials = true;
axios.defaults.headers.common.Accept = "application/json";
axios.defaults.headers.post["Content-Type"] = "application/json";

// Fetch dashboard data with user info
export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    console.log("Fetching dashboard data");
    
    // Generate cache key
    const cacheKey = apiCache.generateKey("/dashboard", {});
    
    try {
      // Check cache first
      const cachedData = apiCache.get(cacheKey);
      if (cachedData && cachedData.status === "success") {
        console.log("✅ Using cached dashboard data");
        return cachedData.data;
      }

      console.log("📡 Making fresh API call to /dashboard");
      const response = await axios.get("/dashboard");
      console.log("Dashboard API Response:", response);
      
      if (response.data.status === "success") {
        // Cache the successful response for 5 minutes
        apiCache.set(cacheKey, response.data, 5 * 60 * 1000);
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to fetch dashboard data");
    } catch (error) {
      console.error("Dashboard API Error:", error);
      // Clear potentially stale cache on error
      apiCache.delete(cacheKey);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch student profile data separately if needed
export const fetchStudentProfile = createAsyncThunk(
  "dashboard/fetchStudentProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/student/profile");
      if (response.data.status === "success") {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || "Failed to fetch student profile");
    } catch (error) {
      console.error("Student Profile API Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  data: null,
  studentProfile: null,
  currentStudent: null, // New field for student info across app
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  loading: false,
  lastFetch: null,
  isCached: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.data = null;
      state.studentProfile = null;
      state.currentStudent = null;
      state.status = "idle";
      state.error = null;
      state.loading = false;
      state.lastFetch = null;
      state.isCached = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // New action to set current student info
    setCurrentStudent: (state, action) => {
      state.currentStudent = action.payload;
    },
    // Action to update student info from dashboard data
    updateStudentFromDashboard: (state) => {
      if (state.data && state.data.student) {
        state.currentStudent = {
          id: state.data.student.id,
          name: state.data.student.name,
          email: state.data.student.email,
          registration_number: state.data.student.registration_number,
          department: state.data.student.department,
          batch: state.data.student.batch,
          college: state.data.student.college,
        };
      }
    },
    forceRefreshDashboard: (state) => {
      console.log("🔄 Force refreshing dashboard data");
      apiCache.clearByPattern("dashboard");
      state.status = "idle";
      state.error = null;
      state.isCached = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dashboard Data
      .addCase(fetchDashboardData.pending, (state) => {
        console.log("Dashboard fetch pending");
        state.status = "loading";
        state.loading = true;
        state.error = null;
        state.isCached = false;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        console.log("Dashboard fetch succeeded:", action.payload);
        state.status = "succeeded";
        state.loading = false;
        state.data = action.payload;
        state.error = null;
        state.lastFetch = Date.now();
        state.isCached = action.meta?.fromCache || false;
        
        // Automatically update current student info when dashboard data is fetched
        if (action.payload && action.payload.student) {
          state.currentStudent = {
            id: action.payload.student.id,
            name: action.payload.student.name,
            email: action.payload.student.email,
            registration_number: action.payload.student.registration_number,
            department: action.payload.student.department,
            batch: action.payload.student.batch,
            college: action.payload.student.college,
          };
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        console.log("Dashboard fetch failed:", action.payload);
        state.status = "failed";
        state.loading = false;
        state.error = action.payload;
        state.isCached = false;
      })
      // Fetch Student Profile
      .addCase(fetchStudentProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.studentProfile = action.payload;
        
        // Update current student info if profile has more recent data
        if (action.payload) {
          state.currentStudent = {
            id: action.payload.id,
            name: action.payload.name,
            email: action.payload.email,
            registration_number: action.payload.registration_number,
            department: action.payload.department,
            batch: action.payload.batch,
            college: action.payload.college,
          };
        }
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearDashboard, 
  clearError, 
  setLoading, 
  setCurrentStudent, 
  updateStudentFromDashboard,
  forceRefreshDashboard 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;