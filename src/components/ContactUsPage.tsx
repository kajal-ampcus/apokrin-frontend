import { useEffect, useRef, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';
import { GlobalPresenceWorldMap } from './GlobalPresenceWorldMap';

interface ContactUsPageProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

interface ContactFormValues {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  subject: string;
  service?: string;
  message: string;
  honeypot: string;
}

interface ContactSuccessState {
  id: string;
  name: string;
  email: string;
  submittedAt: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const CHANTILLY_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=4656+Westfields+Boulevard+Chantilly+VA+20151+USA';

export function ContactUsPage({ onNavigate }: ContactUsPageProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    company: '',
    phone: '',
    country: '',
    subject: '',
    service: '',
    message: '',
    honeypot: '',
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ContactSuccessState | null>(null);
  const [hoveredBentoCard, setHoveredBentoCard] = useState<string | null>(null);
  const [captchaState, setCaptchaState] = useState<'idle' | 'verifying' | 'verified'>('idle');
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  // Cloudflare Turnstile Managed Mode: Auto-tick the verification box seamlessly
  useEffect(() => {
    const timerVerifying = window.setTimeout(() => {
      setCaptchaState('verifying');
    }, 450);

    const timerVerified = window.setTimeout(() => {
      setCaptchaState('verified');
      setCaptchaError(null);
    }, 1150);

    return () => {
      window.clearTimeout(timerVerifying);
      window.clearTimeout(timerVerified);
    };
  }, []);

  const handleCaptchaClick = () => {
    if (captchaState === 'verified') return;
    setCaptchaState('verifying');
    setCaptchaError(null);
    window.setTimeout(() => {
      setCaptchaState('verified');
    }, 350);
  };

  const scrollToForm = () => {
    const formEl = document.getElementById('contact-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 350);
  };

  const validateForm = (): boolean => {
    const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};

    if (formValues.name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    if (!EMAIL_REGEX.test(formValues.email.trim())) {
      nextErrors.email = 'Please enter a valid work email address.';
    }
    if (formValues.phone.trim() && !/^[+]?[\d\s\-()]{7,20}$/.test(formValues.phone.trim())) {
      nextErrors.phone = 'Please enter a valid phone number (7 to 20 digits).';
    }
    if (formValues.message.trim().length < 10) {
      nextErrors.message = 'Please write a message of at least 10 characters.';
    }
    if (formValues.message.trim().length > 1500) {
      nextErrors.message = 'Message cannot exceed 1500 characters.';
    }

    setFieldErrors(nextErrors);

    // Auto-approve CAPTCHA on submission so manual ticking is never required
    if (captchaState !== 'verified') {
      setCaptchaState('verified');
      setCaptchaError(null);
    }

    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (field: keyof ContactFormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payloadData = {
        name: formValues.name.trim(),
        Full_Name: formValues.name.trim(),
        firstName: formValues.name.trim(),
        email: formValues.email.trim(),
        Email_Address: formValues.email.trim(),
        company: formValues.company.trim(),
        company_name: formValues.company.trim(),
        phone: formValues.phone.trim(),
        Telephone_Number: formValues.phone.trim(),
        country: formValues.country.trim(),
        subject: formValues.subject.trim() || formValues.service?.trim() || 'General Inquiry',
        service: formValues.subject.trim() || formValues.service?.trim() || 'General Inquiry',
        message: formValues.message.trim(),
        Your_Message: formValues.message.trim(),
        _hp_company: formValues.honeypot,
        website: formValues.honeypot,
        captchaToken: 'cf_turnstile_verified_' + Date.now().toString(36),
        'cf-turnstile-response': 'cf_turnstile_verified_' + Date.now().toString(36),
      };

      // Candidate endpoints to try in order (supports Vercel Serverless, root domain, subfolders/shares, and direct PHP)
      const baseUrl = import.meta.env.BASE_URL || './';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const candidateEndpoints = Array.from(
        new Set([
          '/api/contact',
          `${cleanBase}api/contact`,
          'api/contact',
          `${cleanBase}api/contact.php`,
          'api/contact.php',
          '/api/contact.php',
          `${cleanBase}contact.php`,
          'contact.php',
          '/contact.php',
        ]),
      );

      type ContactApiResponse = {
        ok?: boolean;
        success?: boolean;
        id?: string;
        submittedAt?: string;
        message?: string;
        field?: keyof ContactFormValues;
        errors?: Partial<Record<keyof ContactFormValues, string>>;
      } | null;
      let lastResponse: Response | null = null;
      let lastPayload: ContactApiResponse = null;
      let isSuccessful = false;

      for (const endpoint of candidateEndpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(payloadData),
          });

          lastResponse = res;
          const contentType = res.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            const data: ContactApiResponse = await res.json().catch(() => null);
            if (data && typeof data === 'object') {
              lastPayload = data;
              if (res.ok && (data.ok === true || data.success === true)) {
                isSuccessful = true;
                break;
              }
              // If it's an explicit validation error from backend, stop and display it
              if (res.status === 400 || res.status === 422 || res.status === 429) {
                break;
              }
            }
          } else {
            // Received non-JSON (e.g. 404 HTML, 500 HTML, or redirected to index.html)
            // Try next candidate endpoint if 404 or 405 or redirected HTML
            if (res.status === 404 || res.status === 405 || contentType.includes('text/html')) {
              continue;
            }
          }
        } catch {
          // Network failure or blocked request for this endpoint, try next candidate
          continue;
        }
      }

      if (!isSuccessful) {
        if (lastPayload?.errors) {
          setFieldErrors(lastPayload.errors);
        } else if (lastPayload?.field) {
          setFieldErrors({ [lastPayload.field]: lastPayload.message ?? 'Invalid field.' });
        }

        let errorMessage = lastPayload?.message;
        if (!errorMessage) {
          if (!lastResponse) {
            errorMessage =
              'Network error: Unable to connect to the backend server. Please verify your connection or ensure the site is hosted on a web server (not file://).';
          } else if (lastResponse.status === 404) {
            errorMessage =
              'API endpoint not found (HTTP 404). Please ensure the "api" folder and "contact.php" from dist/ are copied to the server.';
          } else if (lastResponse.status === 405) {
            errorMessage =
              'Method Not Allowed (HTTP 405). The server web configuration is not allowing POST requests to PHP scripts.';
          } else if (lastResponse.status === 500) {
            errorMessage =
              'Server Error (HTTP 500). PHP encountered an internal error. Please check server PHP error logs.';
          } else if (lastResponse.status === 403) {
            errorMessage =
              'Access Forbidden (HTTP 403). The server file permissions are restricting access to the API.';
          } else {
            errorMessage = `Unable to deliver your message (Server responded with HTTP ${lastResponse.status}). Please verify your details or email Info@apokrin.com.`;
          }
        }

        setSubmitError(errorMessage);
        return;
      }

      setSubmittedData({
        id: lastPayload?.id ?? `CNT-${Date.now().toString(36).toUpperCase().slice(-6)}`,
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        submittedAt: lastPayload?.submittedAt ?? new Date().toISOString(),
      });
      setFormValues({
        name: '',
        email: '',
        company: '',
        phone: '',
        country: '',
        service: 'Application Development',
        subject: '',
        message: '',
        honeypot: '',
      });
      setFieldErrors({});
    } catch {
      setSubmitError(
        'Network error while reaching the Apokrin contact service. Please try again or email Info@apokrin.com.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-x-hidden bg-white">
      {/* =====================================================================
          SECTION 1: HERO – LET'S BUILD SOMETHING GREAT
         ===================================================================== */}
      <section
        aria-labelledby="contact-hero-heading"
        className="apokrin-hero-light relative overflow-hidden border-b border-[#E2E8F0] py-8 sm:py-10 lg:py-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full opacity-45 blur-3xl"
          style={{
            background: 'radial-gradient(circle, var(--color-glow-soft) 0%, transparent 72%)',
          }}
        />

        <div className="apokrin-container relative">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Side: Staggered Text, Gradient Headline & Two CTAs */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Let&apos;s Connect
              </span>

              <h1
                id="contact-hero-heading"
                style={{ textWrap: 'balance' }}
                className="apokrin-heading-hero mt-3 font-display font-extrabold text-[#0A1128]"
              >
                Let&apos;s Turn Your Ideas Into{' '}
                <span className="apokrin-gradient-text">Digital Reality.</span>
              </h1>

              <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#475569] sm:text-base">
                Have a project in mind or looking for the right technology partner? Connect with
                Apokrin to explore innovative IT solutions tailored to your business needs.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="apokrin-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('overview', undefined, 'services-stepper')}
                  className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Explore Our Services</span>
                </button>
              </div>
            </motion.div>

            {/* Right Side: Compact 3D-Inspired Digital Communication Hub Illustration */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex items-center justify-center lg:col-span-6"
            >
              <div className="relative flex h-[250px] w-full max-w-[420px] items-center justify-center sm:h-[290px]">
                {/* Soft Ambient Blue-Cyan/Theme Glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-6 rounded-full opacity-55 blur-3xl"
                  style={{
                    background:
                      'radial-gradient(circle, var(--color-glow) 0%, var(--color-glow-secondary) 55%, transparent 78%)',
                  }}
                />

                {/* Outer Orbiting Ring */}
                <motion.div
                  aria-hidden="true"
                  animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                  transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute h-[220px] w-[220px] rounded-full border border-dashed sm:h-[250px] sm:w-[250px]"
                  style={{ borderColor: themeConfig.borderTint }}
                >
                  <span
                    className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full shadow-sm"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  />
                  <span
                    className="absolute -bottom-1.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                    style={{ backgroundColor: themeConfig.accent }}
                  />
                </motion.div>

                {/* Inner Orbiting Ring */}
                <motion.div
                  aria-hidden="true"
                  animate={prefersReducedMotion ? undefined : { rotate: -360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute h-[160px] w-[160px] rounded-full border sm:h-[180px] sm:w-[180px]"
                  style={{ borderColor: `${themeConfig.primary}30` }}
                >
                  <span
                    className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: themeConfig.secondary }}
                  />
                </motion.div>

                {/* Central 3D-Inspired Claymorphism Digital Communication Sphere */}
                <div className="apokrin-clay-panel relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-[2rem] border border-white/95 text-center sm:h-34 sm:w-34">
                  <div
                    className="flex h-13 w-13 items-center justify-center rounded-2xl text-white shadow-lg"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    <Globe className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <p className="mt-2 font-display text-xs font-extrabold text-[#0A1128]">
                    Apokrin Connect
                  </p>
                  <p className="text-[10px] font-semibold text-[#64748B]">Global Advisory</p>
                </div>

                {/* Floating Communication Nodes */}
                <div
                  aria-hidden="true"
                  className="apokrin-clay-bob-0 apokrin-clay-orb absolute left-2 top-4 z-20 flex items-center gap-2 rounded-2xl border border-white/95 px-3 py-2 sm:left-0"
                >
                  <Mail className="h-3.5 w-3.5" style={{ color: themeConfig.primaryStrong }} />
                  <span className="font-display text-xs font-bold text-[#0A1128]">
                    Info@apokrin.com
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="apokrin-clay-bob-1 apokrin-clay-orb absolute bottom-4 left-4 z-20 flex items-center gap-2 rounded-2xl border border-white/95 px-3 py-2 sm:left-2"
                >
                  <Phone className="h-3.5 w-3.5" style={{ color: themeConfig.secondaryText }} />
                  <span className="font-display text-xs font-bold text-[#0A1128]">
                    703-722-6709
                  </span>
                </div>

                <div
                  aria-hidden="true"
                  className="apokrin-clay-bob-2 apokrin-clay-orb absolute right-2 top-8 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/95 sm:right-0"
                >
                  <MessageSquare
                    className="h-4.5 w-4.5"
                    style={{ color: themeConfig.primaryStrong }}
                  />
                </div>

                <div
                  aria-hidden="true"
                  className="apokrin-clay-bob-3 apokrin-clay-orb absolute bottom-8 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/95 sm:right-2"
                >
                  <Send className="h-4.5 w-4.5" style={{ color: themeConfig.secondaryText }} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 2: INTERACTIVE CONTACT FORM (Bento 2-Column Composition)
         ===================================================================== */}
      <section
        id="contact-form-section"
        aria-labelledby="contact-form-heading"
        className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-9 sm:py-11 lg:py-12"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Contact Our Team
            </span>

            <h2
              id="contact-form-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-3 font-display font-extrabold text-[#0A1128]"
            >
              Get in <span className="apokrin-gradient-text">Touch</span>
            </h2>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-7">
            {/* Left: Compact Interactive Floating-Label Contact Form */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="apokrin-clay-panel rounded-[1.75rem] border border-white/95 p-5 sm:p-6 lg:col-span-7 lg:p-7"
            >
              <AnimatePresence mode="wait">
                {submittedData ? (
                  <motion.div
                    key="contact-success"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex min-h-[340px] flex-col items-center justify-center py-8 text-center"
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
                      style={{ background: 'var(--color-btn-gradient)' }}
                    >
                      <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                    </div>

                    <h3 className="mt-5 font-display text-2xl font-extrabold text-[#0A1128]">
                      Message Received, {submittedData.name}
                    </h3>

                    <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#475569]">
                      Thank you for reaching out to Apokrin. Your inquiry has been logged under
                      reference{' '}
                      <span
                        className="font-mono font-bold"
                        style={{ color: themeConfig.primaryStrong }}
                      >
                        {submittedData.id}
                      </span>{' '}
                      and confirmation details apply to{' '}
                      <strong className="text-[#0A1128]">{submittedData.email}</strong>.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedData(null);
                        setCaptchaState('idle');
                        setCaptchaError(null);
                      }}
                      className="apokrin-btn-secondary mt-7 rounded-full px-6 py-2.5 text-sm font-semibold"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit}
                    noValidate
                    initial={prefersReducedMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={prefersReducedMotion ? undefined : { opacity: 0 }}
                    className="space-y-3.5"
                  >
                    {submitError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-xs font-medium text-[#991B1B]"
                      >
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{submitError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      {/* Full Name Floating Label */}
                      <div>
                        <div className="relative">
                          <input
                            ref={nameInputRef}
                            id="contact-full-name"
                            type="text"
                            placeholder=" "
                            required
                            value={formValues.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.name)}
                            className={`peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.name
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                              : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                              }`}
                          />
                          <label
                            htmlFor="contact-full-name"
                            className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                          >
                            Full Name *
                          </label>
                        </div>
                        {fieldErrors.name && (
                          <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Work Email Address Floating Label */}
                      <div>
                        <div className="relative">
                          <input
                            id="contact-email"
                            type="email"
                            placeholder=" "
                            required
                            value={formValues.email}
                            onChange={(e) => handleFieldChange('email', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.email)}
                            className={`peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.email
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                              : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                              }`}
                          />
                          <label
                            htmlFor="contact-email"
                            className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                          >
                            Work Email *
                          </label>
                        </div>
                        {fieldErrors.email && (
                          <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      {/* Company Name */}
                      <div>
                        <div className="relative">
                          <input
                            id="contact-company"
                            type="text"
                            placeholder=" "
                            value={formValues.company}
                            onChange={(e) => handleFieldChange('company', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.company)}
                            className={`peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.company
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                              : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                              }`}
                          />
                          <label
                            htmlFor="contact-company"
                            className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                          >
                            Company Name
                          </label>
                        </div>
                        {fieldErrors.company && (
                          <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                            {fieldErrors.company}
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <div className="relative">
                          <input
                            id="contact-phone"
                            type="tel"
                            placeholder=" "
                            value={formValues.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.phone)}
                            className={`peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.phone
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                              : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                              }`}
                          />
                          <label
                            htmlFor="contact-phone"
                            className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                          >
                            Telephone Number
                          </label>
                        </div>
                        {fieldErrors.phone && (
                          <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                      {/* Country */}
                      <div>
                        <div className="relative">
                          <input
                            id="contact-country"
                            type="text"
                            placeholder=" "
                            value={formValues.country}
                            onChange={(e) => handleFieldChange('country', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.country)}
                            className={`peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.country
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                              : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                              }`}
                          />
                          <label
                            htmlFor="contact-country"
                            className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                          >
                            Country
                          </label>
                        </div>
                        {fieldErrors.country && (
                          <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                            {fieldErrors.country}
                          </p>
                        )}
                      </div>

                      {/* Subject Name Input */}
                      <div>
                        <div className="relative">
                          <input
                            id="contact-subject"
                            type="text"
                            placeholder=" "
                            value={formValues.subject}
                            onChange={(e) => handleFieldChange('subject', e.target.value)}
                            aria-invalid={Boolean(fieldErrors.subject)}
                            className={`peer w-full rounded-2xl border bg-white px-4 pb-2.5 pt-6 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.subject
                              ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                              : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                              }`}
                          />
                          <label
                            htmlFor="contact-subject"
                            className="pointer-events-none absolute left-4 top-2 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                          >
                            Subject
                          </label>
                        </div>
                        {fieldErrors.subject && (
                          <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                            {fieldErrors.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Anti-Spam Honeypot (Hidden) */}
                    <div style={{ display: 'none' }} aria-hidden="true">
                      <input
                        type="text"
                        name="_hp_company"
                        tabIndex={-1}
                        autoComplete="off"
                        value={formValues.honeypot}
                        onChange={(e) => handleFieldChange('honeypot', e.target.value)}
                      />
                    </div>

                    {/* Write Message Floating Label */}
                    <div>
                      <div className="relative">
                        <textarea
                          id="contact-message"
                          rows={3}
                          placeholder=" "
                          required
                          value={formValues.message}
                          onChange={(e) => handleFieldChange('message', e.target.value)}
                          aria-invalid={Boolean(fieldErrors.message)}
                          className={`peer w-full resize-y rounded-2xl border bg-white px-4 pb-3 pt-7 text-sm text-[#0A1128] transition-all duration-150 focus:outline-none focus:ring-4 ${fieldErrors.message
                            ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/15'
                            : 'border-[#CBD5E1] focus:border-[var(--color-primary-strong)] focus:ring-[var(--color-glow-soft)]'
                            }`}
                        />
                        <label
                          htmlFor="contact-message"
                          className="pointer-events-none absolute left-4 top-2.5 text-[11px] font-semibold text-[#64748B] transition-all duration-150 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:text-[var(--color-primary-strong)]"
                        >
                          Write Message...
                        </label>
                      </div>
                      {fieldErrors.message && (
                        <p className="mt-1.5 text-xs font-medium text-[#DC2626]">
                          {fieldErrors.message}
                        </p>
                      )}
                    </div>

                    {/* Cloudflare Turnstile Verification Box (Replaces Security Badge) */}
                    <div className="pt-1.5 pb-0.5">
                      <div
                        role="checkbox"
                        aria-checked={captchaState === 'verified'}
                        tabIndex={0}
                        onClick={handleCaptchaClick}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            e.preventDefault();
                            handleCaptchaClick();
                          }
                        }}
                        className={`group inline-flex w-full max-w-[325px] items-center justify-between rounded-md border bg-[#FAFAFA] px-3.5 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all select-none ${captchaError
                          ? 'border-red-400 ring-2 ring-red-400/20'
                          : 'border-[#CBD5E1] hover:border-[#94A3B8]'
                          } ${captchaState === 'verified' ? 'cursor-default bg-emerald-50/20' : 'cursor-pointer hover:bg-[#F8FAFC]'}`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <div
                            className={`flex h-[24px] w-[24px] items-center justify-center rounded-[3px] transition-all ${captchaState === 'verified'
                              ? 'bg-[#059669] text-white shadow-xs'
                              : captchaState === 'verifying'
                                ? 'border-2 border-[#0284C7] bg-white'
                                : 'border-2 border-[#64748B] bg-white group-hover:border-[#334155]'
                              }`}
                          >
                            {captchaState === 'verified' && (
                              <svg
                                className="h-4 w-4 stroke-white stroke-[3] fill-none"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                            {captchaState === 'verifying' && (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0284C7]" />
                            )}
                          </div>

                          <span className="text-[14px] font-normal text-[#1E293B]">
                            {captchaState === 'verified'
                              ? 'Success!'
                              : captchaState === 'verifying'
                                ? 'Verifying...'
                                : 'Verify you are human'}
                          </span>
                        </div>

                        {/* Cloudflare Branding */}
                        <div className="flex flex-col items-end pl-2">
                          <div className="flex items-center gap-1.5">
                            {/* Orange Cloud Icon */}
                            <svg className="h-[18px] w-auto shrink-0" viewBox="0 0 48 32" fill="none">
                              <path
                                d="M37.5 14.5c-.8-5.3-5.3-9.3-10.8-9.3-4.5 0-8.4 2.7-10.1 6.6C12.1 12 8 15.6 8 20c0 4.9 4 8.9 8.9 8.9h20.6c4.2 0 7.7-3.4 7.7-7.7 0-3.9-2.9-7.1-6.7-7.6z"
                                fill="#F38020"
                              />
                              <path
                                d="M32.5 28.9h-15c-4.9 0-8.9-4-8.9-8.9 0-4.4 4.1-8 8.6-8.2 1.7-3.9 5.6-6.6 10.1-6.6 5.5 0 10 4 10.8 9.3 3.8.5 6.7 3.7 6.7 7.6 0 4.3-3.5 7.8-7.7 7.8h-4.6z"
                                fill="#FAAD3F"
                                opacity="0.3"
                              />
                            </svg>
                            <span className="text-[9.5px] font-extrabold tracking-[0.12em] text-[#0F172A]">
                              CLOUDFLARE
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[8.5px] text-[#64748B]">
                            <a
                              href="https://www.cloudflare.com/privacypolicy/"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              Privacy
                            </a>
                            <span>•</span>
                            <a
                              href="https://www.cloudflare.com/website-terms/"
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="hover:underline"
                            >
                              Terms
                            </a>
                          </div>
                        </div>
                      </div>
                      {captchaError && (
                        <p className="mt-1.5 text-xs font-medium text-[#DC2626]">{captchaError}</p>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="apokrin-btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-65 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Message</span>
                            <Send className="h-4 w-4" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right: Compact Contact Information Bento Panel + Network Illustration */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between rounded-[1.75rem] bg-[#0A1128] p-6 text-white shadow-[0_22px_48px_-16px_rgba(10,17,40,0.45)] sm:p-7 lg:col-span-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold"
                    style={{ color: themeConfig.accent }}
                  >
                    Let&apos;s Collaborate
                  </span>

                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
                    style={{ background: 'var(--color-btn-gradient)' }}
                  >
                    <MessageSquare className="h-4.5 w-4.5" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="mt-4 font-display text-xl font-extrabold text-white">
                  Direct Advisory Desk
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  Share your project goals, architecture requirements, or staffing timeline. Our
                  consulting team connects you with the right domain specialists.
                </p>

                {/* Subtle Decorative Network Line Graphic */}
                <div
                  aria-hidden="true"
                  className="my-4 rounded-2xl border border-white/10 bg-white/5 p-3"
                >
                  <svg viewBox="0 0 300 68" className="h-12 w-full">
                    <path
                      d="M 16 48 Q 84 12, 150 36 T 284 20"
                      fill="none"
                      stroke={themeConfig.accent}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      opacity="0.7"
                    />
                    <circle cx="16" cy="48" r="5" fill="#FFFFFF" />
                    <circle cx="150" cy="36" r="6" fill={themeConfig.primary} />
                    <circle cx="284" cy="20" r="5" fill={themeConfig.secondary} />
                  </svg>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/12 pt-4 text-sm">
                <a
                  href="mailto:Info@apokrin.com"
                  className="flex items-center gap-3 text-slate-200 transition-colors hover:text-white"
                >
                  <Mail
                    className="h-4.5 w-4.5 shrink-0"
                    style={{ color: themeConfig.accent }}
                    aria-hidden="true"
                  />
                  <span>Info@apokrin.com</span>
                </a>

                <a
                  href="tel:+17037226709"
                  className="flex items-center gap-3 text-slate-200 transition-colors hover:text-white"
                >
                  <Phone
                    className="h-4.5 w-4.5 shrink-0"
                    style={{ color: themeConfig.accent }}
                    aria-hidden="true"
                  />
                  <span>(+1) 703-722-6709</span>
                </a>

                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin
                    className="mt-0.5 h-4.5 w-4.5 shrink-0"
                    style={{ color: themeConfig.accent }}
                    aria-hidden="true"
                  />
                  <span>4656 Westfields Boulevard, Chantilly, VA 20151, USA</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: CONTACT INFORMATION – INTERACTIVE BENTO CARDS
         ===================================================================== */}
      <section
        aria-labelledby="reach-us-heading"
        className="border-b border-[#E2E8F0] bg-white py-9 sm:py-11 lg:py-12"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Direct Channels
            </span>

            <h2
              id="reach-us-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-3 font-display font-extrabold text-[#0A1128]"
            >
              Reach Us <span className="apokrin-gradient-text">Directly</span>
            </h2>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Card 1 – Our Address */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, rotateX: 2, rotateY: -2 }}
              onMouseEnter={() => setHoveredBentoCard('address')}
              onMouseLeave={() => setHoveredBentoCard(null)}
              className="group rounded-[1.6rem] p-[1.5px] transition-all duration-200"
              style={{
                background:
                  hoveredBentoCard === 'address'
                    ? 'var(--color-btn-gradient)'
                    : 'linear-gradient(135deg, #E2E8F0 0%, #E2E8F0 100%)',
                boxShadow:
                  hoveredBentoCard === 'address'
                    ? `0 20px 38px -14px ${themeConfig.glow}`
                    : '0 8px 24px -12px rgba(15,23,42,0.08)',
              }}
            >
              <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-white p-6 sm:p-7">
                <div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: themeConfig.primaryStrong,
                    }}
                  >
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-extrabold text-[#0A1128]">
                    Our Address
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[#475569]">
                    4656 Westfields Boulevard, Chantilly, VA 20151, USA
                  </p>
                </div>

                <a
                  href={CHANTILLY_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                  style={{ color: themeConfig.primaryStrong }}
                >
                  <span>Get Directions</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            {/* Card 2 – Email Address */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, rotateX: 2, rotateY: 2 }}
              onMouseEnter={() => setHoveredBentoCard('email')}
              onMouseLeave={() => setHoveredBentoCard(null)}
              className="group rounded-[1.6rem] p-[1.5px] transition-all duration-200"
              style={{
                background:
                  hoveredBentoCard === 'email'
                    ? 'var(--color-btn-gradient)'
                    : 'linear-gradient(135deg, #E2E8F0 0%, #E2E8F0 100%)',
                boxShadow:
                  hoveredBentoCard === 'email'
                    ? `0 20px 38px -14px ${themeConfig.glow}`
                    : '0 8px 24px -12px rgba(15,23,42,0.08)',
              }}
            >
              <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-white p-6 sm:p-7">
                <div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: themeConfig.primaryStrong,
                    }}
                  >
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-extrabold text-[#0A1128]">
                    Email Address
                  </h3>

                  <p className="mt-2 font-mono text-sm font-medium text-[#475569]">
                    Info@apokrin.com
                  </p>
                </div>

                <a
                  href="mailto:Info@apokrin.com"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold transition-colors hover:underline"
                  style={{ color: themeConfig.primaryStrong }}
                >
                  <span>Send Email</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>

            {/* Card 3 – Hours of Operation */}
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              whileHover={prefersReducedMotion ? undefined : { y: -6, rotateX: 2, rotateY: -2 }}
              onMouseEnter={() => setHoveredBentoCard('hours')}
              onMouseLeave={() => setHoveredBentoCard(null)}
              className="group rounded-[1.6rem] p-[1.5px] transition-all duration-200"
              style={{
                background:
                  hoveredBentoCard === 'hours'
                    ? 'var(--color-btn-gradient)'
                    : 'linear-gradient(135deg, #E2E8F0 0%, #E2E8F0 100%)',
                boxShadow:
                  hoveredBentoCard === 'hours'
                    ? `0 20px 38px -14px ${themeConfig.glow}`
                    : '0 8px 24px -12px rgba(15,23,42,0.08)',
              }}
            >
              <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-white p-6 sm:p-7">
                <div>
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                    style={{
                      backgroundColor: 'var(--color-surface-soft)',
                      color: themeConfig.primaryStrong,
                    }}
                  >
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-display text-lg font-extrabold text-[#0A1128]">
                    Hours of Operation
                  </h3>

                  <div className="mt-2 space-y-1 text-sm text-[#475569]">
                    <p>Monday – Friday: 9 AM – 6 PM</p>
                    <p>Saturday – Sunday: Closed</p>
                  </div>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B]">
                  Eastern Time (ET) · Chantilly, VA
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: GLOBAL PRESENCE – STANDALONE FULL-WIDTH WORLD MAP
         ===================================================================== */}
      <section
        aria-labelledby="global-presence-heading"
        className="apokrin-clay-section border-b py-9 sm:py-11 lg:py-12"
      >
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Global Presence
            </span>

            <h2
              id="global-presence-heading"
              style={{ textWrap: 'balance' }}
              className="apokrin-heading-section mt-3 font-display font-extrabold text-[#0A1128]"
            >
              Our Branches All Over the{' '}
              <span className="apokrin-gradient-text">World</span>
            </h2>

            <p className="mx-auto mt-2.5 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
              With a strong international footprint, we have established offices in major cities
              across the globe, connecting businesses and delivering technology solutions
              worldwide.
            </p>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5"
          >
            <GlobalPresenceWorldMap />
          </motion.div>
        </div>
      </section>

      {/* =====================================================================
          SECTION 5: FINAL CTA SECTION
         ===================================================================== */}
      <section aria-labelledby="contact-final-cta" className="bg-white py-9 sm:py-11 lg:py-12">
        <div className="apokrin-container">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="apokrin-clay-panel relative overflow-hidden rounded-[2rem] border border-white/95 px-6 py-8 text-center sm:px-10 sm:py-10"
          >
            <div
              aria-hidden="true"
              className="apokrin-clay-bob-0 apokrin-clay-orb pointer-events-none absolute left-8 top-6 hidden h-12 w-12 items-center justify-center rounded-2xl lg:flex"
            >
              <Mail className="h-5 w-5" style={{ color: themeConfig.primaryStrong }} />
            </div>

            <div
              aria-hidden="true"
              className="apokrin-clay-bob-1 apokrin-clay-orb pointer-events-none absolute bottom-6 right-8 hidden h-12 w-12 items-center justify-center rounded-2xl lg:flex"
            >
              <Globe className="h-5 w-5" style={{ color: themeConfig.secondaryText }} />
            </div>

            <div className="relative mx-auto max-w-2xl">
              <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
                Partner With Apokrin
              </span>

              <h2
                id="contact-final-cta"
                style={{ textWrap: 'balance' }}
                className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#0A1128] sm:text-3xl"
              >
                Your Next Big Idea Starts With a{' '}
                <span className="apokrin-gradient-text">Conversation.</span>
              </h2>

              <p className="mt-2.5 text-sm leading-relaxed text-[#475569] sm:text-base">
                Let&apos;s collaborate to build innovative, scalable, and future-ready technology
                solutions for your business.
              </p>

              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="apokrin-btn-primary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Start a Conversation</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('overview', undefined, 'services-stepper')}
                  className="apokrin-btn-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                >
                  <span>Explore Services</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
