import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  Trash2, 
  Star, 
  Reply, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock, 
  Send,
  User,
  Paperclip
} from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  email: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  unread: boolean;
  starred: boolean;
  category: 'General' | 'Editorial' | 'Press' | 'Partnership';
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'Sami Haddad',
    email: 'sami.h@outlook.com',
    subject: 'Story lead: New tech hub launching in Downtown Beirut',
    snippet: 'Hey 961 team, I wanted to share an exclusive update on a new regional incubator...',
    body: 'Hey 961 team,\n\nI wanted to share an exclusive update on a new regional incubator set to open next month in Downtown Beirut with $10M in seed funding. We would love to offer The961 first interview rights.\n\nLet me know if you would like me to connect you with the founding partners.\n\nBest regards,\nSami Haddad',
    date: '10:42 AM',
    unread: true,
    starred: true,
    category: 'Editorial',
  },
  {
    id: 'msg-2',
    sender: 'Elena Rostova',
    email: 'elena@bratislava-media.sk',
    subject: 'Slovakia edition collaboration & cross-publishing',
    snippet: 'Greetings from Bratislava! We love the new Slovakia section on The961...',
    body: 'Greetings from Bratislava!\n\nWe love the new Slovakia section on The961. We are a local cultural magazine and would love to discuss syndicate content or cross-publishing stories between Lebanon and Central Europe.\n\nLooking forward to hearing back,\nElena',
    date: 'Yesterday',
    unread: true,
    starred: false,
    category: 'Partnership',
  },
  {
    id: 'msg-3',
    sender: 'Nour El-Khoury',
    email: 'nour.k@gmail.com',
    subject: 'Feedback on recent restaurant guide',
    snippet: 'Really enjoyed the latest Mar Mikhael dining recommendations listicle...',
    body: 'Hi editors,\n\nReally enjoyed the latest Mar Mikhael dining recommendations listicle! Wanted to suggest adding the new bakery that opened on Armenia street last week.\n\nKeep up the great work!',
    date: 'Aug 13',
    unread: false,
    starred: false,
    category: 'General',
  },
  {
    id: 'msg-4',
    sender: 'Karim Mansour',
    email: 'press@cedarsfilmfest.org',
    subject: 'Press Release: Cedars Film Festival 2026 Official Selection',
    snippet: 'Official media kit and press pass registration for verified journalists...',
    body: 'Dear The961 Editorial Desk,\n\nPlease find attached the official press kit and media credential application for the upcoming Cedars Film Festival 2026.\n\nPress passes are limited and priority is given to accredited publications.\n\nSincerely,\nKarim Mansour',
    date: 'Aug 11',
    unread: false,
    starred: true,
    category: 'Press',
  },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [selectedMessageId, setSelectedMessageId] = useState<string>(INITIAL_MESSAGES[0].id);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyText, setReplyText] = useState('');

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const markAsRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
    setSelectedMessageId(id);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (selectedMessageId === id) {
      const remaining = messages.filter(m => m.id !== id);
      if (remaining.length > 0) {
        setSelectedMessageId(remaining[0].id);
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          msg.snippet.toLowerCase().includes(searchQuery.toLowerCase());
    if (filter === 'unread') return matchesSearch && msg.unread;
    if (filter === 'starred') return matchesSearch && msg.starred;
    return matchesSearch;
  });

  const unreadCount = messages.filter(m => m.unread).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FF0000] text-white">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Inbound reader inquiries, editorial tips, and contact form submissions.</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === 'unread' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
            <span>Unread</span>
          </button>
          <button
            type="button"
            onClick={() => setFilter('starred')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filter === 'starred' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Star className="w-3 h-3" />
            <span>Starred</span>
          </button>
        </div>
      </div>

      {/* Main Mail View: Split List & Detail */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
        {/* Left: Message List */}
        <div className="lg:col-span-5 border-r border-gray-200 flex flex-col">
          {/* Search Box */}
          <div className="p-3.5 border-b border-gray-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF0000]"
              />
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-xs text-gray-400">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isSelected = msg.id === selectedMessageId;

                return (
                  <div
                    key={msg.id}
                    onClick={() => markAsRead(msg.id)}
                    className={`p-4 cursor-pointer transition-colors relative ${
                      isSelected 
                        ? 'bg-red-50/40 border-l-2 border-[#FF0000]' 
                        : 'hover:bg-gray-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        {msg.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#FF0000] shrink-0" />
                        )}
                        <span className={`text-xs truncate ${msg.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {msg.sender}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => toggleStar(msg.id, e)}
                          className="text-gray-300 hover:text-amber-500 transition-colors p-0.5"
                        >
                          <Star className={`w-3.5 h-3.5 ${msg.starred ? 'fill-amber-400 text-amber-500' : ''}`} />
                        </button>
                        <span className="text-[10px] text-gray-400">{msg.date}</span>
                      </div>
                    </div>

                    <h4 className={`text-xs truncate mb-1 ${msg.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                      {msg.subject}
                    </h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {msg.snippet}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">
                        {msg.category}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Message Detail */}
        <div className="lg:col-span-7 flex flex-col bg-gray-50/30">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Message Header Bar */}
              <div className="p-6 bg-white border-b border-gray-200 flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-gray-900">{selectedMessage.subject}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {selectedMessage.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="font-semibold text-gray-900">{selectedMessage.sender}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                    <span>·</span>
                    <span>{selectedMessage.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line bg-white p-5 rounded-xl border border-gray-100">
                  {selectedMessage.body}
                </div>

                {/* Reply Form */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <Reply className="w-3.5 h-3.5 text-[#FF0000]" />
                      <span>Reply to {selectedMessage.sender}</span>
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your response..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#FF0000] resize-none"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Attach file"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!replyText.trim()) return;
                        alert('Reply sent to ' + selectedMessage.email);
                        setReplyText('');
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-gray-400">
              <Mail className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-xs">Select a message from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
