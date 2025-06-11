import axios from "axios";
import { BASE_URL } from "../constants";
import { createCachedAxiosInstance, cacheHelpers } from "../utils/apiCache";

const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Add caching capability
const cachedInstance = createCachedAxiosInstance(instance);

cachedInstance.interceptors.request.use(
  (config) => {
    const pathParts = window.location.pathname.split("/");
    const collegeId = pathParts[1];
    if (collegeId) {
      config.url = `/${collegeId}/student${config.url}`;
    }

    // Add cache headers for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
        cacheKey: config.cacheKey,
        skipCache: config.skipCache
      });
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

cachedInstance.interceptors.response.use(
  (response) => {
    // Log cache information in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        cached: response.isCached || false,
        dataSize: JSON.stringify(response.data).length
      });
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized access - clearing cache");
      cacheHelpers.forceRefresh();
    }
    
    console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    
    return Promise.reject(error);
  }
);

// Helper methods for specific API patterns
export const apiHelpers = {
  // Get data with automatic caching
  getCached: (url, params = {}, skipCache = false) => {
    return cachedInstance.get(url, { 
      params, 
      skipCache 
    });
  },

  // Post data with automatic caching (for read-only posts like test_result)
  postCached: (url, data = {}, skipCache = false) => {
    return cachedInstance.post(url, data, { 
      skipCache 
    });
  },

  // Post data without caching (for write operations)
  postNoCache: (url, data = {}) => {
    return cachedInstance.post(url, data, { 
      skipCache: true 
    });
  },

  // Force refresh specific endpoint
  refreshData: (url, params = {}) => {
    return cachedInstance.get(url, { 
      params, 
      skipCache: true 
    });
  }
};

export default cachedInstance;