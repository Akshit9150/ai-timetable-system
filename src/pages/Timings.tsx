import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';

interface TimeSlot {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'lecture' | 'lab' | 'break' | 'lunch';
  days: string[];
}

const Timings: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    startTime: '',
    endTime: '',
    type: 'lecture' as TimeSlot['type'],
    days: [] as string[]
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const slotTypes = [
    { value: 'lecture', label: 'Lecture', color: 'bg-blue-100 text-blue-800' },
    { value: 'lab', label: 'Laboratory', color: 'bg-purple-100 text-purple-800' },
    { value: 'break', label: 'Break', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'lunch', label: 'Lunch', color: 'bg-green-100 text-green-800' }
  ];

  // API functions
  const fetchTimings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/timings');
      if (!response.ok) throw new Error('Failed to fetch timings');
      const data = await response.json();
      setTimeSlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timings');
    } finally {
      setLoading(false);
    }
  };

  const addTimingAPI = async (timingData: Omit<TimeSlot, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5001/api/timings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timingData)
      });
      if (!response.ok) throw new Error('Failed to add timing');
      const newTiming = await response.json();
      setTimeSlots(prev => [...prev, newTiming]);
      return newTiming;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add timing');
      throw err;
    }
  };

  const updateTimingAPI = async (id: string, timingData: Partial<TimeSlot>) => {
    try {
      const response = await fetch(`http://localhost:5001/api/timings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timingData)
      });
      if (!response.ok) throw new Error('Failed to update timing');
      const updatedTiming = await response.json();
      setTimeSlots(prev => prev.map(t => t.id === id ? updatedTiming : t));
      return updatedTiming;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update timing');
      throw err;
    }
  };

  const deleteTimingAPI = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/timings/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete timing');
      setTimeSlots(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete timing');
      throw err;
    }
  };

  // Load timings on component mount
  useEffect(() => {
    fetchTimings();
  }, []);

  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const duration = calculateDuration(formData.startTime, formData.endTime);
    
    try {
      if (editingSlot) {
        await updateTimingAPI(editingSlot.id, { ...formData, duration });
      } else {
        await addTimingAPI({ ...formData, duration });
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save timing:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      startTime: '',
      endTime: '',
      type: 'lecture',
      days: []
    });
    setEditingSlot(null);
    setShowModal(false);
  };

  const handleEdit = (slot: TimeSlot) => {
    setEditingSlot(slot);
    setFormData({
      name: slot.name,
      startTime: slot.startTime,
      endTime: slot.endTime,
      type: slot.type,
      days: slot.days
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleDayChange = (day: string) => {
    const days = formData.days.includes(day)
      ? formData.days.filter(d => d !== day)
      : [...formData.days, day];
    setFormData({...formData, days});
  };

  const getTypeConfig = (type: TimeSlot['type']) => {
    return slotTypes.find(t => t.value === type) || slotTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Slots</h1>
          <p className="text-gray-600">Manage class timings and schedule periods</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Time Slot</span>
        </button>
      </div>

      {/* Time Slots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {timeSlots.map((slot) => {
          const typeConfig = getTypeConfig(slot.type);
          return (
            <div key={slot.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{slot.name}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                      {typeConfig.label}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(slot)}
                    className="p-1 text-gray-400 hover:text-yellow-600 transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(slot.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Start Time:</span>
                  <span className="font-medium">{slot.startTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">End Time:</span>
                  <span className="font-medium">{slot.endTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{slot.duration} minutes</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Days:</p>
                  <div className="flex flex-wrap gap-1">
                    {slot.days.map((day) => (
                      <span key={day} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {day.slice(0, 3)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={resetForm}></div>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSlot ? 'Edit Time Slot' : 'Add New Time Slot'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as TimeSlot['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {slotTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekDays.map((day) => (
                      <label key={day} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.days.includes(day)}
                          onChange={() => handleDayChange(day)}
                          className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                  >
                    {editingSlot ? 'Update' : 'Add'} Time Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timings;