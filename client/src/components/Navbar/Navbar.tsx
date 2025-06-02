import { useState } from 'react';
import { Squirrel, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type MenuItem = {
  id: number;
  title: string;
  link: string;
};

const NavbarMenu: MenuItem[] = [
  { id: 1, title: 'Home', link: '/' },
  { id: 2, title: 'About', link: '/about' },
  { id: 3, title: 'Contact Us', link: '/contact-us' },
];

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0, transition: { duration: 0.3 } },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.3 } },
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="fixed bg-white shadow-md top-0 w-full z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setIsOpen(false)}
        >
          <Squirrel size={40} className="text-black" />
          <h1 className="text-3xl font-extrabold text-black select-none">Squirrel</h1>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {NavbarMenu.map(({ id, title, link }) => (
            <li key={id} className="list-none">
              <Link
                to={link}
                className="text-gray-700 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {title}
              </Link>
            </li>
          ))}
        </ul>

        {/* Sign In Button Desktop */}
        <div className="hidden md:flex  gap-2">
          <Link
            to="/login"
            className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          >
            Register
          </Link>
        </div>

        {/* Hamburger Button Mobile */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X size={28} className="text-indigo-600" />
          ) : (
            <Menu size={28} className="text-indigo-600" />
          )}
        </button>
      </div>

      {/* Mobile Menu with animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden bg-white shadow-lg border-t border-gray-200 overflow-hidden"
          >
            <ul className="flex flex-col p-4 gap-4">
              {NavbarMenu.map(({ id, title, link }) => (
                <li key={id} className="list-none">
                  <Link
                    to={link}
                    className="block text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {title}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold text-center hover:bg-indigo-700 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
