'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../config/Modal';

// 1. Define the Prop Type
interface Props {
  onSuccess?: (name: string) => void;
}

// 2. Accept the prop
export default function AddBtn({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center gap-2"
      >
        <Plus size={24} />
        <span className="font-bold hidden md:inline">Add Widget</span>
      </button>

      {/* 3. Pass it to the Modal */}
      {open && <Modal close={() => setOpen(false)} onSuccess={onSuccess} />}
    </>
  );
}