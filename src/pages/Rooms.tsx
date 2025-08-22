import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, MapPin, Users, Monitor } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  number: string;
  capacity: number;
  type: 'classroom' | 'laboratory' | 'auditorium' | 'seminar';
  building: string;
  floor: number;
  equipment: string[];
  availability: boolean;
}

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    capacity: 0,
    type: 'classroom' as Room['type'],
    building: '',
    floor: 1,
    equipment: [] as string[],
    availability: true
  });

  const roomTypes = [
    { value: 'classroom', label: 'Classroom', color: 'bg-blue-100 text-blue-800' },
    { value: 'laboratory', label: 'Laboratory', color: 'bg-purple-100 text-purple-800' },
    { value: 'auditorium', label: 'Auditorium', color: 'bg-green-100 text-green-800' },
    { value: 'seminar', label: 'Seminar Room', color: 'bg-orange-100 text-orange-800' }
  ];

  const commonEquipment = [
    'Projector', 'Whiteboard', 'Audio System', 'AC', 'Internet',
    'Computers', 'Lab Equipment', 'Safety Gear', 'Conference Table',
    'Storage', 'Fume Hood', 'Smart Board', 'Microphone'
  ];

  // API functions
  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/rooms');
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const addRoomAPI = async (roomData: Omit<Room, 'id'>) => {
    try {
      const response = await fetch('http://localhost:5001/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
      if (!response.ok) throw new Error('Failed to add room');
      const newRoom = await response.json();
      setRooms(prev => [...prev, newRoom]);
      return newRoom;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add room');
      throw err;
    }
  };

  const updateRoomAPI = async (id: string, roomData: Partial<Room>) => {
    try {
      const response = await fetch(`http://localhost:5001/api/rooms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
      if (!response.ok) throw new Error('Failed to update room');
      const updated = await response.json();
      setRooms(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update room');
      throw err;
    }
  };

  const deleteRoomAPI = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/api/rooms/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete room');
      setRooms(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
      throw err;
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.building.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await updateRoomAPI(editingRoom.id, formData);
      } else {
        await addRoomAPI(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save room:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      capacity: 0,
      type: 'classroom',
      building: '',
      floor: 1,
      equipment: [],
      availability: true
    });
    setEditingRoom(null);
    setShowModal(false);
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      number: room.number,
      capacity: room.capacity,
      type: room.type,
      building: room.building,
      floor: room.floor,
      equipment: room.equipment,
      availability: room.availability
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRoomAPI(id);
    } catch (error) {
      console.error('Failed to delete room:', error);
    }
  };

  const handleEquipmentChange = (equipment: string) => {
    const equipmentList = formData.equipment.includes(equipment)
      ? formData.equipment.filter(e => e !== equipment)
      : [...formData.equipment, equipment];
    setFormData({...formData, equipment: equipmentList});
  };

  const getTypeConfig = (type: Room['type']) => {
    return roomTypes.find(t => t.value === type) || roomTypes[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-600">Manage classroom and facility information</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 sm:mt-0 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Room</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading rooms...</p>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const typeConfig = getTypeConfig(room.type);
          return (
            <div key={room.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-500">{room.number}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`h-3 w-3 rounded-full ${room.availability ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(room)}
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs rounded-full ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity}</span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Building:</span>
                  <span className="font-medium">{room.building}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Floor:</span>
                  <span className="font-medium">{room.floor}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Monitor className="h-4 w-4 mr-1" />
                    Equipment:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {room.equipment.slice(0, 3).map((item) => (
                      <span key={item} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {item}
                      </span>
                    ))}
                    {room.equipment.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{room.equipment.length - 3} more
                      </span>
                    )}
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                    <input
                      type="text"
                      required
                      value={formData.number}
                      onChange={(e) => setFormData({...formData, number: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as Room['type']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {roomTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="20"
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
                  <input
                    type="text"
                    required
                    value={formData.building}
                    onChange={(e) => setFormData({...formData, building: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                    {commonEquipment.map((equipment) => (
                      <label key={equipment} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.equipment.includes(equipment)}
                          onChange={() => handleEquipmentChange(equipment)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">{equipment}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.availability}
                      onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Available for scheduling</span>
                  </label>
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
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    {editingRoom ? 'Update' : 'Add'} Room
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

export default Rooms;