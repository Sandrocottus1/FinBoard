'use-client'

import {useEffect, useState} from 'react';
import { CheckCircle2,X } from 'lucide-react';

interface Props {
    message: string;
    isVisible: boolean;
    onClose: () => void;
}

export default function Notification({message, isVisible, onClose}: Props) { 
    const [show, setShow] = useState(isVisible);

    //Handle visibility changes

    useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for fade out before unmounting
      }, 3000); // Disappear after 3 seconds
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isVisible, onClose]);

  if (!isVisible && !show) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-out 
      ${show ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
      
      {/* The Glassy Pill */}
      <div className="flex items-center gap-3 px-6 py-3 rounded-full 
        bg-gray-900/80 backdrop-blur-md border border-gray-700/50 
        shadow-[0_0_30px_rgba(34,197,94,0.3)] text-gray-100">
        
        {/* Animated Icon */}
        <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 bg-green-500 blur-sm rounded-full opacity-50 animate-pulse"></div>
             <CheckCircle2 className="text-green-400 relative z-10" size={20} />
        </div>

        <span className="text-sm font-semibold tracking-wide pr-2">
          {message}
        </span>

        {/* Close Button (Optional) */}
        <button onClick={() => setShow(false)} className="ml-2 hover:bg-white/10 rounded-full p-1 transition-colors">
            <X size={14} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}