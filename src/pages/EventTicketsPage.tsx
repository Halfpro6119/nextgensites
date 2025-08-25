import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  CheckCircle, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalTickets: number;
  soldTickets: number;
  description: string;
  category?: string;
  featured?: boolean;
  status: 'active' | 'draft' | 'cancelled';
}

interface BookingData {
  eventId: string;
  name: string;
  email: string;
  phone: string;
  tickets: number;
}

// Mock data - in real implementation, this would come from Supabase
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'HMO Property Investment Masterclass',
    date: '2025-02-15',
    time: '10:00',
    location: 'London Conference Centre',
    price: 297,
    totalTickets: 50,
    soldTickets: 23,
    description: 'Learn the fundamentals of HMO property investment, from finding deals to managing tenants.',
    category: 'Investment',
    featured: true,
    status: 'active'
  },
  {
    id: '2',
    title: 'Property Development Workshop',
    date: '2025-02-28',
    time: '09:30',
    location: 'Manchester Business Hub',
    price: 497,
    totalTickets: 30,
    soldTickets: 30,
    description: 'Advanced strategies for property development, planning permissions, and maximizing ROI.',
    category: 'Development',
    featured: false,
    status: 'active'
  },
  {
    id: '3',
    title: 'Buy-to-Let Success Seminar',
    date: '2025-03-10',
    time: '14:00',
    location: 'Birmingham Convention Centre',
    price: 197,
    totalTickets: 75,
    soldTickets: 12,
    description: 'Everything you need to know about buy-to-let property investment in today\'s market.',
    category: 'Investment',
    featured: false,
    status: 'active'
  }
];

