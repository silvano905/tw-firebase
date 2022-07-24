import { createSlice } from '@reduxjs/toolkit';

export const compilationsSlice = createSlice({
    name: 'compilations',
    initialState: {
        compilations: null,
        compilation: null
    },
    reducers: {
        getCompilations: (state, action) => {
            state.compilations = action.payload
        },
        getCompilation: (state, action) => {
            state.compilation = action.payload
        }

    },
});

export const { getCompilation, getCompilations } = compilationsSlice.actions;

export const selectCompilations = (state) => state.compilations.compilations?state.compilations.compilations:null;
export const selectCompilation = (state) => state.compilations.compilation?state.compilations.compilation:null;


export default compilationsSlice.reducer;