import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const CreatePollFAB = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.5 
      }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link to="/create">
        <motion.button
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
        >
          <motion.span 
            className="text-2xl font-light group-hover:rotate-90 transition-transform duration-300"
            whileHover={{ rotate: 90 }}
          >
            +
          </motion.span>
        </motion.button>
      </Link>
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none"
      >
        Create New Poll
        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
      </motion.div>
    </motion.div>
  );
};