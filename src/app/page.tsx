import { ControlUnit } from '@/components/sections/ControlUnit';
import { Toolbar } from '@/components/Toolbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <Toolbar />
      <div className="container mx-auto p-4 space-y-4">
        <ControlUnit />
      </div>
    </main>
  );
} 