import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  MessageCircle, 
  Clock, 
  User, 
  Building, 
  Phone, 
  ExternalLink,
  CheckCircle,
  Circle,
  Filter,
  Search,
  Calendar,
  ArrowUpDown,
  Eye,
  EyeOff,
  Trash2,
  Archive
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { 
  getContactRequests, 
  getNextStepsQuestions, 
  updateContactRequestReadStatus,
  updateNextStepsQuestionReadStatus,
  ContactRequest,
  NextStepsQuestion 
} from '../lib/supabase';

type MessageType = 'contact' | 'next_steps';
type FilterType = 'all' | 'unread' | 'read';
type SortType = 'newest' | 'oldest' | 'priority';

interface CombinedMessage {
  id: string;
  type: MessageType;
  slug: string;
  message: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  priority?: string;
  source_page?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

function InboxPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<CombinedMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<CombinedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Check if user is authorized
  const isAuthorized = user?.email === 'rilrogsa@gmail.com';

  useEffect(() => {
    if (!loading && !isAuthorized) {
      navigate('/');
      return;
    }

    if (isAuthorized) {
      fetchMessages();
    }
  }, [user, loading, isAuthorized, navigate]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      
      const [contactRequests, nextStepsQuestions] = await Promise.all([
        getContactRequests(),
        getNextStepsQuestions()
      ]);

      // Combine and normalize messages
      const combinedMessages: CombinedMessage[] = [
        ...contactRequests.map((msg): CombinedMessage => ({
          id: msg.id,
          type: 'contact' as MessageType,
          slug: msg.slug,
          message: msg.message,
          is_read: msg.is_read,
          created_at: msg.created_at,
          updated_at: msg.updated_at
        })),
        ...nextStepsQuestions.map((msg): CombinedMessage => ({
          id: msg.id,
          type: 'next_steps' as MessageType,
          slug: msg.slug,
          message: msg.question,
          name: msg.name,
          email: msg.email,
          phone: msg.phone,
          company: msg.company,
          priority: msg.priority,
          source_page: msg.source_page,
          is_read: msg.is_read,
          created_at: msg.created_at,
          updated_at: msg.updated_at
        }))
      ];

      setMessages(combinedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort messages
  useEffect(() => {
    let filtered = messages;

    // Apply filter
    if (filter === 'read') {
      filtered = filtered.filter(msg => msg.is_read);
    } else if (filter === 'unread') {
      filtered = filtered.filter(msg => !msg.is_read);
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.message.toLowerCase().includes(term) ||
        msg.slug.toLowerCase().includes(term) ||
        msg.name?.toLowerCase().includes(term) ||
        msg.email?.toLowerCase().includes(term) ||
        msg.company?.toLowerCase().includes(term)
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
          return bPriority - aPriority;
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredMessages(filtered);
  }, [messages, filter, sortBy, searchTerm]);

  const handleMarkAsRead = async (messageId: string, messageType: MessageType, isRead: boolean) => {
    try {
      let success = false;
      
      if (messageType === 'contact') {
        success = await updateContactRequestReadStatus(messageId, isRead);
      } else {
        success = await updateNextStepsQuestionReadStatus(messageId, isRead);
      }

      if (success) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: isRead } : msg
        ));
      }
    } catch (error) {
      console.error('Error updating read status:', error);
    }
  };

  const handleBulkMarkAsRead = async (isRead: boolean) => {
    const promises = Array.from(selectedMessages).map(messageId => {
      const message = messages.find(m => m.id === messageId);
      if (message) {
        return handleMarkAsRead(messageId, message.type, isRead);
      }
    });

    await Promise.all(promises);
    setSelectedMessages(new Set());
  };

  const toggleMessageSelection = (messageId: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId);
    } else {
      newSelected.add(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const selectAllVisible = () => {
    const visibleIds = new Set(filteredMessages.map(m => m.id));
    setSelectedMessages(visibleIds);
  };

  const clearSelection = () => {
    setSelectedMessages(new Set());
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-GB', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type: MessageType) => {
    switch (type) {
      case 'contact': return <Mail className="w-4 h-4" />;
      case 'next_steps': return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: MessageType) => {
    switch (type) {
      case 'contact': return 'Contact Request';
      case 'next_steps': return 'Next Steps Question';
    }
  };

  const stats = {
    total: messages.length,
    unread: messages.filter(m => !m.is_read).length,
    contact: messages.filter(m => m.type === 'contact').length,
    nextSteps: messages.filter(m => m.type === 'next_steps').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12">
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-purple-900/20" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            📬 Admin Inbox
          </h1>
          <p className="text-xl text-gray-300">
            Manage all contact requests and next steps questions from your website visitors.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total Messages</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400">{stats.unread}</div>
            <div className="text-gray-400 text-sm">Unread</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.contact}</div>
            <div className="text-gray-400 text-sm">Contact Requests</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.nextSteps}</div>
            <div className="text-gray-400 text-sm">Next Steps</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages, names, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as FilterType)}
                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread Only</option>
                <option value="read">Read Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortType)}
                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priority">By Priority</option>
              </select>
            </div>

            {/* Bulk Actions */}
            {selectedMessages.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {selectedMessages.size} selected
                </span>
                <button
                  onClick={() => handleBulkMarkAsRead(true)}
                  className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors text-sm"
                >
                  Mark Read
                </button>
                <button
                  onClick={() => handleBulkMarkAsRead(false)}
                  className="px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                >
                  Mark Unread
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-2 bg-gray-500/20 hover:bg-gray-500/30 rounded-lg text-gray-400 hover:text-gray-300 transition-colors text-sm"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-700">
            <button
              onClick={selectAllVisible}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Select All Visible ({filteredMessages.length})
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => fetchMessages()}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading messages...</p>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No messages found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No messages match your current filters.'}
              </p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`bg-gray-800/50 backdrop-blur-lg border rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 ${
                  message.is_read ? 'border-gray-700' : 'border-blue-500/30 bg-blue-500/5'
                } ${
                  selectedMessages.has(message.id) ? 'ring-2 ring-purple-500/50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <button
                    onClick={() => toggleMessageSelection(message.id)}
                    className="mt-1 p-1 rounded hover:bg-gray-700 transition-colors"
                  >
                    {selectedMessages.has(message.id) ? (
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(message.type)}
                          <span className="text-sm font-medium text-purple-400">
                            {getTypeLabel(message.type)}
                          </span>
                        </div>
                        
                        {message.priority && (
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(message.priority)}`}>
                            {message.priority} priority
                          </span>
                        )}

                        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                          {message.slug}
                        </span>

                        {!message.is_read && (
                          <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">
                          {formatDate(message.created_at)}
                        </span>
                        <button
                          onClick={() => handleMarkAsRead(message.id, message.type, !message.is_read)}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                          title={message.is_read ? 'Mark as unread' : 'Mark as read'}
                        >
                          {message.is_read ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-blue-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    {(message.name || message.email || message.phone || message.company) && (
                      <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-400">
                        {message.name && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{message.name}</span>
                          </div>
                        )}
                        {message.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <a 
                              href={`mailto:${message.email}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {message.email}
                            </a>
                          </div>
                        )}
                        {message.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <a 
                              href={`tel:${message.phone}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {message.phone}
                            </a>
                          </div>
                        )}
                        {message.company && (
                          <div className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            <span>{message.company}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message Text */}
                    <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {message.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={`/demo/${message.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Demo
                      </a>
                      <a
                        href={`/review/${message.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Review
                      </a>
                      <a
                        href={`/next-steps/${message.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Next Steps
                      </a>
                      {message.email && (
                        <a
                          href={`mailto:${message.email}?subject=Re: Your inquiry about ${message.slug}&body=Hi ${message.name || 'there'},%0D%0A%0D%0AThank you for your message about ${message.slug}. `}
                          className="inline-flex items-center gap-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          Reply
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        {filteredMessages.length > 0 && (
          <div className="mt-8 text-center text-gray-400 text-sm">
            Showing {filteredMessages.length} of {messages.length} messages
          </div>
        )}
      </div>
    </div>
  );
}

export default InboxPage;