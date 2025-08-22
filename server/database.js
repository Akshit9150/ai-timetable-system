import fs from 'fs';
import path from 'path';

const DB_DIR = path.join(process.cwd(), 'server', 'data');
const COURSES_FILE = path.join(DB_DIR, 'courses.json');
const TEACHERS_FILE = path.join(DB_DIR, 'teachers.json');
const ROOMS_FILE = path.join(DB_DIR, 'rooms.json');
const TIMETABLE_FILE = path.join(DB_DIR, 'timetable.json');
const TIMINGS_FILE = path.join(DB_DIR, 'timings.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
const initializeFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

// Initialize all database files
initializeFile(COURSES_FILE, []);
initializeFile(TEACHERS_FILE, []);
initializeFile(ROOMS_FILE, []);
initializeFile(TIMETABLE_FILE, []);
initializeFile(TIMINGS_FILE, []);

// Generic read function
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Generic write function
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Courses operations
export const getCourses = () => readData(COURSES_FILE);
export const addCourse = (course) => {
  const courses = getCourses();
  const newCourse = { ...course, id: Date.now().toString() };
  courses.push(newCourse);
  writeData(COURSES_FILE, courses);
  return newCourse;
};
export const updateCourse = (id, updates) => {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === id);
  if (index !== -1) {
    courses[index] = { ...courses[index], ...updates };
    writeData(COURSES_FILE, courses);
    return courses[index];
  }
  return null;
};
export const deleteCourse = (id) => {
  const courses = getCourses();
  const filtered = courses.filter(c => c.id !== id);
  writeData(COURSES_FILE, filtered);
  return filtered.length !== courses.length;
};

// Teachers operations
export const getTeachers = () => readData(TEACHERS_FILE);
export const addTeacher = (teacher) => {
  const teachers = getTeachers();
  const newTeacher = { ...teacher, id: Date.now().toString() };
  teachers.push(newTeacher);
  writeData(TEACHERS_FILE, teachers);
  return newTeacher;
};
export const updateTeacher = (id, updates) => {
  const teachers = getTeachers();
  const index = teachers.findIndex(t => t.id === id);
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...updates };
    writeData(TEACHERS_FILE, teachers);
    return teachers[index];
  }
  return null;
};
export const deleteTeacher = (id) => {
  const teachers = getTeachers();
  const filtered = teachers.filter(t => t.id !== id);
  writeData(TEACHERS_FILE, filtered);
  return filtered.length !== teachers.length;
};

// Rooms operations
export const getRooms = () => readData(ROOMS_FILE);
export const addRoom = (room) => {
  const rooms = getRooms();
  const newRoom = { ...room, id: Date.now().toString() };
  rooms.push(newRoom);
  writeData(ROOMS_FILE, rooms);
  return newRoom;
};
export const updateRoom = (id, updates) => {
  const rooms = getRooms();
  const index = rooms.findIndex(r => r.id === id);
  if (index !== -1) {
    rooms[index] = { ...rooms[index], ...updates };
    writeData(ROOMS_FILE, rooms);
    return rooms[index];
  }
  return null;
};
export const deleteRoom = (id) => {
  const rooms = getRooms();
  const filtered = rooms.filter(r => r.id !== id);
  writeData(ROOMS_FILE, filtered);
  return filtered.length !== rooms.length;
};

// Timetable operations
export const getTimetable = () => readData(TIMETABLE_FILE);
export const addTimetableEntry = (entry) => {
  const timetable = getTimetable();
  const teachers = getTeachers();
  const rooms = getRooms();
  
  // Check for conflicts
  const conflictingEntry = timetable.find(existing => 
    existing.day === entry.day && 
    existing.startTime === entry.startTime &&
    (existing.teacher === entry.teacher || existing.room === entry.room)
  );
  
  if (conflictingEntry) {
    throw new Error(`Conflict detected: ${conflictingEntry.teacher} or ${conflictingEntry.room} is already scheduled at ${entry.startTime} on ${entry.day}`);
  }
  
  // Check teacher availability
  const teacher = teachers.find(t => t.name === entry.teacher);
  if (teacher && (!teacher.availability || !teacher.availability.includes(entry.day))) {
    throw new Error(`${entry.teacher} is not available on ${entry.day}`);
  }
  
  const newEntry = { ...entry, id: Date.now().toString() };
  timetable.push(newEntry);
  writeData(TIMETABLE_FILE, timetable);
  return newEntry;
};
export const updateTimetableEntry = (id, updates) => {
  const timetable = getTimetable();
  const index = timetable.findIndex(t => t.id === id);
  if (index !== -1) {
    timetable[index] = { ...timetable[index], ...updates };
    writeData(TIMETABLE_FILE, timetable);
    return timetable[index];
  }
  return null;
};
export const deleteTimetableEntry = (id) => {
  const timetable = getTimetable();
  const filtered = timetable.filter(t => t.id !== id);
  writeData(TIMETABLE_FILE, filtered);
  return filtered.length !== timetable.length;
};

