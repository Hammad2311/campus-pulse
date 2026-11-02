import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { 
  UserCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import './OrganizerLoginPage.css';

export function OrganizerLoginPage() {
  const { setOrganizerSession, navigateTo } = useEvents();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Official university email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please provide a valid email format';
    }

    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate input validation verification
    setTimeout(() => {
      setIsLoading(false);
      // Launch V1 Organizer Dashboard
      setOrganizerSession(email);
    }, 500);
  };

  return (
    <div className="cp-login-page">
      <div className="container cp-login-container">
        <div className="cp-login-card card">
          {/* Brand & Title */}
          <div className="cp-login-header">
            <div className="cp-login-icon">
              <UserCheck size={28} />
            </div>
            <h1 className="cp-login-title">Organizer Sign In</h1>
            <p className="cp-login-subtitle">
              Authorized portal for campus student chapters, faculty advisors, and departmental event coordinators.
            </p>
          </div>

          {/* Firebase Authentication Boundary Notice (Section 6) */}
          <div className="cp-login-auth-notice">
            <div className="cp-auth-notice-header">
              <ShieldCheck size={16} className="cp-shield-icon" />
              <span>Firebase Auth Integration Boundary</span>
            </div>
            <p className="cp-auth-notice-desc">
              Production credential authentication will be powered by Hammad Qubah's Firebase Authentication module. 
              Enter your official campus email and password below to test the V1 organizer workspace.
            </p>
          </div>

          {serverError && (
            <div className="cp-login-alert error">
              <AlertCircle size={16} />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="cp-login-form">
            <div className="cp-form-group">
              <label className="cp-form-label">University / Organization Email</label>
              <div className="cp-input-icon-wrap">
                <Mail size={16} className="cp-input-icon" />
                <input
                  type="email"
                  className={`cp-form-input cp-has-icon ${errors.email ? 'error' : ''}`}
                  placeholder="organizer@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && <span className="cp-input-error">{errors.email}</span>}
            </div>

            <div className="cp-form-group">
              <label className="cp-form-label">Password</label>
              <div className="cp-input-icon-wrap">
                <Lock size={16} className="cp-input-icon" />
                <input
                  type="password"
                  className={`cp-form-input cp-has-icon ${errors.password ? 'error' : ''}`}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && <span className="cp-input-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg cp-login-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Validating credentials...</span>
              ) : (
                <>
                  <span>Sign In to Organizer Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="cp-login-footer">
            <button 
              className="cp-back-home-link"
              onClick={() => navigateTo('landing')}
            >
              ← Return to Campus Pulse Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
