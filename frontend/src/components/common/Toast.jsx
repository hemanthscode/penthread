// src/components/common/Toast.jsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <XCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const colors = {
  success: 'bg-green-600/90 border-green-500',
  error: 'bg-red-600/90 border-red-500',
  warning: 'bg-yellow-600/90 border-yellow-500',
  info: 'bg-blue-600/90 border-blue-500',
};

const Toast = ({ id, message, type = 'info', duration = 4000, onClose }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = 50;
    const totalSteps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setProgress(100 - (currentStep / totalSteps) * 100);
    }, interval);

    const autoClose = setTimeout(() => onClose(id), duration);

    return () => {
      clearInterval(timer);
      clearTimeout(autoClose);
    };
  }, [id, duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`relative max-w-sm w-full rounded-2xl border text-white shadow-xl backdrop-blur-md p-4 mb-3 ${colors[type]}`}
        role="alert"
      >
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="flex-1 text-sm font-medium">{message}</span>
          <button
            onClick={() => onClose(id)}
            className="text-white/70 hover:text-white transition"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-1 rounded-b-2xl bg-white/60 transition-all" style={{ width: `${progress}%` }} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
