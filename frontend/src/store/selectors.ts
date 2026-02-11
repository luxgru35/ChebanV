import type { RootState } from './index';

// Auth Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;

// Events Selectors
export const selectEventsState = (state: RootState) => state.events;
export const selectAllEvents = (state: RootState) => state.events.list;
export const selectUserEvents = (state: RootState) => state.events.userEvents;
export const selectEventsStatus = (state: RootState) => state.events.status;
export const selectEventsError = (state: RootState) => state.events.error;
