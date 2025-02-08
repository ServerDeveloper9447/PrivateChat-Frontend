import React, { useState, useCallback } from 'react';
import { MessageCircle, Send, Search, Plus, X } from 'lucide-react';
import { createChat, getChat, getUserChats, searchUser } from '../functions';
import Notiflix from 'notiflix';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  messages: Message[];
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

const ChatPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[] | []>([]);

  React.useEffect(() => {
    (async () => {
      const res = await getUserChats();
      if(res[0]) setChats(res[0].chatIds);
    })();
  }, []); 

  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');

  const handleChatSelect = (chat: Chat) => {
    getChat(chat.id)
    .then(([_,err]) => {
      if(err) {
        Notiflix.Notify.failure("Something went wrong");
        return;
      }
    })
    setSelectedChat(chat);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: selectedChat.messages.length + 1,
        sender: "You",
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat?.messages, newMessage],
        lastMessage: newMessage.content
      };
      setChats(chats.length != 0 ? chats.map(chat => chat.id === selectedChat.id ? updatedChat : chat) : []);
      setSelectedChat(updatedChat);
      setMessage('');
    }
  };

  const searchChats = useCallback((term: string) => {
    return chats.filter(chat => 
      chat.name.toLowerCase().includes(term.toLowerCase())
    );
  }, [chats]);

  const filteredChats = searchTerm ? searchChats(searchTerm) : chats;

  const handleNewChat = () => {
    Notiflix.Loading.pulse("Finding user...");
    if(chats.find((x) => x.name === newChatName)) {
      setSelectedChat(chats.find((x) => x.name === newChatName) ?? null)
      setIsNewChatModalOpen(false)
      Notiflix.Loading.remove()
      return;
    };
    searchUser(newChatName)
    .then(([user,err]) => {
      Notiflix.Loading.remove()
      if(err) {
        Notiflix.Notify.failure("User not found");
        return;
      };
      if(!user) {
        Notiflix.Loading.remove();
        Notiflix.Notify.failure("Something went wrong");
        return;
      }
      createChat({id: user._id})
      .then(([nchat,err]) => {
        Notiflix.Loading.remove()
        if(err) {
          Notiflix.Notify.failure("Something went wrong");
          return;
        }
        const chat = {
          id: nchat.chatId,
          name: user.username,
          avatar: user.avatar ?? "",
          lastMessage: '',
          messages: []
        }
        setChats([chat,...chats])
        setNewChatName('')
        setIsNewChatModalOpen(false);
      })
    })
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/3 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Chats</h2>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
          </div>
        </div>
        <ul className="overflow-y-auto flex-1">
          {filteredChats.map((chat) => (
            <li
              key={chat.id}
              className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                selectedChat?.id === chat.id ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleChatSelect(chat)}
            >
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <h3 className="font-semibold">{chat.name}</h3>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-gray-300 bg-white">
              <h2 className="text-xl font-semibold">{selectedChat.name}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedChat.messages.map((msg) => (
                <div key={msg.id} className={`mb-4 ${msg.sender === 'You' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-2 rounded-lg ${msg.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-75">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
      {isNewChatModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">New Chat</h3>
              <button
                onClick={() => setIsNewChatModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Enter username without @"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value.replace(/ /g,""))}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            />
            <button
              onClick={handleNewChat}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Start Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;