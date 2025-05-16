import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-10">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-medium text-gray-80">RCM Piano Help</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-500 hover:scale-[1.15] transition duration-300 ease-in-out">Home</Link>
            <Link to="/technique" className="text-gray-600 hover:text-blue-500 hover:scale-[1.15] transition duration-300 ease-in-out">Technique</Link>
            <Link to="/ear-training" className="text-gray-600 hover:text-blue-500 hover:scale-[1.15] transition duration-300 ease-in-out">Ear Training</Link>
            <Link to="/sight-reading" className="text-gray-600 hover:text-blue-500 hover:scale-[1.15] transition duration-300 ease-in-out">Sight Reading</Link>
            <Link to="/metronome-page" className="text-gray-600 hover:text-blue-500 hover:scale-[1.15] transition duration-300 ease-in-out">Metronome</Link>
          </div>
          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 text-xl font-bold">
              {isOpen ? '×' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col bg-white px-4 pb-4 space-y-2">
          <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
          <Link to="/technique" className="text-gray-600 hover:text-blue-500">Technique</Link>
          <Link to="/ear-training" className="text-gray-600 hover:text-blue-500">Ear Training</Link>
          <Link to="/sight-reading" className="text-gray-600 hover:text-blue-500">Sight Reading</Link>
          <Link to="/metronome-page" className="text-gray-600 hover:text-blue-500">Online Metronome</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
