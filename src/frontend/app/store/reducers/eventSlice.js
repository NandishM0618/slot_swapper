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

export const getMyEvents = createAsyncThunk("events/getMine", async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/events/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) return thunkAPI.rejectWithValue(data.message);

        return data.events;
    } catch {
        return thunkAPI.rejectWithValue("Network error");
    }
});

export const updateEventStatus = createAsyncThunk(
    "events/updateStatus",
    async ({ id, status }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/events/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);

            return data.event;
        } catch {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);


export const deleteEvent = createAsyncThunk(
    "events/delete",
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/events/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);

            return id;
        } catch {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);

export const fetchSwappableSlots = createAsyncThunk(
    "events/fetchSwappableSlots",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/swappable-slots`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);

            return data.slots;
        } catch {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);

export const createSwapRequest = createAsyncThunk(
    "events/createSwapRequest",
    async ({ mySlotId, theirSlotId }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/swap-request`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ mySlotId, theirSlotId }),
            });

            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);

            return data;
        } catch {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);


export const getSwapRequests = createAsyncThunk(
    "events/getSwapRequests",
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/swap-requests`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);
            return data.requests;
        } catch {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);


export const respondSwapRequest = createAsyncThunk(
    "events/respondSwapRequest",
    async ({ requestId, accept }, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/swap-response/${requestId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ accept }),
            });
            const data = await res.json();
            if (!res.ok) return thunkAPI.rejectWithValue(data.message);
            return data;
        } catch {
            return thunkAPI.rejectWithValue("Network error");
        }
    }
);

const eventSlice = createSlice({
    name: "events",
    initialState: {
        events: [],
        myEvents: [],
        swapRequests: [],
        swappableSlots: [],
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

            .addCase(getMyEvents.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getMyEvents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.myEvents = action.payload;
            })
            .addCase(getMyEvents.rejected, (state, action) => {
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
                state.status = "failed"; state.error = action.payload;
            })

            .addCase(updateEventStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateEventStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                state.myEvents = state.myEvents.map(ev =>
                    ev._id === updated._id ? updated : ev
                );
            })
            .addCase(updateEventStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteEvent.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteEvent.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;
                state.myEvents = state.myEvents.filter(ev => ev._id !== deletedId);
            })
            .addCase(deleteEvent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchSwappableSlots.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchSwappableSlots.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.swappableSlots = action.payload;
            })
            .addCase(fetchSwappableSlots.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })

            .addCase(createSwapRequest.fulfilled, (state) => {
                state.status = "succeeded";
            })

            .addCase(getSwapRequests.fulfilled, (state, action) => {
                state.swapRequests = action.payload;
            })
            .addCase(respondSwapRequest.fulfilled, (state, action) => {
                const updatedSwap = action.payload.swap;
                state.swapRequests = state.swapRequests.filter(
                    req => req._id !== updatedSwap._id
                );
            });
    },
});

export default eventSlice.reducer;
