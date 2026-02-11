import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Event } from '../../types';
import * as eventService from '../../api/eventService';


interface EventsState {
    list: Event[];
    userEvents: Event[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: EventsState = {
    list: [],
    userEvents: [],
    status: 'idle',
    error: null,
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (includeDeleted: boolean = false, { rejectWithValue }) => {
        try {
            const data = await eventService.getEvents(includeDeleted);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch events');
        }
    }
);

export const fetchUserEvents = createAsyncThunk(
    'events/fetchUserEvents',
    async (_, { rejectWithValue }) => {
        try {
            const data = await eventService.getUserEvents();
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to fetch user events');
        }
    }
);

export const createEvent = createAsyncThunk(
    'events/createEvent',
    async (eventData: Partial<Event>, { rejectWithValue }) => {
        try {
            const data = await eventService.createEvent(eventData);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to create event');
        }
    }
);

export const updateEvent = createAsyncThunk(
    'events/updateEvent',
    async ({ id, data }: { id: number; data: Partial<Event> }, { rejectWithValue }) => {
        try {
            const response = await eventService.updateEvent(id, data);
            return response;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to update event');
        }
    }
);

export const deleteEvent = createAsyncThunk(
    'events/deleteEvent',
    async (id: number, { rejectWithValue }) => {
        try {
            await eventService.deleteEvent(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to delete event');
        }
    }
);

export const toggleParticipation = createAsyncThunk(
    'events/toggleParticipation',
    async ({ eventId, userId, user }: { eventId: number; userId: number; user: { id: number, name: string, email: string } }, { rejectWithValue }) => {
        try {
            const response = await eventService.participate(eventId);
            return { eventId, userId, participating: response.participating, user };
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.error || 'Failed to participate');
        }
    }
);

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Fetch All
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });

        // Fetch User Events
        builder
            .addCase(fetchUserEvents.fulfilled, (state, action) => {
                state.userEvents = action.payload;
            });

        // Create
        builder.addCase(createEvent.fulfilled, (state, action) => {
            state.list.push(action.payload);
            state.userEvents.push(action.payload);
        });

        // Update
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            const index = state.list.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
            const userIndex = state.userEvents.findIndex(e => e.id === action.payload.id);
            if (userIndex !== -1) {
                state.userEvents[userIndex] = action.payload;
            }
        });

        // Delete
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            // Удаляем из общего списка
            state.list = state.list.filter(e => e.id !== action.payload);
            // Удаляем из списка пользователя
            state.userEvents = state.userEvents.filter(e => e.id !== action.payload);
        });

        // Participate
        builder.addCase(toggleParticipation.fulfilled, (state, action) => {
            const { eventId, userId, participating, user } = action.payload;
            const event = state.list.find(e => e.id === eventId);
            if (event) {
                if (participating) {
                    if (!event.participants?.some(p => p.id === userId)) {
                        event.participants = [...(event.participants || []), user];
                    }
                } else {
                    event.participants = event.participants?.filter(p => p.id !== userId);
                }
            }
        });
    },
});

export default eventsSlice.reducer;
