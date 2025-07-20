import {
  addCourse, addTeacher, addRoom
} from './database.js';

// Sample courses
const sampleCourses = [
  {
    name: 'Advanced Mathematics',
    code: 'MATH101',
    credits: 3,
    department: 'Mathematics',
    description: 'Advanced mathematical concepts and applications'
  },
  {
    name: 'Computer Science Fundamentals',
    code: 'CS101',
    credits: 4,
    department: 'Computer Science',
    description: 'Introduction to programming and computer science'
  },
  {
    name: 'Physics Lab',
    code: 'PHYS201',
    credits: 2,
    department: 'Physics',
    description: 'Hands-on physics laboratory experiments'
  },
  {
    name: 'English Literature',
    code: 'ENG101',
    credits: 3,
    department: 'English',
    description: 'Study of classic and contemporary literature'
  }
];

// Sample teachers
const sampleTeachers = [
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@school.edu',
    phone: '+1 (555) 123-4567',
    department: 'Mathematics',
    subjects: ['Advanced Mathematics', 'Calculus', 'Statistics'],
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
  },
  {
    name: 'Prof. Michael Smith',
    email: 'michael.smith@school.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    subjects: ['Programming', 'Data Structures', 'Algorithms'],
    availability: ['Monday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    name: 'Dr. Emily Davis',
    email: 'emily.davis@school.edu',
    phone: '+1 (555) 345-6789',
    department: 'Physics',
    subjects: ['General Physics', 'Quantum Mechanics', 'Laboratory'],
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  {
    name: 'Prof. John Wilson',
    email: 'john.wilson@school.edu',
    phone: '+1 (555) 456-7890',
    department: 'English',
    subjects: ['English Literature', 'Creative Writing', 'Poetry'],
    availability: ['Monday', 'Tuesday', 'Thursday', 'Friday']
  }
];

// Sample rooms
const sampleRooms = [
  {
    name: 'A-101',
    capacity: 30,
    type: 'Classroom',
    equipment: ['Projector', 'Whiteboard', 'Computer'],
    building: 'Building A'
  },
  {
    name: 'B-201',
    capacity: 25,
    type: 'Computer Lab',
    equipment: ['Computers', 'Projector', 'Whiteboard'],
    building: 'Building B'
  },
  {
    name: 'Lab-301',
    capacity: 20,
    type: 'Laboratory',
    equipment: ['Lab Equipment', 'Safety Gear', 'Computers'],
    building: 'Science Building'
  },
  {
    name: 'C-105',
    capacity: 35,
    type: 'Seminar Room',
    equipment: ['Projector', 'Whiteboard', 'Audio System'],
    building: 'Building C'
  }
];

// Function to seed the database
const seedDatabase = () => {
  console.log('Seeding database with sample data...');
  
  // Add courses
  sampleCourses.forEach(course => {
    addCourse(course);
    console.log(`Added course: ${course.name}`);
  });
  
  // Add teachers
  sampleTeachers.forEach(teacher => {
    addTeacher(teacher);
    console.log(`Added teacher: ${teacher.name}`);
  });
  
  // Add rooms
  sampleRooms.forEach(room => {
    addRoom(room);
    console.log(`Added room: ${room.name}`);
  });
  
  console.log('Database seeding completed!');
  console.log('You can now generate a timetable using the available courses, teachers, and rooms.');
};

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase }; 