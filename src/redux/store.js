import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appReducer from "./appReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  appState: appReducer,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["appState"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore(
  {
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  },
  composeWithDevTools
);

const persistor = persistStore(store);
export { store, persistor };
