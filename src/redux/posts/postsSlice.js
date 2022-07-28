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
        nullUnwatchedPosts: (state, action) => {
            state.unwatched = null
        },
        setUnwatchedPosts: (state, action) => {
            state.unwatched = state.posts.filter((item) => !item.data.watched.includes(action.payload))
        },
        removeUnwatchedPosts: (state, action) => {
            state.unwatched = state.unwatched.filter((item) => !item.data.watched.includes(action.payload))
        },
        updateUnwatchedPosts: (state, action) => {
            state.unwatched = state.unwatched.map((item) => item.id===action.payload.id?{ ...item, data: action.payload.data}:item)
        }

    },
});

export const { getPost, getPosts, setUnwatchedPosts, nullUnwatchedPosts, removeUnwatchedPosts, updateUnwatchedPosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts?state.posts.posts:null;
export const selectPost = (state) => state.posts.post?state.posts.post:null;
export const selectUnwatched = (state) => state.posts.unwatched?state.posts.unwatched:null;

export default postsSlice.reducer;