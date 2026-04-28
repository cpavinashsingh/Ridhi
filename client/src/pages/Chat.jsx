import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

import http from '../api/http';
import { useAuth } from '../context/AuthContext';
import { createChatSocket } from '../socket/socket';

const formatTime = (dateValue) =>
  new Date(dateValue).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit'
  });

const ADMIN_CHAT_USER_ID = '000000000000000000000001';

const typingDotTransition = {
  duration: 0.6,
  repeat: Infinity,
  repeatType: 'mirror',
  ease: 'easeInOut'
};

const Chat = () => {
  const { user, token, logout } = useAuth();
  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);
  const typingResetTimersRef = useRef({});
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [draftHistory, setDraftHistory] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [messageText, setMessageText] = useState('');
  const [typingHint, setTypingHint] = useState(250);
  const [socketStatus, setSocketStatus] = useState('connecting');
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const selectedUser = useMemo(
    () => users.find((entry) => String(entry._id) === String(activeUserId)),
    [users, activeUserId]
  );

  const userEmailById = useMemo(() => {
    const map = {};

    users.forEach((entry) => {
      map[String(entry._id)] = entry.email;
    });

    return map;
  }, [users]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [messagesResponse, usersResponse] = await Promise.all([
          http.get('/chat/messages'),
          user?.isAdmin ? http.get('/chat/users') : Promise.resolve({ data: { data: [] } })
        ]);

        setMessages(messagesResponse.data.data || []);
        setUsers(usersResponse.data.data || []);

        if (user?.isAdmin && usersResponse.data.data?.length) {
          setActiveUserId(String(usersResponse.data.data[0]._id));
        }
      } catch {
        setNotice('Failed to load initial chat data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const socket = createChatSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketStatus('connected');
    });

    socket.on('disconnect', () => {
      setSocketStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setSocketStatus('disconnected');
      setNotice('Socket connection failed. Retrying...');
    });

    socket.on('typingDebounceConfig', (payload) => {
      if (payload?.debounceMs) {
        setTypingHint(payload.debounceMs);
      }
    });

    socket.on('messageReceived', (incomingMessage) => {
      setMessages((current) => [...current, incomingMessage]);
    });

    socket.on('adminTyping', ({ userId, drafts = [] }) => {
      setDraftHistory((current) => ({
        ...current,
        [userId]: drafts
      }));

      setTypingUsers((current) => ({
        ...current,
        [userId]: true
      }));

      if (typingResetTimersRef.current[userId]) {
        window.clearTimeout(typingResetTimersRef.current[userId]);
      }

      typingResetTimersRef.current[userId] = window.setTimeout(() => {
        setTypingUsers((current) => ({
          ...current,
          [userId]: false
        }));
      }, 1800);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('typingDebounceConfig');
      socket.off('messageReceived');
      socket.off('adminTyping');
      socket.disconnect();
      socketRef.current = null;

      Object.values(typingResetTimersRef.current).forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      typingResetTimersRef.current = {};
    };
  }, [token]);

  useEffect(() => {
    if (!user?.isAdmin || !activeUserId) {
      return undefined;
    }

    const syncConversation = async () => {
      try {
        const { data } = await http.get('/chat/messages', {
          params: { userId: activeUserId }
        });
        setMessages(data.data || []);
      } catch {
        setNotice('Failed to load selected conversation');
      }
    };

    syncConversation();
  }, [activeUserId, user?.isAdmin]);

  useEffect(() => {
    if (!socketRef.current) {
      return undefined;
    }

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(() => {
      socketRef.current.emit('typing', {
        content: messageText
      });
    }, typingHint);

    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, [messageText, typingHint]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (!socketRef.current || !messageText.trim()) {
      return;
    }

    if (user?.isAdmin && !activeUserId) {
      setNotice('Select a user before sending a message.');
      return;
    }

    const payload = user?.isAdmin
      ? {
          receiverId: activeUserId,
          text: messageText,
          type: 'message'
        }
      : {
          text: messageText,
          type: 'message'
        };

    socketRef.current.emit('sendMessage', payload, (acknowledgement) => {
      if (!acknowledgement?.success) {
        setNotice(acknowledgement?.message || 'Failed to send message');
      } else {
        setNotice('');
        setMessageText('');
      }
    });
  };

  const visibleMessages = useMemo(() => {
    if (!user?.isAdmin) {
      return messages;
    }

    if (!activeUserId) {
      return messages;
    }

    return messages.filter(
      (entry) =>
        String(entry.senderId) === String(activeUserId) ||
        String(entry.receiverId) === String(activeUserId) ||
        String(entry.senderId) === ADMIN_CHAT_USER_ID ||
        String(entry.receiverId) === ADMIN_CHAT_USER_ID
    );
  }, [messages, user?.isAdmin, activeUserId]);

  const selectedUserIsTyping = Boolean(activeUserId && typingUsers[activeUserId]);
  const showUserTyping = !user?.isAdmin && messageText.trim().length > 0;
  const activeDrafts = draftHistory[activeUserId] || [];

  if (loading) {
    return (
      <main className="grid min-h-[calc(100vh-5rem)] place-items-center bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 px-4 py-8">
        <motion.div
          initial={{ opacity: 0.4, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="rounded-3xl border border-rose-200/70 bg-white/65 px-6 py-4 text-sm font-medium text-rose-900 shadow-xl shadow-rose-300/50 backdrop-blur-md"
        >
          Opening your chat...
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-7xl bg-gradient-to-br from-rose-100 via-pink-50 to-red-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="rounded-[2rem] border border-rose-200/80 bg-white/65 p-5 shadow-xl shadow-rose-200/50 backdrop-blur-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500">Session</p>
              <h2 className="mt-2 text-2xl font-black text-rose-900">{user?.isAdmin ? 'Him chat' : 'Chat with Him'}</h2>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-rose-200 bg-white/75 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-white"
            >
              Logout
            </button>
          </div>


          {user?.isAdmin ? (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Users</p>
              <div className="mt-3 space-y-2">
                <AnimatePresence>
                  {users.map((entry) => (
                    <motion.button
                      key={entry._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      type="button"
                      onClick={() => setActiveUserId(String(entry._id))}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        String(activeUserId) === String(entry._id)
                          ? 'border-rose-300 bg-rose-100/85 text-rose-900 shadow-sm'
                          : 'border-rose-100 bg-white/70 text-rose-700 hover:bg-white'
                      }`}
                    >
                      <p className="font-semibold">{entry.username}</p>
                      <p className="text-xs text-rose-500">{entry.email}</p>
                      {typingUsers[String(entry._id)] ? (
                        <p className="mt-1 text-xs font-medium text-rose-600">Typing...</p>
                      ) : null}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-rose-200/70 bg-white/70 p-4 text-sm text-rose-700">
              <p className="font-semibold text-rose-900">User mode</p>
              <p className="mt-1">You can only chat with Him. No other user conversations are allowed.</p>
            </div>
          )}

          {user?.isAdmin && selectedUser ? (
            <div className="mt-6 rounded-2xl border border-rose-200/70 bg-white/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-500">Active conversation</p>
              <p className="mt-2 text-sm font-semibold text-rose-900">{selectedUser.username}</p>
              <p className="text-xs text-rose-500">{selectedUser.email}</p>
              {selectedUserIsTyping ? (
                <p className="mt-2 text-xs font-medium text-rose-600">Currently typing...</p>
              ) : null}
            </div>
          ) : null}

          {user?.isAdmin ? (
            <div className="mt-6 rounded-2xl border border-rose-200/70 bg-rose-50/80 p-4">
              <p className="text-sm font-semibold text-rose-900">Draft history</p>
              <div className="mt-3 max-h-52 space-y-2 overflow-auto pr-1 text-sm text-rose-800">
                {activeDrafts.length ? (
                  activeDrafts.map((draft) => (
                    <div key={`${draft._id || draft.timestamp}-${draft.timestamp}`} className="rounded-xl bg-white/75 px-3 py-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] text-rose-500">{formatTime(draft.timestamp)}</p>
                        {!draft.content?.trim() ? (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                            deleted
                          </span>
                        ) : null}
                      </div>
                      <p className="break-words text-sm">
                        {draft.content?.trim() ? draft.content : '[deleted typed text]'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-rose-500">No draft snapshots yet.</p>
                )}
              </div>
            </div>
          ) : null}
        </motion.aside>

        <motion.section
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="flex min-h-[72vh] flex-col overflow-hidden rounded-[2rem] border border-rose-200/80 bg-white/70 shadow-xl shadow-rose-200/50 backdrop-blur-lg"
        >
          <div className="flex items-center justify-between border-b border-rose-200/80 px-6 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-500"></p>
              <h3 className="mt-2 text-2xl font-black text-rose-900">
                {user?.isAdmin ? 'All users, one place' : 'Private conversation with Him'}
              </h3>
            </div>
            <div className="rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700">
              {socketStatus === 'connected' ? 'Realtime connected' : 'Connecting...'}
            </div>
          </div>

          {notice ? (
            <div className="mx-6 mt-4 rounded-2xl border border-rose-300 bg-rose-100/80 px-4 py-3 text-sm text-rose-800">
              {notice}
            </div>
          ) : null}

          <div className="flex-1 space-y-4 overflow-auto px-6 py-6">
            <AnimatePresence initial={false}>
              {visibleMessages.length ? (
                visibleMessages.map((entry) => {
                  const ownSenderId = user?.isAdmin ? ADMIN_CHAT_USER_ID : user?._id || user?.userId;
                  const isMine = String(entry.senderId) === String(ownSenderId);
                  const isAdminMessage = String(entry.senderId) === ADMIN_CHAT_USER_ID;
                  const userMessageEmail = userEmailById[String(entry.senderId)] || userEmailById[String(entry.receiverId)];

                  return (
                    <motion.div
                      key={entry.id || entry._id || `${entry.createdAt}-${entry.text}`}
                      layout
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-[1.7rem] px-4 py-3 shadow-sm ${
                          isMine
                            ? 'bg-gradient-to-br from-rose-300 to-pink-300 text-rose-950'
                            : 'border border-rose-200 bg-white/90 text-rose-900'
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2 text-[11px] font-medium opacity-80">
                          <span>{isAdminMessage ? 'Him' : 'User'}</span>
                          <span>•</span>
                          <span>{formatTime(entry.createdAt)}</span>
                        </div>
                        {user?.isAdmin && !isAdminMessage ? (
                          <p className="mb-1 text-[11px] font-medium text-rose-500">
                            {userMessageEmail || 'Email unavailable'}
                          </p>
                        ) : null}
                        <p className="whitespace-pre-wrap break-words text-sm leading-6">{entry.text || '[typing event]'}</p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid h-full place-items-center rounded-[1.5rem] border border-dashed border-rose-300 bg-white/60 p-10 text-center text-rose-500"
                >
                  Start the first message and let the conversation bloom.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6">
            {showUserTyping || selectedUserIsTyping ? (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-rose-100/90 px-3 py-1 text-xs font-medium text-rose-700">
                <span>{user?.isAdmin ? 'User is typing' : 'Typing'}</span>
                <motion.span animate={{ y: [0, -2, 0] }} transition={{ ...typingDotTransition, delay: 0 }}>•</motion.span>
                <motion.span animate={{ y: [0, -2, 0] }} transition={{ ...typingDotTransition, delay: 0.1 }}>•</motion.span>
                <motion.span animate={{ y: [0, -2, 0] }} transition={{ ...typingDotTransition, delay: 0.2 }}>•</motion.span>
              </div>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="border-t border-rose-200/80 bg-white/75 px-6 py-5">
            <div className="flex gap-3">
              <input
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
                className="flex-1 rounded-2xl border border-rose-200 bg-white px-4 py-3 text-rose-900 outline-none transition placeholder:text-rose-300 focus:border-rose-400"
                placeholder={user?.isAdmin ? 'Write a reply for selected user...' : 'Write a message to Him...'}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="rounded-2xl bg-gradient-to-r from-rose-400 to-pink-400 px-5 py-3 font-semibold text-white transition hover:brightness-110"
              >
                Send
              </motion.button>
            </div>
            <p className="mt-3 text-xs text-rose-500">
              Smooth typing updates are emitted after debounce to keep realtime chat responsive.
            </p>
          </form>
        </motion.section>
      </div>
    </main>
  );
};

export default Chat;
