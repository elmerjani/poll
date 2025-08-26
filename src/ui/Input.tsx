import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div className="form-control w-full">
    {label && <label className="label"><span className="label-text">{label}</span></label>}
    <input className="input input-bordered w-full" {...props} />
  </div>
);
