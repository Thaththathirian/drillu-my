import React from 'react';
// utils/apiCache.js - Global API Cache System

class APICache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 minutes default cache time
    this.maxSize = 100; // Maximum cache entries
  }

  // Generate cache key from URL and parameters
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${url}::${JSON.stringify(sortedParams)}`;
  }

  // Set cache with custom TTL
  set(key, data, customTTL = null) {
    // Clean old entries if cache is getting too large
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: customTTL || this.maxAge
    });
    
    console.log(`📦 Cached data for key: ${key}`);
  }

  // Get cached data if valid
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`❌ Cache miss for key: ${key}`);
      return null;
    }

    const now = Date.now();
    const age = now - entry.timestamp;

    if (age > entry.ttl) {
      console.log(`⏰ Cache expired for key: ${key} (age: ${age}ms, ttl: ${entry.ttl}ms)`);
      this.cache.delete(key);
      return null;
    }

    console.log(`✅ Cache hit for key: ${key} (age: ${age}ms)`);
    return entry.data;
  }

  // Check if key exists and is valid
  has(key) {
    return this.get(key) !== null;
  }

  // Clear specific cache entry
  delete(key) {
    console.log(`🗑️ Deleting cache for key: ${key}`);
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    console.log(`🧹 Clearing all cache`);
    this.cache.clear();
    this.timestamps.clear();
  }

  // Clear cache entries matching pattern
  clearByPattern(pattern) {
    const keysToDelete = [];
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => {
      console.log(`🗑️ Deleting cache by pattern "${pattern}": ${key}`);
      this.cache.delete(key);
    });
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    const keysToDelete = [];

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp;
      if (age > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      console.log(`🧹 Cleaning up expired cache: ${key}`);
      this.cache.delete(key);
    });

    // If still too large, remove oldest entries
    if (this.cache.size >= this.maxSize) {
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const entriesToRemove = entries.slice(0, Math.floor(this.maxSize * 0.2));
      entriesToRemove.forEach(([key]) => {
        console.log(`🧹 Removing old cache entry: ${key}`);
        this.cache.delete(key);
      });
    }
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
      oldestEntry: Math.min(...Array.from(this.cache.values()).map(v => v.timestamp)),
      newestEntry: Math.max(...Array.from(this.cache.values()).map(v => v.timestamp))
    };
  }
}

// Create global instance
export const apiCache = new APICache();

// Cache configuration for different endpoints
export const CACHE_CONFIG = {
  // Long-term cache for relatively static data
  courses: { ttl: 15 * 60 * 1000 }, // 15 minutes
  course_modules: { ttl: 10 * 60 * 1000 }, // 10 minutes
  dashboard: { ttl: 5 * 60 * 1000 }, // 5 minutes
  
  // Medium-term cache for semi-dynamic data
  tests: { ttl: 3 * 60 * 1000 }, // 3 minutes
  test_results: { ttl: 2 * 60 * 1000 }, // 2 minutes
  
  // Short-term cache for dynamic data
  auth_check: { ttl: 30 * 1000 }, // 30 seconds
  
  // Very short cache for frequently changing data
  notifications: { ttl: 10 * 1000 }, // 10 seconds
};

// Enhanced axios interceptor with caching
export const createCachedAxiosInstance = (axiosInstance) => {
  // Request interceptor - check cache before making request
  axiosInstance.interceptors.request.use(
    (config) => {
      // Only cache GET requests and specific POST requests that are read-only
      const cachableEndpoints = ['courses', 'course_modules', 'dashboard', 'test', 'test_result'];
      const isCachable = config.method === 'get' || 
        (config.method === 'post' && cachableEndpoints.some(endpoint => config.url.includes(endpoint)));

      if (isCachable && !config.skipCache) {
        const cacheKey = apiCache.generateKey(config.url, {
          ...config.params,
          ...config.data
        });

        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
          // Return cached data as a resolved promise that looks like axios response
          config.adapter = () => {
            return Promise.resolve({
              data: cachedData,
              status: 200,
              statusText: 'OK (from cache)',
              headers: {},
              config,
              isCached: true
            });
          };
        } else {
          // Store cache key for response interceptor
          config.cacheKey = cacheKey;
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - cache successful responses
  axiosInstance.interceptors.response.use(
    (response) => {
      // Cache successful responses
      if (response.config.cacheKey && response.status === 200 && response.data) {
        const endpoint = response.config.url.split('/').pop();
        const cacheConfig = CACHE_CONFIG[endpoint] || { ttl: 5 * 60 * 1000 };
        
        apiCache.set(
          response.config.cacheKey,
          response.data,
          cacheConfig.ttl
        );
      }

      return response;
    },
    (error) => {
      // Optionally clear cache on certain errors
      if (error.response && [401, 403].includes(error.response.status)) {
        apiCache.clear();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

// Helper functions for manual cache management
export const cacheHelpers = {
  // Clear cache when data is updated
  invalidateCache: (pattern) => {
    apiCache.clearByPattern(pattern);
  },

  // Clear cache for specific test
  invalidateTestCache: (testId) => {
    apiCache.clearByPattern(`test_result::{"test_id":"${testId}"`);
    apiCache.clearByPattern(`test::{"test_id":"${testId}"`);
  },

  // Clear cache for specific course
  invalidateCourseCache: (courseId) => {
    apiCache.clearByPattern(`course_modules::{"courseId":"${courseId}"`);
    apiCache.clearByPattern(`test::{"course_id":"${courseId}"`);
  },

  // Clear cache for specific module
  invalidateModuleCache: (moduleId) => {
    apiCache.clearByPattern(`test::{"module_id":"${moduleId}"`);
  },

  // Force refresh - clear all cache
  forceRefresh: () => {
    apiCache.clear();
  },

  // Get cache stats for debugging
  getCacheStats: () => {
    return apiCache.getStats();
  }
};

// React hook for cache-aware data fetching
export const useCachedData = (key, fetcher, deps = []) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        const cachedData = apiCache.get(key);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }

        // Fetch fresh data
        const result = await fetcher();
        apiCache.set(key, result);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, loading, error };
};