function EventCard({ event, onBook }: { event: Event; onBook: (eventId: string) => void }) {
  const remainingTickets = event.totalTickets - event.soldTickets;
  const isSoldOut = remainingTickets <= 0;
  const isAlmostSoldOut = remainingTickets <= 5 && remainingTickets > 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (event.status === 'draft') return null;

  return (
    <div className={`bg-gray-800/50 backdrop-blur-lg border rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-purple-500/10 ${
      event.featured ? 'border-yellow-500/50 shadow-lg shadow-yellow-500/10' : 'border-gray-700'
    }`}>
      {event.featured && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 text-sm font-medium">
          ⭐ Featured Event
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
              {event.category && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  {event.category}
                </span>
              )}
            </div>
            {event.status === 'cancelled' && (
              <div className="text-red-400 text-sm font-medium mb-2">❌ Cancelled</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">£{event.price}</div>
            <div className="text-sm text-gray-400">per person</div>
          </div>
        </div>

        <p className="text-gray-300 mb-6 leading-relaxed">{event.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span className="font-medium">{formatDate(event.date)} at {event.time}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-5 h-5 text-purple-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Users className="w-5 h-5 text-purple-400" />
            <span>
              {isSoldOut ? (
                <span className="text-red-600 font-medium">Sold Out</span>
              ) : (
                <>
                  <span className={isAlmostSoldOut ? 'text-orange-400 font-medium' : ''}>
                    {remainingTickets} tickets remaining
                  </span>
                  {isAlmostSoldOut && <span className="text-orange-400 ml-1">- Almost sold out!</span>}
                </>
              )}
            </span>
          </div>
        </div>

        <button
          onClick={() => onBook(event.id)}
          disabled={isSoldOut || event.status === 'cancelled'}
          className={`w-full py-4 px-6 rounded-full font-semibold text-lg transition-all duration-300 ${
            isSoldOut || event.status === 'cancelled'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]'
          }`}
        >
          {event.status === 'cancelled' ? 'Event Cancelled' : isSoldOut ? 'Sold Out' : 'Book Now'}
        </button>
      </div>
    </div>
  );
}

function BookingModal({ event, isOpen, onClose, onConfirm }: {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (booking: BookingData) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tickets: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      onConfirm({
        eventId: event.id,
        ...formData
      });
    }
  };

  if (!isOpen || !event) return null;

  const remainingTickets = event.totalTickets - event.soldTickets;
  const maxTickets = Math.min(remainingTickets, 5);
  const totalPrice = formData.tickets * event.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-white">Book Your Tickets</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
          <h4 className="font-semibold text-white mb-1">{event.title}</h4>
          <p className="text-sm text-gray-300">
            {new Date(event.date).toLocaleDateString('en-GB')} at {event.time}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Tickets</label>
            <select
              value={formData.tickets}
              onChange={(e) => setFormData({ ...formData, tickets: parseInt(e.target.value) })}
              className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {Array.from({ length: maxTickets }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>{num} ticket{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-white">Total:</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">£{totalPrice}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] flex items-center justify-center gap-2"
          >
            <CreditCard className="w-5 h-5" />
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}

function ConfirmationModal({ isOpen, onClose, booking }: {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingData | null;
}) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        
        <h3 className="text-2xl font-bold text-white mb-4">Booking Confirmed!</h3>
        
        <p className="text-gray-300 mb-6">
          Thank you, {booking.name}! Your booking has been confirmed. 
          You'll receive a confirmation email shortly with all the details.
        </p>

        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-400">
            <strong>Tickets:</strong> {booking.tickets}<br />
            <strong>Email:</strong> {booking.email}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function EnhancedAdminPanel({ events, onUpdateEvents }: {
  events: Event[];
  onUpdateEvents: (events: Event[]) => void;
}) {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Event>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const resetForm = () => {
    setEditForm({
      title: '',
      date: '',
      time: '10:00',
      location: '',
      price: 0,
      totalTickets: 50,
      soldTickets: 0,
      description: '',
      category: '',
      featured: false,
      status: 'active'
    });
  };

  const handleEdit = (event: Event) => {
    setIsEditing(event.id);
    setEditForm(event);
  };

  const handleSave = () => {
    if (isEditing && editForm) {
      const updatedEvents = events.map(event =>
        event.id === isEditing ? { ...event, ...editForm } : event
      );
      onUpdateEvents(updatedEvents);
      setIsEditing(null);
      setEditForm({});
    }
  };

  const handleAdd = () => {
    if (editForm.title && editForm.date && editForm.price !== undefined && editForm.totalTickets) {
      const newEvent: Event = {
        id: Date.now().toString(),
        title: editForm.title,
        date: editForm.date,
        time: editForm.time || '10:00',
        location: editForm.location || '',
        price: editForm.price,
        totalTickets: editForm.totalTickets,
        soldTickets: editForm.soldTickets || 0,
        description: editForm.description || '',
        category: editForm.category || '',
        featured: editForm.featured || false,
        status: editForm.status || 'active'
      };
      onUpdateEvents([...events, newEvent]);
      setShowAddForm(false);
      resetForm();
    }
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      onUpdateEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleDuplicate = (event: Event) => {
    const duplicatedEvent: Event = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
      soldTickets: 0,
      status: 'draft'
    };
    onUpdateEvents([...events, duplicatedEvent]);
  };

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.status === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-500/20';
      case 'draft': return 'text-yellow-400 bg-yellow-500/20';
      case 'cancelled': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="w-6 h-6 text-purple-400" />
          <h3 className="text-2xl font-bold text-white">Event Management Dashboard</h3>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true);
            resetForm();
          }}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Create New Event
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{events.length}</div>
          <div className="text-gray-400 text-sm">Total Events</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{events.filter(e => e.status === 'active').length}</div>
          <div className="text-gray-400 text-sm">Active Events</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{events.filter(e => e.status === 'draft').length}</div>
          <div className="text-gray-400 text-sm">Draft Events</div>
        </div>
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{events.reduce((sum, e) => sum + e.soldTickets, 0)}</div>
          <div className="text-gray-400 text-sm">Total Tickets Sold</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events by title, location, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Events</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Event
            </h4>
            <button
              onClick={() => { setShowAddForm(false); resetForm(); }}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Title *</label>
              <input
                type="text"
                placeholder="Enter event title"
                value={editForm.title || ''}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <input
                type="text"
                placeholder="e.g., Investment, Development"
                value={editForm.category || ''}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date *</label>
              <input
                type="date"
                value={editForm.date || ''}
                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Time *</label>
              <input
                type="time"
                value={editForm.time || ''}
                onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
              <input
                type="text"
                placeholder="Event location"
                value={editForm.location || ''}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Price (£) *</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                step="1"
                value={editForm.price || ''}
                onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Total Tickets *</label>
              <input
                type="number"
                placeholder="50"
                min="1"
                value={editForm.totalTickets || ''}
                onChange={(e) => setEditForm({ ...editForm, totalTickets: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sold Tickets</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                value={editForm.soldTickets || ''}
                onChange={(e) => setEditForm({ ...editForm, soldTickets: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <select
                value={editForm.status || 'active'}
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Event['status'] })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <textarea
              placeholder="Event description..."
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={editForm.featured || false}
                onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
              />
              Featured Event
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
            >
              <Save className="w-4 h-4" />
              Create Event
            </button>
            <button
              onClick={() => { setShowAddForm(false); resetForm(); }}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No events found</h3>
            <p className="text-gray-400">
              {searchTerm ? 'Try adjusting your search terms.' : 'Create your first event to get started.'}
            </p>
          </div>
        ) : (
          filteredEvents.map(event => (
            <div key={event.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
              {isEditing === event.id ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                      <input
                        type="text"
                        value={editForm.category || ''}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                      <input
                        type="date"
                        value={editForm.date || ''}
                        onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                      <input
                        type="time"
                        value={editForm.time || ''}
                        onChange={(e) => setEditForm({ ...editForm, time: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Price (£)</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({ ...editForm, price: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Total Tickets</label>
                      <input
                        type="number"
                        min="1"
                        value={editForm.totalTickets || ''}
                        onChange={(e) => setEditForm({ ...editForm, totalTickets: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Sold Tickets</label>
                      <input
                        type="number"
                        min="0"
                        value={editForm.soldTickets || ''}
                        onChange={(e) => setEditForm({ ...editForm, soldTickets: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <select
                        value={editForm.status || 'active'}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as Event['status'] })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2 text-gray-300">
                      <input
                        type="checkbox"
                        checked={editForm.featured || false}
                        onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                      Featured Event
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => { setIsEditing(null); setEditForm({}); }}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                      {event.featured && <span className="text-yellow-400">⭐</span>}
                      {event.category && (
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                          {event.category}
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        £{event.price}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {event.soldTickets}/{event.totalTickets} sold
                      </div>
                    </div>
                    {event.description && (
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{event.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleDuplicate(event)}
                      className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                      title="Duplicate event"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                      title="Edit event"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function EventTicketsPage() {
  const { slug } = useParams();
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingData | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  // Only show this page for the specific slug
  if (slug !== 'icon-living') {
    return <Navigate to="/" replace />;
  }

  const handleBook = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setShowBookingModal(true);
    }
  };

  const handleConfirmBooking = (booking: BookingData) => {
    // Mock payment processing
    setTimeout(() => {
      // Update sold tickets
      setEvents(prev => prev.map(event =>
        event.id === booking.eventId
          ? { ...event, soldTickets: event.soldTickets + booking.tickets }
          : event
      ));

      setLastBooking(booking);
      setShowBookingModal(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const activeEvents = events.filter(event => event.status === 'active');

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      {/* Personalized Intro Section for Jamie */}
      <div className="relative z-10 mb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Hi Jamie — here's that ticket system I mocked up for you.
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                I designed this to give you a clean, simple way to sell course spots directly from your own site — no Eventbrite needed. 
                You can easily set your own prices, update event details, and accept payments via PayPal. 
                Let me know if this feels like the right direction.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-6">
            📅 Upcoming Property Training Events
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Join our expert-led property training sessions and accelerate your investment journey
          </p>
          
          {/* Admin Toggle */}
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg transform hover:scale-105 ${
              showAdmin 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
            }`}
          >
            {showAdmin ? '🔒 Hide Admin Panel' : '⚙️ Show Admin Panel'}
          </button>
        </div>

        {/* Enhanced Admin Panel */}
        {showAdmin && (
          <EnhancedAdminPanel events={events} onUpdateEvents={setEvents} />
        )}

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {activeEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onBook={handleBook}
            />
          ))}
        </div>

        {activeEvents.length === 0 && !showAdmin && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Available</h3>
            <p className="text-gray-400">Check back soon for upcoming training events.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        event={selectedEvent}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        booking={lastBooking}
      />
    </div>
  );
}

export default EventTicketsPage;