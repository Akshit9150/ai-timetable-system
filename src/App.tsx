import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Teachers from './pages/Teachers';
import Timings from './pages/Timings';
import Rooms from './pages/Rooms';
import Timetable from './pages/Timetable';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/timings" element={<Timings />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;