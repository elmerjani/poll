import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        {title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
        {children}
        <div className="modal-action">
          <button className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
