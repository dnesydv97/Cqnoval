import {createStore, applyMiddleware, compose} from 'redux';
import asyncStorage from '@react-native-community/async-storage';
import thunk from 'redux-thunk';
import {rootReducer} from './rootReducer';
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: asyncStorage,
  whitelist: [
    'outBoxReducer',
    'sentMailReducer',
    'profileReducer',
    'gendersReducer',
    'maritalStatusReducer',
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);
export {store, persistor};
