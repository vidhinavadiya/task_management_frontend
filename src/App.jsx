import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Transactions from './pages/Transactions';
import AdminLayout from './layouts/AdminLayout';

function App() {
  const token = localStorage.getItem("adminToken");
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            token
              ? <Navigate to="/admin/projects" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/projects" replace />} />
          
          <Route path="projects" element={<Projects />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;