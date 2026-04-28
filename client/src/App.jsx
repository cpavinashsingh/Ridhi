import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router-dom';

import FloatingHearts from './components/FloatingHearts';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import Chat from './pages/Chat';
import Bye from './pages/Bye';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';

const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(251,113,133,0.26),_transparent_34%),radial-gradient(circle_at_80%_15%,_rgba(244,114,182,0.16),_transparent_35%),linear-gradient(180deg,_#2a0d1a_0%,_#140711_60%,_#10060f_100%)] text-white">
      <FloatingHearts />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10, filter: 'blur(2px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          className="relative z-10"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/bye" element={<Bye />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={
                isAuthenticated ? (
                  <ProtectedRoute>
                    <NotFound />
                  </ProtectedRoute>
                ) : (
                  <NotFound />
                )
              }
            />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default App;
