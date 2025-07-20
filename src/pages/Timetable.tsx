import React, { useState, useRef } from 'react';
import { Calendar, Download, RefreshCw, Filter, Clock, MapPin, User } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface TimetableEntry {
  id: string;
  course: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  day: string;
  type: 'lecture' | 'lab' | 'seminar';
}

const Timetable: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [timings, setTimings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const timetableRef = useRef<HTMLDivElement>(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load timings data
  const loadTimings = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/timings');
      const data = await response.json();
      setTimings(data);
    } catch (error) {
      console.error('Failed to load timings:', error);
    }
  };

  // Get unique time slots from timings
  const getTimeSlots = () => {
    const slots = new Set<string>();
    timings.forEach(timing => {
      if (timing.type === 'lecture' || timing.type === 'lab') {
        slots.add(timing.startTime);
      }
    });
    return Array.from(slots).sort();
  };

  const generateTimetable = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/generate-timetable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.timetable) {
        setTimetable(data.timetable);
        alert('Timetable generated successfully!');
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error('Failed to generate timetable:', error);
      alert('Failed to generate timetable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load timetable and timings data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [timetableResponse, timingsResponse] = await Promise.all([
          fetch('http://localhost:5001/api/timetable'),
          fetch('http://localhost:5001/api/timings')
        ]);
        
        const timetableData = await timetableResponse.json();
        const timingsData = await timingsResponse.json();
        
        if (timetableData && timetableData.length > 0) {
          setTimetable(timetableData);
        }
        setTimings(timingsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const exportTimetable = async () => {
    if (!timetableRef.current) return;
    
    try {
      const canvas = await html2canvas(timetableRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('timetable.pdf');
    } catch (error) {
      console.error('Failed to export timetable:', error);
      alert('Failed to export timetable. Please try again.');
    }
  };

  const getTimetableForDay = (day: string) => {
    return timetable.filter(entry => entry.day === day);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800';
      case 'lab': return 'bg-green-100 text-green-800';
      case 'seminar': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">View and manage class schedules</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={generateTimetable}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Generating...' : 'Generate'}</span>
          </button>
          <button
            onClick={exportTimetable}
            disabled={timetable.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <div>
            <p className="font-medium">Timetable Generation Tip</p>
            <p className="text-sm">Add time slots in the <strong>Timings</strong> page to customize your schedule periods. The timetable generator will use these time slots.</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current">Current Week</option>
                <option value="next">Next Week</option>
                <option value="previous">Previous Week</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as 'weekly' | 'daily')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            {viewMode === 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {days.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">Filter options coming soon</span>
          </div>
        </div>
      </div>

      {/* Timetable Display */}
      <div ref={timetableRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading timetable...</p>
          </div>
        ) : getTimeSlots().length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Time Slots Defined</h3>
            <p className="text-gray-600 mb-4">Please add time slots in the Timings page to view the timetable.</p>
            <button
              onClick={loadTimings}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Refresh
            </button>
          </div>
        ) : viewMode === 'weekly' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getTimeSlots().map((timeSlot: string) => (
                  <tr key={timeSlot}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r bg-gray-50">
                      {timeSlot}
                    </td>
                    {days.map(day => {
                      const entries = timetable.filter(entry => 
                        entry.day === day && 
                        entry.startTime === timeSlot
                      );
                      return (
                        <td key={day} className="px-4 py-3 border-r">
                          {entries.map(entry => (
                            <div key={entry.id} className="mb-2 p-2 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                              <div className="font-medium text-sm text-gray-900">{entry.course}</div>
                              <div className="text-xs text-gray-600 flex items-center mt-1">
                                <User className="h-3 w-3 mr-1" />
                                {entry.teacher}
                              </div>
                              <div className="text-xs text-gray-600 flex items-center mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {entry.room}
                              </div>
                              <div className="text-xs text-gray-600 flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {entry.startTime} - {entry.endTime}
                              </div>
                              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${getTypeColor(entry.type)}`}>
                                {entry.type}
                              </span>
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{selectedDay} Schedule</h3>
            <div className="space-y-4">
              {getTimetableForDay(selectedDay).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No classes scheduled for {selectedDay}</p>
              ) : (
                getTimetableForDay(selectedDay)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime))
                  .map(entry => (
                    <div key={entry.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0 w-16 text-center">
                        <div className="text-sm font-medium text-gray-900">{entry.startTime}</div>
                        <div className="text-xs text-gray-500">{entry.endTime}</div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{entry.course}</h4>
                            <p className="text-sm text-gray-600">{entry.teacher}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{entry.room}</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(entry.type)}`}>
                              {entry.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timetable;