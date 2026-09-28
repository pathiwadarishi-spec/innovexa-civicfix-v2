import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { InnovexaLogo } from './InnovexaLogo.tsx';
import {
  Shield,
  Wrench,
  User,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  X,
  Radio,
  KeyRound,
  Fingerprint,
} from 'lucide-react';

interface InnovexaLoginModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isStandalonePage?: boolean;
  onSuccessNavigate?: () => void;
}

export const InnovexaLoginModal: React.FC<InnovexaLoginModalProps> = ({
  isOpen = true,
  onClose,
  isStandalonePage = false,
  onSuccessNavigate,
}) => {
  const { loginWithGoogle, loginWithInnovexa, loginAsAnonymousCitizen, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'quick' | 'email' | 'google' | 'guest'>('quick');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'worker' | 'supervisor' | 'admin'>('citizen');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen && !isStandalonePage) return null;

  const handleQuickRoleLogin = async (role: 'admin' | 'worker' | 'supervisor' | 'citizen', email: string, name: string) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await loginWithInnovexa(email, role, name);
      onClose?.();
      onSuccessNavigate?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await loginWithInnovexa(customEmail, selectedRole, customName || undefined);
      onClose?.();
      onSuccessNavigate?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await loginWithGoogle();
      onClose?.();
      onSuccessNavigate?.();
    } catch (err: any) {
      // If popup was blocked or user closed
      setErrorMessage(err.message || 'Google Sign-In failed or popup was closed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await loginAsAnonymousCitizen();
      onClose?.();
      onSuccessNavigate?.();
    } catch (err: any) {
      setErrorMessage(err.message || 'Guest access failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const content = (
    <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/50 overflow-hidden text-slate-100 flex flex-col my-auto">
      {/* Top Radiant Gradient Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 animate-pulse" />

      {/* Close button (if modal mode) */}
      {!isStandalonePage && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition-all z-20"
          aria-label="Close Login Modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header section with Vibrant INNOVEXA Logo */}
      <div className="pt-8 px-6 sm:px-8 pb-4 text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex justify-center mb-3">
          <InnovexaLogo size="lg" showText={true} showTagline={false} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>INNOVEXA Civic Identity & Access Management</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
          Welcome to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">INNOVEXA</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Secure municipal login for residents, field engineers, supervisors, and city administrators.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mx-6 sm:mx-8 mb-3 p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 sm:px-8 border-b border-slate-800">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>Fast Roles</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'google'
                ? 'border-blue-400 text-blue-400 bg-blue-950/20 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email'
                ? 'border-indigo-400 text-indigo-400 bg-indigo-950/20 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Email / Passkey</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guest')}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guest'
                ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20 rounded-t-lg'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Anonymous</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8">
        {/* Tab 1: Fast Roles */}
        {activeTab === 'quick' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 font-medium mb-1">
              Select an INNOVEXA municipal credential to sign in instantly:
            </p>

            {/* City Administrator */}
            <button
              type="button"
              disabled={isSubmitting || authLoading}
              onClick={() =>
                handleQuickRoleLogin(
                  'admin',
                  'admin@innovexa.gov',
                  'Dr. Rajesh Varma (City Director)'
                )
              }
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 hover:border-amber-400/70 hover:shadow-lg hover:shadow-amber-500/10 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">Municipal Administrator</span>
                    <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold border border-amber-500/30">
                      Full Ops
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">admin@innovexa.gov • City Ops Command</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Field Worker & Response Crew */}
            <button
              type="button"
              disabled={isSubmitting || authLoading}
              onClick={() =>
                handleQuickRoleLogin(
                  'worker',
                  'field.crew@innovexa.gov',
                  'Vikram Singh (Field Crew Alpha)'
                )
              }
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">Field Response Crew</span>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-semibold border border-emerald-500/30">
                      GPS Dispatch
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">field.crew@innovexa.gov • Task Execution</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Municipal Supervisor */}
            <button
              type="button"
              disabled={isSubmitting || authLoading}
              onClick={() =>
                handleQuickRoleLogin(
                  'supervisor',
                  'supervisor@innovexa.gov',
                  'Pooja Sharma (Zonal Supervisor)'
                )
              }
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 hover:border-blue-400/70 hover:shadow-lg hover:shadow-blue-500/10 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">Department Supervisor</span>
                    <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-semibold border border-blue-500/30">
                      Audit & Assign
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">supervisor@innovexa.gov • Verification</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Resident Citizen */}
            <button
              type="button"
              disabled={isSubmitting || authLoading}
              onClick={() =>
                handleQuickRoleLogin(
                  'citizen',
                  'citizen@innovexa.gov',
                  'Ananya Roy (Local Resident)'
                )
              }
              className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-500/30 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-500/10 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-100">Verified Citizen</span>
                    <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-semibold border border-cyan-500/30">
                      Resident
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">citizen@innovexa.gov • Issue Reporting</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        )}

        {/* Tab 2: Google Civic SSO */}
        {activeTab === 'google' && (
          <div className="space-y-4 py-2 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Google Civic Single Sign-On</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Authenticate securely using your Google profile via Firebase Authentication.
              </p>
            </div>

            <button
              type="button"
              disabled={isSubmitting || authLoading}
              onClick={handleGoogleLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500">
              * If third-party popups are disabled in your browser frame, switch to the <strong>Fast Roles</strong> or <strong>Email / Passkey</strong> tab for instant 1-click access.
            </p>
          </div>
        )}

        {/* Tab 3: Custom Email / Passkey */}
        {activeTab === 'email' && (
          <form onSubmit={handleCustomEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Email Address <span className="text-cyan-400">*</span>
              </label>
              <input
                type="email"
                required
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="e.g. yourname@innovexa.gov or personal email"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name / Department Alias (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Officer Anita Verma"
                className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Designated Access Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'citizen', label: 'Resident Citizen', icon: User },
                  { id: 'worker', label: 'Field Crew', icon: Wrench },
                  { id: 'supervisor', label: 'Supervisor', icon: Shield },
                  { id: 'admin', label: 'Administrator', icon: Building2 },
                ].map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id as any)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-950/40 text-cyan-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs font-semibold truncate">{role.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate with INNOVEXA ID</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 4: Anonymous Guest Mode */}
        {activeTab === 'guest' && (
          <div className="space-y-4 py-2 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Anonymous Resident Mode</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                File municipal complaints and track updates with zero personal identity requirement. You receive an anonymous crypto-token (e.g. <span className="font-mono text-cyan-300">Citizen #8410</span>).
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-left text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero personal data or email stored</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Full access to report, view live maps, and track progress</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isSubmitting || authLoading}
              onClick={handleGuestLogin}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Enter as Anonymous Resident</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer Trust Shield */}
      <div className="bg-slate-950/80 px-6 sm:px-8 py-3.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-cyan-400" />
          <span>INNOVEXA 256-bit Civic Encryption</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Server Live</span>
        </div>
      </div>
    </div>
  );

  // If standalone page (e.g. route /login)
  if (isStandalonePage) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-slate-950">
        {content}
      </div>
    );
  }

  // Modal mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />
      {content}
    </div>
  );
};
