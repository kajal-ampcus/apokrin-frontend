import { useState } from 'react';
import { ArrowRight, Trash2 } from 'lucide-react';
import { BriefingRequest } from '../data/apokrinData';

interface EngagementsScreenProps {
  briefings: BriefingRequest[];
  onCancelBriefing: (id: string) => void;
  onContactClick: () => void;
}

export function EngagementsScreen({
  briefings,
  onCancelBriefing,
  onContactClick,
}: EngagementsScreenProps) {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const visibleBriefings = briefings.filter((b) =>
    filterStatus === 'All' ? true : b.status === filterStatus,
  );

  return (
    <div className="apokrin-container py-12">
      <div className="border-b border-[#E2E8F0] pb-8">
        <p className="text-xs font-semibold text-[var(--color-secondary-text)]">
          Executive Advisory &amp; Intake
        </p>
        <h1
          style={{ textWrap: 'balance' }}
          className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0A1128] sm:text-4xl"
        >
          Manage scheduled briefings and initiate new engagements.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base">
          Review active executive briefing requests or reach out through our Contact Us page to
          coordinate directly with an Apokrin practice director.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Left: Scheduled Briefings Queue */}
        <div className="lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-xl font-bold text-[#0A1128]">
              Scheduled Advisory Queue
            </h2>
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {['All', 'Confirmed', 'Pending Review'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                    filterStatus === status
                      ? 'bg-[var(--color-primary-strong)] text-white'
                      : 'text-[#475569] hover:text-[#0A1128]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {visibleBriefings.length === 0 ? (
            <div className="apokrin-card mt-5 rounded-2xl p-10 text-center">
              <p className="font-display text-base font-bold text-[#0A1128]">
                No briefings in this view
              </p>
              <p className="mt-1 text-sm text-[#475569]">
                Visit our Contact Us page to schedule a new architecture or staffing review.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {visibleBriefings.map((item) => (
                <article key={item.id} className="apokrin-card rounded-2xl p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#64748B]">
                        <span className="font-mono font-semibold text-[var(--color-primary-strong)]">
                          {item.id.toUpperCase()}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.practice}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.submittedAt}</span>
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold text-[#0A1128]">
                        {item.organization}
                      </h3>
                      <p className="text-xs text-[#64748B]">
                        {item.executiveName} · {item.role} · {item.workEmail}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold ${
                          item.status === 'Confirmed'
                            ? 'text-[var(--color-secondary-text)]'
                            : 'text-[#EA580C]'
                        }`}
                      >
                        {item.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCancelBriefing(item.id)}
                        aria-label={`Cancel briefing ${item.id}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#FCA5A5] hover:text-[#DC2626]"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#475569]">{item.brief}</p>

                  <div className="mt-4 border-t border-[#E2E8F0] pt-3 text-xs text-[#64748B]">
                    Target Window:{' '}
                    <span className="font-semibold text-[#0A1128]">{item.timeline}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right: Redirect Card to Contact Us Page */}
        <div className="apokrin-card rounded-2xl p-6 sm:p-8 lg:col-span-5">
          <h2 className="font-display text-xl font-bold text-[#0A1128]">Start a New Inquiry</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#475569]">
            Submit your project scope, ATS/VMS staffing goals, or enterprise consultation request
            through our dedicated Contact Us page.
          </p>

          <button
            type="button"
            onClick={onContactClick}
            className="apokrin-btn-primary mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
          >
            <span>Go to Contact Us</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
