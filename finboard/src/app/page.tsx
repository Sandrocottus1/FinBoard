'use client'; 
import { useState } from 'react';
import Board from '@/components/dash/Board';
import AddBtn from '@/components/dash/AddBtn';
import ThemeToggle from '@/components/dash/ThemeToggle';
import Notification from '@/components/ui/Notification';

export default function Home() {
  // 2. Notification State
  const [notify, setNotify] = useState({ show: false, msg: '' });

  // 3. Trigger Function (Passed to AddBtn)
  const handleWidgetAdded = (name: string) => {
    setNotify({ 
      show: true, 
      msg: `Successfully added ${name}!` 
    });
  };

  return (
    <main className="min-h-screen pb-24 bg-background transition-colors duration-300">

      <header className="
        w-full flex items-center justify-between flex-nowrap p-6
        border-b border-gray-200 dark:border-gray-800
        bg-white dark:bg-gray-900 sticky top-0 z-40
        transition-colors duration-300 shadow-sm
      ">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">FinBoard</h1>
        <ThemeToggle />
      </header>

      <div className="p-6 bg-white dark:bg-black transition-colors duration-300">
        <Board />
      </div>
      
      <AddBtn onSuccess={handleWidgetAdded} />

      <Notification 
        message={notify.msg} 
        isVisible={notify.show} 
        onClose={() => setNotify({ ...notify, show: false })} 
      />
    </main>
  );
}