// Clear existing timetable
export const clearTimetable = () => {
  writeData(TIMETABLE_FILE, []);
  return true;
};

// Generate timetable using available data
export const generateTimetable = () => {
  // Clear existing timetable first to prevent conflicts
  clearTimetable();
  
  const courses = getCourses();
  const teachers = getTeachers();
  const rooms = getRooms();
  const timings = getTimings();
  
  if (courses.length === 0 || teachers.length === 0 || rooms.length === 0) {
    return {
      success: false,
      message: 'Need at least one course, teacher, and room to generate timetable'
    };
  }

  if (timings.length === 0) {
    return {
      success: false,
      message: 'Please add time slots in the Timings page before generating timetable'
    };
  }

  const generatedTimetable = [];
  
  // Get only lecture and lab timings (skip breaks and lunch)
  const availableTimings = timings.filter(timing => 
    timing.type === 'lecture' || timing.type === 'lab'
  );

  if (availableTimings.length === 0) {
    return {
      success: false,
      message: 'No lecture or lab time slots found. Please add some in the Timings page.'
    };
  }

  // Create a map to track time slot availability (one course per time slot)
  const timeSlotAvailability = {};
  
  // Initialize time slot availability
  availableTimings.forEach(timing => {
    timing.days.forEach(day => {
      const slotKey = `${day}-${timing.startTime}`;
      timeSlotAvailability[slotKey] = {
        day,
        startTime: timing.startTime,
        endTime: timing.endTime,
        type: timing.type,
        duration: timing.duration,
        isOccupied: false,
        course: null,
        teacher: null,
        room: null
      };
    });
  });

  // Create a map to track teacher availability
  const teacherAvailability = {};
  teachers.forEach(teacher => {
    teacherAvailability[teacher.name] = {
      ...teacher,
      scheduledSlots: []
    };
  });

  // Create a map to track room availability
  const roomAvailability = {};
  rooms.forEach(room => {
    roomAvailability[room.name] = {
      ...room,
      scheduledSlots: []
    };
  });

  // Assign courses to available time slots
  courses.forEach((course, courseIndex) => {
    let assigned = false;
    
    // Try to find an available slot for this course
    for (const timing of availableTimings) {
      for (const day of timing.days) {
        const slotKey = `${day}-${timing.startTime}`;
        const slot = timeSlotAvailability[slotKey];
        
        // Skip if this time slot is already occupied
        if (slot.isOccupied) {
          continue;
        }

        // Find available teachers for this day
        const availableTeachers = teachers.filter(teacher => {
          // Check if teacher is available on this day
          if (!teacher.availability || !teacher.availability.includes(day)) {
            return false;
          }
          
          // Check if teacher is not already scheduled at this time
          return !teacherAvailability[teacher.name].scheduledSlots.includes(slotKey);
        });

        // Find available rooms
        const availableRooms = rooms.filter(room => {
          return !roomAvailability[room.name].scheduledSlots.includes(slotKey);
        });

        if (availableTeachers.length > 0 && availableRooms.length > 0) {
          // Assign the course
          const teacher = availableTeachers[0];
          const room = availableRooms[0];

          // Mark time slot as occupied
          slot.isOccupied = true;
          slot.course = course.name;
          slot.teacher = teacher.name;
          slot.room = room.name;

          // Mark teacher and room as scheduled
          teacherAvailability[teacher.name].scheduledSlots.push(slotKey);
          roomAvailability[room.name].scheduledSlots.push(slotKey);

          generatedTimetable.push({
            id: Date.now().toString() + courseIndex,
            course: course.name,
            teacher: teacher.name,
            room: room.name,
            startTime: timing.startTime,
            endTime: timing.endTime,
            day: day,
            type: timing.type,
            duration: timing.duration
          });

          assigned = true;
          break;
        }
      }
      if (assigned) break;
    }

    // SAFER FALLBACK: Try any free slot while STILL respecting teacher availability and existing bookings
    if (!assigned) {
      for (const slotKey in timeSlotAvailability) {
        const slot = timeSlotAvailability[slotKey];
        if (slot.isOccupied) continue;

        // Find a teacher available on slot.day and not scheduled at this slot
        const candidateTeacher = teachers.find(t => 
          t.availability && t.availability.includes(slot.day) &&
          !teacherAvailability[t.name].scheduledSlots.includes(slotKey)
        );

        if (!candidateTeacher) continue;

        // Find a room not scheduled at this slot
        const candidateRoom = rooms.find(r => 
          !roomAvailability[r.name].scheduledSlots.includes(slotKey)
        );

        if (!candidateRoom) continue;

        // Assign and mark as scheduled
        slot.isOccupied = true;
        slot.course = course.name;
        slot.teacher = candidateTeacher.name;
        slot.room = candidateRoom.name;

        teacherAvailability[candidateTeacher.name].scheduledSlots.push(slotKey);
        roomAvailability[candidateRoom.name].scheduledSlots.push(slotKey);

        generatedTimetable.push({
          id: Date.now().toString() + courseIndex,
          course: course.name,
          teacher: candidateTeacher.name,
          room: candidateRoom.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          day: slot.day,
          type: slot.type,
          duration: slot.duration
        });

        assigned = true;
        break;
      }
    }
  });

  // Save generated timetable
  writeData(TIMETABLE_FILE, generatedTimetable);

  return {
    success: true,
    timetable: generatedTimetable,
    message: `Timetable generated successfully! Assigned ${generatedTimetable.length} courses with no time conflicts.`
  };
};

