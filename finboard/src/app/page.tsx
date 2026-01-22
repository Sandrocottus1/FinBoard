import Board from '@/components/dash/Board';
import AddBtn from '@/components/dash/AddBtn';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 pb-24">
      <header className="p-6 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-40">
        <h1 className="text-2xl font-bold tracking-tight">FinBoard</h1>
      </header>

      <Board />
      <AddBtn />
    </main>
  );
}