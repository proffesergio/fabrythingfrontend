import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from '../../services/api';

export const fetchSidebar = createAsyncThunk('data/fetchSidebar', async () => {
    const response = await api.get('/getMenus/');
    return response.data;
});

const sidebarSlice = createSlice({
    name: 'data',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
        lastFetched: null,
        cacheDuration: 5 * 60 * 1000 // 5 minutes
    },
    reducers: {
        clearSidebar: (state) => {
            state.items = [];
            state.status = 'idle';
            state.error = null;
            state.lastFetched = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSidebar.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchSidebar.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
                state.lastFetched = Date.now();
                state.error = null;
            })
            .addCase(fetchSidebar.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch menu items';
            });
    }
});

export const { clearSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;