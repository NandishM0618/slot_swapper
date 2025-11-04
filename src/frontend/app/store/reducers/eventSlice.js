import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:8080/api";

export const createEvent = createAsyncThunk("events/create", async (payload, thunkAPI) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/events/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) return thunkAPI.rejectWithValue(data.message);
        return data.event;
    } catch {
        return thunkAPI.rejectWithValue("Network error");
    }
});

export const getEvents = createAsyncThunk("events/get", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/events`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) return thunkAPI.rejectWithValue(data.message);

        return data;
    } catch {
        return thunkAPI.rejectWithValue("Network error");
    }
});

const eventSlice = createSlice({
    name: "events",
    initialState: {
        events: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEvents.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getEvents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.events = action.payload.events;

            })
            .addCase(getEvents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(createEvent.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createEvent.fulfilled, (state, action) => {
                state.status = "succeeded";
            })
            .addCase(createEvent.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default eventSlice.reducer;
