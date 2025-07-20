import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users, Clock, MapPin, Calendar, MessageCircle, TrendingUp, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Courses', value: '24', icon: BookOpen, color: 'text-blue-600 bg-blue-100' },
    { name: 'Teachers', value: '12', icon: Users, color: 'text-green-600 bg-green-100' },
    { name: 'Time Slots', value: '48', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
    { name: 'Rooms', value: '8', icon: MapPin, color: 'text-purple-600 bg-purple-100' },
  ];

  const quickActions = [
    { name: 'Add New Course', href: '/courses', icon: BookOpen, color: 'bg-blue-600 hover:bg-blue-700' },
    { name: 'Manage Teachers', href: '/teachers', icon: Users, color: 'bg-green-600 hover:bg-green-700' },
    { name: 'View Timetable', href: '/timetable', icon: Calendar, color: 'bg-purple-600 hover:bg-purple-700' },
    { name: 'AI Assistant', href: '/chatbot', icon: MessageCircle, color: 'bg-orange-600 hover:bg-orange-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-blue-100">Manage your academic schedule with AI-powered intelligence</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <NavLink
              key={action.name}
              to={action.href}
              className={`${action.color} text-white p-4 rounded-lg transition-colors duration-200 text-center block`}
            >
              <action.icon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">{action.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">New course "Advanced Mathematics" added</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Teacher "Dr. Smith" updated availability</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Room "Lab 101" capacity updated</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">AI Insights</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Optimization Suggestion</p>
                <p className="text-sm text-gray-600">Move "Physics Lab" to afternoon for better resource utilization</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Conflict Detected</p>
                <p className="text-sm text-gray-600">Dr. Johnson has overlapping assignments on Monday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;