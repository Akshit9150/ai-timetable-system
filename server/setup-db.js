import fs from 'fs';
import path from 'path';

// Create data directory
const dataDir = path.join(process.cwd(), 'server', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('Created data directory:', dataDir);
}

// Sample data
const sampleData = {
  courses: [
    {
      id: '1',
      name: 'Advanced Mathematics',
      code: 'MATH101',
      credits: 3,
      department: 'Mathematics',
      description: 'Advanced mathematical concepts and applications'
    },
    {
      id: '2',
      name: 'Computer Science Fundamentals',
      code: 'CS101',
      credits: 4,
      department: 'Computer Science',
      description: 'Introduction to programming and computer science'
    },
    {
      id: '3',
      name: 'Physics Lab',
      code: 'PHYS201',
      credits: 2,
      department: 'Physics',
      description: 'Hands-on physics laboratory experiments'
    },
    {
      id: '4',
      name: 'English Literature',
      code: 'ENG101',
      credits: 3,
      department: 'English',
      description: 'Study of classic and contemporary literature'
    }
  ],
  teachers: [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@school.edu',
      phone: '+1 (555) 123-4567',
      department: 'Mathematics',
      subjects: ['Advanced Mathematics', 'Calculus', 'Statistics'],
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday']
    },
    {
      id: '2',
      name: 'Prof. Michael Smith',
      email: 'michael.smith@school.edu',
      phone: '+1 (555) 234-5678',
      department: 'Computer Science',
      subjects: ['Programming', 'Data Structures', 'Algorithms'],
      availability: ['Monday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      email: 'emily.davis@school.edu',
      phone: '+1 (555) 345-6789',
      department: 'Physics',
      subjects: ['General Physics', 'Quantum Mechanics', 'Laboratory'],
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '4',
      name: 'Prof. John Wilson',
      email: 'john.wilson@school.edu',
      phone: '+1 (555) 456-7890',
      department: 'English',
      subjects: ['English Literature', 'Creative Writing', 'Poetry'],
      availability: ['Monday', 'Tuesday', 'Thursday', 'Friday']
    }
  ],
  rooms: [
    {
      id: '1',
      name: 'A-101',
      capacity: 30,
      type: 'Classroom',
      equipment: ['Projector', 'Whiteboard', 'Computer'],
      building: 'Building A'
    },
    {
      id: '2',
      name: 'B-201',
      capacity: 25,
      type: 'Computer Lab',
      equipment: ['Computers', 'Projector', 'Whiteboard'],
      building: 'Building B'
    },
    {
      id: '3',
      name: 'Lab-301',
      capacity: 20,
      type: 'Laboratory',
      equipment: ['Lab Equipment', 'Safety Gear', 'Computers'],
      building: 'Science Building'
    },
    {
      id: '4',
      name: 'C-105',
      capacity: 35,
      type: 'Seminar Room',
      equipment: ['Projector', 'Whiteboard', 'Audio System'],
      building: 'Building C'
    }
  ],
  timings: [
    {
      id: '1',
      name: 'Morning Lecture 1',
      startTime: '08:00',
      endTime: '09:30',
      duration: 90,
      type: 'lecture',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '2',
      name: 'Morning Break',
      startTime: '09:30',
      endTime: '09:45',
      duration: 15,
      type: 'break',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '3',
      name: 'Morning Lecture 2',
      startTime: '09:45',
      endTime: '11:15',
      duration: 90,
      type: 'lecture',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '4',
      name: 'Lunch Break',
      startTime: '12:00',
      endTime: '13:00',
      duration: 60,
      type: 'lunch',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    {
      id: '5',
      name: 'Afternoon Lab',
      startTime: '14:00',
      endTime: '17:00',
      duration: 180,
      type: 'lab',
      days: ['Tuesday', 'Thursday']
    }
  ],
  timetable: []
};

// Write sample data to files
Object.entries(sampleData).forEach(([key, data]) => {
  const filePath = path.join(dataDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Created ${key}.json with ${data.length} entries`);
});

console.log('\n✅ Database setup completed!');
console.log('📁 Data files created in:', dataDir);
console.log('🚀 You can now run: npm run dev'); 