import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import {
  getCourses, addCourse, updateCourse, deleteCourse,
  getTeachers, addTeacher, updateTeacher, deleteTeacher,
  getRooms, addRoom, updateRoom, deleteRoom,
  getTimetable, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry,
  generateTimetable, clearTimetable,
  getTimings, addTiming, updateTiming, deleteTiming,
  getAvailableSlots
} from './database.js';

const app = express();
const port = 5001;

console.log('Local JSON database initialized');

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'No message provided' });

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      }
    );
    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2)); // <-- Add this line

    // Try to extract the reply
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      data.candidates?.[0]?.content?.text ||
      data.candidates?.[0]?.output ||
      data.error?.message ||
      'No response from Gemini';

    res.json({ reply });
  } catch (err) {
    console.error('Gemini request failed:', err);
    res.status(500).json({ error: 'Gemini request failed', details: err.message });
  }
});

// Courses API
app.get('/api/courses', (req, res) => {
  try {
    const courses = getCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message });
  }
});

app.post('/api/courses', (req, res) => {
  try {
    const course = addCourse(req.body);
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add course', details: error.message });
  }
});

app.put('/api/courses/:id', (req, res) => {
  try {
    const course = updateCourse(req.params.id, req.body);
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course', details: error.message });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  try {
    const success = deleteCourse(req.params.id);
    if (success) {
      res.json({ message: 'Course deleted successfully' });
    } else {
      res.status(404).json({ error: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course', details: error.message });
  }
});

// Teachers API
app.get('/api/teachers', (req, res) => {
  try {
    const teachers = getTeachers();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers', details: error.message });
  }
});

app.post('/api/teachers', (req, res) => {
  try {
    const teacher = addTeacher(req.body);
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add teacher', details: error.message });
  }
});

app.put('/api/teachers/:id', (req, res) => {
  try {
    const teacher = updateTeacher(req.params.id, req.body);
    if (teacher) {
      res.json(teacher);
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher', details: error.message });
  }
});

app.delete('/api/teachers/:id', (req, res) => {
  try {
    const success = deleteTeacher(req.params.id);
    if (success) {
      res.json({ message: 'Teacher deleted successfully' });
    } else {
      res.status(404).json({ error: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete teacher', details: error.message });
  }
});

// Rooms API
app.get('/api/rooms', (req, res) => {
  try {
    const rooms = getRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms', details: error.message });
  }
});

app.post('/api/rooms', (req, res) => {
  try {
    const room = addRoom(req.body);
    res.json(room);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add room', details: error.message });
  }
});

app.put('/api/rooms/:id', (req, res) => {
  try {
    const room = updateRoom(req.params.id, req.body);
    if (room) {
      res.json(room);
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update room', details: error.message });
  }
});

app.delete('/api/rooms/:id', (req, res) => {
  try {
    const success = deleteRoom(req.params.id);
    if (success) {
      res.json({ message: 'Room deleted successfully' });
    } else {
      res.status(404).json({ error: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room', details: error.message });
  }
});

// Timetable API
app.get('/api/timetable', (req, res) => {
  try {
    const timetable = getTimetable();
    res.json(timetable);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timetable', details: error.message });
  }
});

app.post('/api/timetable', (req, res) => {
  try {
    const entry = addTimetableEntry(req.body);
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add timetable entry', details: error.message });
  }
});

app.post('/api/generate-timetable', (req, res) => {
  try {
    const result = generateTimetable();
    if (result.success) {
      res.json({ timetable: result.timetable, message: result.message });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate timetable', details: error.message });
  }
});

app.post('/api/clear-timetable', (req, res) => {
  try {
    clearTimetable();
    res.json({ message: 'Timetable cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear timetable', details: error.message });
  }
});

// Timings API
app.get('/api/timings', (req, res) => {
  try {
    const timings = getTimings();
    res.json(timings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch timings', details: error.message });
  }
});

app.post('/api/timings', (req, res) => {
  try {
    const timing = addTiming(req.body);
    res.json(timing);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add timing', details: error.message });
  }
});

app.put('/api/timings/:id', (req, res) => {
  try {
    const timing = updateTiming(req.params.id, req.body);
    if (timing) {
      res.json(timing);
    } else {
      res.status(404).json({ error: 'Timing not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update timing', details: error.message });
  }
});

app.delete('/api/timings/:id', (req, res) => {
  try {
    const success = deleteTiming(req.params.id);
    if (success) {
      res.json({ message: 'Timing deleted successfully' });
    } else {
      res.status(404).json({ error: 'Timing not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete timing', details: error.message });
  }
});

// Available slots API
app.get('/api/available-slots', (req, res) => {
  try {
    const availableSlots = getAvailableSlots();
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available slots', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`AI backend (Gemini) listening on port ${port}`);
}); 