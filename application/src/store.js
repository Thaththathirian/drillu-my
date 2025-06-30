import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import persistStore from "reduxjs-toolkit-persist/es/persistStore";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "reduxjs-toolkit-persist/es/constants";

import settingsReducer from "store/slices/settingsSlice";
import layoutReducer from "layout/layoutSlice";
import langReducer from "lang/langSlice";
import authReducer from "auth/authSlice";
import menuReducer from "layout/nav/main-menu/menuSlice";
import notificationReducer from "layout/nav/notifications/notificationSlice";
import scrollspyReducer from "components/scrollspy/scrollspySlice";
import coursesReducer from "store/slices/coursesSlice";
import courseModulesReducer from "store/slices/courseModulesSlice";
import testsReducer from "store/slices/testsSlice";
import testResultsReducer from "store/slices/testResultsSlice";
import dashboardReducer from "store/slices/dashboardSlice";
import { REDUX_PERSIST_KEY } from "config.js";
import courseTypesReducer from "store/slices/courseTypesSlice";

const persistConfig = {
  key: REDUX_PERSIST_KEY,
  storage,
  whitelist: ["menu", "settings", "lang", "auth"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    // UI/Layout reducers
    settings: settingsReducer,
    layout: layoutReducer,
    lang: langReducer,
    menu: menuReducer,
    notification: notificationReducer,
    scrollspy: scrollspyReducer,

    // Authentication
    auth: authReducer,

    // Academic management
    courses: coursesReducer,
    courseTypes: courseTypesReducer,
    courseModules: courseModulesReducer,
    tests: testsReducer,
    testResults: testResultsReducer,
    dashboard: dashboardReducer,
  })
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

const persistedStore = persistStore(store);

export { store, persistedStore };
