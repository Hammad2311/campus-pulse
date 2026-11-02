import React from 'react';
import { useEvents } from '../../context/EventContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

export function Toast() {
  const { toast, showToast } = useEvents();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="toast-icon success" size={18} />;
      case 'warning':
        return <AlertCircle className="toast-icon warning" size={18} />;
      default:
        return <Info className="toast-icon info" size={18} />;
    }
  };

  return (
    <div className={`cp-toast-container cp-toast-${toast.type || 'info'}`}>
      <div className="cp-toast-content">
        {getIcon()}
        <span className="cp-toast-message">{toast.message}</span>
      </div>
      <button 
        className="cp-toast-close"
        onClick={() => showToast(null)}
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}
