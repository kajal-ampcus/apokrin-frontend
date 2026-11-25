import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { APOKRIN_FAQS } from '../data/apokrinData';

function ClayQuestionIllustration() {
  return (
    <div
      aria-hidden="true"
      className="apokrin-clay-panel relative mt-8 hidden max-w-[260px] rounded-[1.75rem] border border-white/90 p-5 lg:block"
    >
      <div className="flex items-center gap-4">
        <div
          className="apokrin-clay-bob-0 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: 'var(--color-btn-gradient)',
            boxShadow:
              '6px 10px 20px var(--color-glow), inset 0 2px 5px rgba(255,255,255,0.45)',
          }}
        >
          <span className="font-display text-3xl font-extrabold text-white">?</span>
        </div>
        <div className="space-y-2">
          <div
            className="h-2.5 w-28 rounded-full opacity-40"
            style={{
              background:
                'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
            }}
          />
          <div
            className="h-2.5 w-20 rounded-full"
            style={{ backgroundColor: 'var(--color-track)' }}
          />
          <div
            className="h-2.5 w-24 rounded-full"
            style={{ backgroundColor: 'var(--color-surface-alt)' }}
          />
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(APOKRIN_FAQS[0]?.id ?? null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleToggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="apokrin-surface-faq-section relative overflow-hidden border-t border-[#E2E8F0]"
    >
      {/* Subtle ambient Claymorphism floating shapes */}
      <div
        aria-hidden="true"
        className="apokrin-geo-float-delayed apokrin-clay-orb pointer-events-none absolute -right-8 top-20 hidden h-20 w-20 rounded-full opacity-80 lg:block"
      />
      <div
        aria-hidden="true"
        className="apokrin-geo-float apokrin-clay-orb pointer-events-none absolute bottom-14 left-6 hidden h-14 w-14 rotate-12 rounded-2xl opacity-80 lg:block"
      />

      <div className="apokrin-container relative py-14 lg:py-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Intro, Heading, Supporting Copy & Clay Illustration */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <span className="apokrin-badge inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold">
              Frequently Asked Questions
            </span>

            <h2
              id="faq-heading"
              style={{ textWrap: 'balance' }}
              className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#0A1128] sm:text-4xl"
            >
              Got Questions?{' '}
              <span className="apokrin-gradient-text">We&apos;ve Got Answers!</span>
            </h2>

            <p className="mt-4 max-w-md text-base leading-relaxed text-[#475569]">
              Wondering what we do, who we help, or how to get in touch? You&rsquo;re in the right
              place. Check out these quick answers to learn more about Apokrin and how we can work
              together.
            </p>

            <ClayQuestionIllustration />
          </motion.div>

          {/* Right Column: Five Interactive Claymorphism FAQ Accordion Items */}
          <div className="space-y-4 lg:col-span-7">
            {APOKRIN_FAQS.map((item, idx) => {
              const isOpen = openId === item.id;
              const panelId = `faq-answer-${item.id}`;
              const triggerId = `faq-trigger-${item.id}`;

              return (
                <motion.div
                  key={item.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.42,
                    delay: idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`rounded-2xl p-[1.5px] transition-all duration-300 ${
                    isOpen ? '' : 'hover:-translate-y-0.5'
                  }`}
                  style={{
                    background: isOpen
                      ? 'linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent) 50%, var(--color-secondary) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.96) 0%, var(--color-track) 100%)',
                    boxShadow: isOpen
                      ? '12px 18px 36px var(--color-clay-shadow-strong), -6px -6px 18px rgba(255,255,255,0.95)'
                      : '8px 12px 24px var(--color-clay-shadow), -5px -5px 14px rgba(255,255,255,0.92)',
                  }}
                >
                  <div
                    className="rounded-[calc(1rem-1.5px)] transition-colors duration-300"
                    style={{
                      background: isOpen
                        ? 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface) 52%, var(--color-surface-soft) 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface) 100%)',
                      boxShadow: 'inset 0 2px 6px rgba(255,255,255,1)',
                    }}
                  >
                    <h3>
                      <button
                        type="button"
                        id={triggerId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => handleToggle(item.id)}
                        className="flex w-full items-center justify-between gap-4 rounded-[calc(1rem-1.5px)] px-5 py-4 text-left sm:px-6 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-strong)] focus-visible:ring-offset-2"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-xs font-bold transition-all duration-300 ${
                              isOpen ? 'text-white' : ''
                            }`}
                            style={
                              isOpen
                                ? {
                                    background: 'var(--color-btn-gradient)',
                                    boxShadow: '0 4px 12px var(--color-glow)',
                                  }
                                : {
                                    backgroundColor: 'var(--color-surface-soft)',
                                    color: 'var(--color-primary-strong)',
                                  }
                            }
                          >
                            0{idx + 1}
                          </span>
                          <span
                            className="font-display text-base font-bold tracking-tight transition-colors sm:text-[1.0625rem]"
                            style={{
                              color: isOpen ? 'var(--color-primary-strong)' : '#0A1128',
                            }}
                          >
                            {item.question}
                          </span>
                        </div>

                        <span
                          aria-hidden="true"
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                            isOpen ? 'text-white' : 'text-[#475569]'
                          }`}
                          style={
                            isOpen
                              ? {
                                  background: 'var(--color-btn-gradient)',
                                  boxShadow: '0 4px 12px var(--color-glow)',
                                }
                              : {
                                  background:
                                    'linear-gradient(135deg, #FFFFFF 0%, var(--color-surface) 100%)',
                                  boxShadow:
                                    '4px 6px 12px var(--color-clay-shadow), inset 0 1px 3px rgba(255,255,255,1)',
                                }
                          }
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-labelledby={triggerId}
                          initial={
                            prefersReducedMotion
                              ? { opacity: 1, height: 'auto' }
                              : { opacity: 0, height: 0 }
                          }
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={
                            prefersReducedMotion
                              ? { opacity: 0, height: 0 }
                              : { opacity: 0, height: 0 }
                          }
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.28,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-[#E2E8F0]/80 px-5 pb-5 pt-3.5 sm:px-6 sm:pb-6 sm:pl-[4.25rem]">
                            <p className="text-sm leading-relaxed text-[#475569] sm:text-[0.95rem]">
                              {item.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
