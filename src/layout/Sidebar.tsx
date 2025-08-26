import React from 'react';

export const Sidebar: React.FC = () => (
  <aside className="w-64 bg-base-100 shadow-md p-4 hidden md:block">
    <nav>
      <ul className="menu">
        <li><a className="menu-item">Home</a></li>
        <li><a className="menu-item">My Polls</a></li>
        <li><a className="menu-item">Settings</a></li>
      </ul>
    </nav>
  </aside>
);
