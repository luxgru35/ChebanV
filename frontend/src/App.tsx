import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import EventsPage from './pages/EventsPage/EventsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import EventFormPage from './pages/EventFormPage/EventFormPage';
import { useAppSelector } from './store/hooks';
import { selectToken } from './store/selectors';
import './App.css';

console.log('App component loading...');

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  console.log('ProtectedRoute rendering...');
  const token = useAppSelector(selectToken);
  console.log('Token:', token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  console.log('App rendering...');
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/events/create" 
        element={
          <ProtectedRoute>
            <EventFormPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/events/edit/:id" 
        element={
          <ProtectedRoute>
            <EventFormPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
