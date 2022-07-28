import { createSlice } from '@reduxjs/toolkit';

export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: null,
        post: null,
        unwatched: null
    },
    reducers: {
        getPosts: (state, action) => {
            state.posts = action.payload
        },
        getPost: (state, action) => {
            state.post = action.payload
        },
        removeUnwatched: (state, action) => {
            state.unwatched = null
        },
        setUnwatchedPosts: (state, action) => {
            state.unwatched = state.posts.filter((item) => !item.data.watched.includes(action.payload))
        }

    },
});

export const { getPost, getPosts, setUnwatchedPosts, removeUnwatched } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts?state.posts.posts:null;
export const selectPost = (state) => state.posts.post?state.posts.post:null;
export const selectUnwatched = (state) => state.posts.unwatched?state.posts.unwatched:null;

export default postsSlice.reducer;