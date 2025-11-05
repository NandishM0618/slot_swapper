import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "https://slot-swapper-ww4u.onrender.com/api";

const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    }
    return null;
};

export const signup = createAsyncThunk("auth/signup", async (payload, thunkAPI) => {
    try {
        const res = await fetch(`${API_URL}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const json = await res.json();
        if (!res.ok) return thunkAPI.rejectWithValue(json.message || "Signup failed");

        return json.user;
    } catch (err) {
        return thunkAPI.rejectWithValue("Network error");
    }
});

export const login = createAsyncThunk("auth/login", async (payload, thunkAPI) => {
    try {
        const res = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) return thunkAPI.rejectWithValue(data.message || "Login failed");

        if (typeof window !== "undefined") {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
        }

        return data;
    } catch (err) {
        return thunkAPI.rejectWithValue("Network error");
    }
});


const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: getUserFromStorage(),
        status: "idle",
        error: null,
    },
    reducers: {
        logout(state) {
            state.user = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.pending, (state) => { state.status = "loading" })
            .addCase(signup.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(login.pending, (state) => { state.status = "loading" })
            .addCase(login.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
