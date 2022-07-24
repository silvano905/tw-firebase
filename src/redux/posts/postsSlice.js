import { createSlice } from '@reduxjs/toolkit';

export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: null,
        post: null
    },
    reducers: {
        getPosts: (state, action) => {
            state.posts = action.payload
        },
        getPost: (state, action) => {
            state.post = action.payload
        }

    },
});

export const { getPost, getPosts } = postsSlice.actions;

export const selectPosts = (state) => state.posts.posts?state.posts.posts:null;
export const selectPost = (state) => state.posts.post?state.posts.post:null;


export default postsSlice.reducer;