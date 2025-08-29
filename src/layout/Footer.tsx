import { FaLinkedin } from "react-icons/fa";

export const Footer = () => (
  <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 fixed bottom-0 left-0 w-full z-10">
    <div className="w-full flex justify-center items-center py-4 px-6 space-x-2">
      <span className="text-gray-400 text-sm font-light">
        © 2025 elmerjani. All rights reserved.
      </span>
      <a
        href="https://www.linkedin.com/in/your-linkedin-handle/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-500 transition-colors duration-300"
        title="LinkedIn"
      >
        <FaLinkedin size={16} />
      </a>
    </div>
  </footer>
);