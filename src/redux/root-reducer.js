import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import userReducer from '../redux/user/userSlice';
import postsReducer from '../redux/posts/postsSlice'
import alertsReducer from '../redux/alerts/alertsSlice'
import compilationsReducer from '../redux/compilations/compilationsSlice'
import homeReducer from '../redux/home/homeSlice'
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['user', 'posts', 'compilations', 'home']
};

const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer,
    alerts: alertsReducer,
    compilations: compilationsReducer,
    home: homeReducer
});

export default persistReducer(persistConfig, rootReducer);