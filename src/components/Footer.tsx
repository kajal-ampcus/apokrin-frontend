import { useState } from 'react';
import { ArrowRight, Mail, MapPin, Phone, X } from 'lucide-react';
import { PracticeArea, ScreenId } from '../data/apokrinData';
import { SERVICES_CONFIG } from '../data/servicesConfig';

interface FooterProps {
  onNavigate: (screen: ScreenId, practice?: PracticeArea, sectionId?: string) => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

const FOOTER_SERVICES: {
  label: string;
  screen: ScreenId;
  practice?: PracticeArea;
}[] = SERVICES_CONFIG.map((service) => ({
  label: service.name,
  screen: service.id,
}));

function ApokrinOriginalFooterLogo() {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="inline-flex items-center gap-3">
      {imgFailed ? (
        <span className="font-display text-2xl font-extrabold tracking-tight text-white">
          Apokrin
        </span>
      ) : (
        <div className="inline-flex items-center rounded-xl bg-white px-3.5 py-1.5 shadow-[0_8px_22px_rgba(4,8,18,0.45)]">
          <img
            src="/assets/aistudio/image_e1054fa1.png"
            alt="Apokrin logo"
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="h-9 w-auto object-contain select-none"
          />
        </div>
      )}
    </div>
  );
}

const SOCIAL_LINKS = [
  {
    id: 'x',
    label: 'Apokrin on X',
    href: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Apokrin on Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1V11H7.7v3h2.6v8h3.2z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Apokrin on Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'Apokrin on LinkedIn',
    href: 'https://linkedin.com',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
      </svg>
    ),
  },
];

export function Footer({ onNavigate, onOpenBriefing }: FooterProps) {
  const [policyModal, setPolicyModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer
      id="contact-footer"
      className="relative z-10 overflow-hidden border-t border-[#22304A] bg-[#101827] text-white"
    >
      {/* Subtle theme-aware ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full opacity-25 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--color-primary) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-12 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)',
        }}
      />

      <div className="apokrin-container relative pt-14 pb-8">
        {/* Four-Column Corporate Footer Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1 – Company Information */}
          <div className="lg:col-span-4">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-xl"
            >
              <ApokrinOriginalFooterLogo />
            </button>

            <div className="mt-6 space-y-3 text-sm text-[#A9B7CC]">
              <div className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: 'var(--color-accent)' }}
                />
                <address className="not-italic leading-relaxed">
                  4656 Westfields Boulevard,
                  <br />
                  Chantilly VA 20151
                </address>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0"
                  style={{ color: 'var(--color-accent)' }}
                />
                <a
                  href="tel:+17037226709"
                  className="transition-colors hover:text-white"
                >
                  (+1) 703-722-6709
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0"
                  style={{ color: 'var(--color-accent)' }}
                />
                <a
                  href="mailto:Info@apokrin.com"
                  className="transition-colors hover:text-white"
                >
                  Info@apokrin.com
                </a>
              </div>
            </div>

            {/* Social Media Icons inside Dark Claymorphism Containers */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#24324B] bg-[#172338] text-[#A9B7CC] shadow-[4px_6px_14px_rgba(4,8,18,0.55),inset_0_1px_1px_rgba(255,255,255,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 – Useful Links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Useful Links
            </h3>
            <div
              aria-hidden="true"
              className="mt-2 h-0.5 w-8 rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
              }}
            />
            <ul className="mt-5 space-y-3 text-sm text-[#A9B7CC]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('overview')}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setPolicyModal('privacy')}
                  className="transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 – Our Services */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Our Services
            </h3>
            <div
              aria-hidden="true"
              className="mt-2 h-0.5 w-8 rounded-full"
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
              }}
            />
            <ul className="mt-5 space-y-2.5 text-sm text-[#A9B7CC]">
              {FOOTER_SERVICES.map((svc) => (
                <li key={svc.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(svc.screen, svc.practice)}
                    className="text-left transition-colors hover:text-white focus-visible:outline-none focus-visible:underline"
                  >
                    {svc.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 – Contact / Let's Connect */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-[#24324B] bg-[#172338] p-6 shadow-[10px_14px_30px_rgba(4,8,18,0.55),inset_0_1px_2px_rgba(255,255,255,0.08)]">
              <h3 className="font-display text-base font-bold text-white">
                Let&apos;s Connect
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-[#A9B7CC]">
                Ready to modernize your enterprise IT systems, cloud platforms, or staffing
                frameworks? Connect with our team.
              </p>

              <button
                type="button"
                onClick={() => onOpenBriefing()}
                className="apokrin-btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <span>Contact Us</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-4 border-t border-[#24324B] pt-4 text-xs text-[#A9B7CC]">
                <span className="block text-[11px] uppercase tracking-wider text-[#7D8FA9]">
                  Direct Email
                </span>
                <a
                  href="mailto:Info@apokrin.com"
                  className="mt-1 inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-[var(--color-accent)]"
                >
                  <Mail className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
                  <span>Info@apokrin.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#22304A] pt-6 text-xs text-[#A9B7CC] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright © 2026 Apokrin. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => setPolicyModal('privacy')}
              className="transition-colors hover:text-white"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setPolicyModal('terms')}
              className="transition-colors hover:text-white"
            >
              Terms &amp; Conditions
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal for Privacy Policy & Terms & Conditions */}
      {policyModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-policy-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A1128]/65 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#24324B] bg-[#172338] p-6 text-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#24324B] pb-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Apokrin
                </p>
                <h4
                  id="footer-policy-title"
                  className="mt-1 font-display text-xl font-bold text-white"
                >
                  {policyModal === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                aria-label="Close legal information dialog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A3B59] bg-[#101827] text-[#A9B7CC] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#A9B7CC]">
              {policyModal === 'privacy' ? (
                <>
                  <p>
                    Apokrin respects the privacy of visitors, clients, and partners. Information
                    submitted through briefing or contact requests is used solely to respond to
                    service inquiries and coordinate enterprise consultations.
                  </p>
                  <p>
                    For questions regarding data stewardship or privacy practices, contact us at{' '}
                    <a href="mailto:Info@apokrin.com" className="text-white underline">
                      Info@apokrin.com
                    </a>{' '}
                    or 4656 Westfields Boulevard, Chantilly VA 20151.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Use of the Apokrin website and informational materials is subject to applicable
                    commercial and government engagement terms established in writing with Apokrin.
                  </p>
                  <p>
                    For engagement terms or procurement documentation, reach out to{' '}
                    <a href="mailto:Info@apokrin.com" className="text-white underline">
                      Info@apokrin.com
                    </a>{' '}
                    or (+1) 703-722-6709.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-[#24324B] pt-4">
              <button
                type="button"
                onClick={() => setPolicyModal(null)}
                className="apokrin-btn-primary rounded-lg px-4 py-2 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
