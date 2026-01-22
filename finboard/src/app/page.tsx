import Board from '@/components/dash/Board';
import AddBtn from '@/components/dash/AddBtn';
import ThemeToggle from '@/components/dash/ThemeToggle';

export default function Home() {
  return (
    <main className="min-h-screen pb-24 transition-colors duration-300 bg-white dark:bg-black"> 
      <header className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40 flex justify-between items-center transition-colors duration-300">
        <h1 className="text-2xl font-bold tracking-tight">FinBoard</h1>
        <ThemeToggle />
      </header>

      <Board />
      <AddBtn />
    </main>
  );
}