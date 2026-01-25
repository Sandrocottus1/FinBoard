'use client';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../config/Modal';

const MODAL_OPEN_KEY = 'finboard-add-widget-modal-open';

// 1. Define the Prop Type
interface Props {
  onSuccess?: (name: string) => void;
}
 
// 2. Accept the prop
export default function AddBtn({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  // Restore modal open state on mount
  useEffect(() => {
    try {
      const wasOpen = localStorage.getItem(MODAL_OPEN_KEY) === 'true';
      if (wasOpen) {
        setOpen(true);
      }
    } catch (e) {
      console.error('Failed to restore modal state:', e);
    }
  }, []);

  // Save modal state when it changes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    try {
      if (isOpen) {
        localStorage.setItem(MODAL_OPEN_KEY, 'true');
      } else {
        localStorage.removeItem(MODAL_OPEN_KEY);
      }
    } catch (e) {
      console.error('Failed to save modal state:', e);
    }
  };

  const handleClose = () => {
    handleOpenChange(false);
  };

  return (
    <>
      <button 
        onClick={() => handleOpenChange(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center gap-2"
      >
        <Plus size={24} />
        <span className="font-bold hidden md:inline">Add Widget</span>
      </button>

      {/* 3. Pass it to the Modal */}
      {open && <Modal close={handleClose} onSuccess={onSuccess} />}
    </>
  );
}