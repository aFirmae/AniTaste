import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
    </>
  );
}
