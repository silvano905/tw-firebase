import { createSlice } from '@reduxjs/toolkit';

export const clipsSlice = createSlice({
    name: 'clips',
    initialState: {
        clips: null,
        clip: null
    },
    reducers: {
        getClips: (state, action) => {
            state.clips = action.payload
        },
        getClip: (state, action) => {
            state.clip = action.payload
        }

    },
});

export const { getClip, getClips } = clipsSlice.actions;

export const selectClips = (state) => state.clips.clips?state.clips.clips:null;
export const selectClip = (state) => state.clips.clip?state.clips.clip:null;

export default clipsSlice.reducer;