// Timings operations
export const getTimings = () => readData(TIMINGS_FILE);
export const addTiming = (timing) => {
  const timings = getTimings();
  const newTiming = { ...timing, id: Date.now().toString() };
  timings.push(newTiming);
  writeData(TIMINGS_FILE, timings);
  return newTiming;
};
export const updateTiming = (id, updates) => {
  const timings = getTimings();
  const index = timings.findIndex(t => t.id === id);
  if (index !== -1) {
    timings[index] = { ...timings[index], ...updates };
    writeData(TIMINGS_FILE, timings);
    return timings[index];
  }
  return null;
};
export const deleteTiming = (id) => {
  const timings = getTimings();
  const filtered = timings.filter(t => t.id !== id);
  writeData(TIMINGS_FILE, filtered);
  return filtered.length !== timings.length;
};

// Get available slots for scheduling
export const getAvailableSlots = () => {
  const timings = getTimings();
  const timetable = getTimetable();
  const teachers = getTeachers();
  const rooms = getRooms();
  
  const availableSlots = [];
  
  // Get only lecture and lab timings
  const availableTimings = timings.filter(timing => 
    timing.type === 'lecture' || timing.type === 'lab'
  );
  
  availableTimings.forEach(timing => {
    timing.days.forEach(day => {
      // Check if this slot is already occupied
      const occupiedSlot = timetable.find(entry => 
        entry.day === day && entry.startTime === timing.startTime
      );
      
      if (!occupiedSlot) {
        // Find available teachers for this day
        const availableTeachers = teachers.filter(teacher => 
          teacher.availability && teacher.availability.includes(day)
        );
        
        // Find available rooms
        const availableRooms = rooms.filter(room => {
          const roomOccupied = timetable.find(entry => 
            entry.day === day && 
            entry.startTime === timing.startTime && 
            entry.room === room.name
          );
          return !roomOccupied;
        });
        
        availableSlots.push({
          day,
          startTime: timing.startTime,
          endTime: timing.endTime,
          duration: timing.duration,
          type: timing.type,
          availableTeachers: availableTeachers.map(t => t.name),
          availableRooms: availableRooms.map(r => r.name)
        });
      }
    });
  });
  
  return availableSlots;
}; 