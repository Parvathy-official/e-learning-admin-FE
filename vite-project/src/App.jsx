import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { AdminLayout } from './components/layout/AdminLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CoursesListPage } from './pages/courses/CoursesListPage';
import { CourseContentPage } from './pages/courses/CourseContentPage';
import { StudentsListPage } from './pages/students/StudentsListPage';
import { InstructorsListPage } from './pages/instructors/InstructorsListPage';
import { EnrollmentsListPage } from './pages/enrollments/EnrollmentsListPage';
import { PaymentsListPage } from './pages/payments/PaymentsListPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import './App.css';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="dashboard" element={<Navigate to="/" replace />} />
              <Route path="courses" element={<CoursesListPage />} />
              <Route path="courses/:id/content" element={<CourseContentPage />} />
              <Route path="students" element={<StudentsListPage />} />
              <Route path="instructors" element={<InstructorsListPage />} />
              <Route path="enrollments" element={<EnrollmentsListPage />} />
              <Route path="payments" element={<PaymentsListPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
