import { useMemo, useState } from 'react';
import { ArrowRight, Check, Plus, Search, Users, X } from 'lucide-react';
import { PracticeArea, TALENT_PROFILES, TalentProfile } from '../data/apokrinData';

interface TalentScreenProps {
  shortlistIds: string[];
  onToggleShortlist: (id: string) => void;
  onClearShortlist: () => void;
  onOpenBriefing: (practice?: PracticeArea, brief?: string) => void;
}

const PRACTICES: (PracticeArea | 'All')[] = [
  'All',
  'Applied AI',
  'Cloud Engineering',
  'Data Platforms',
  'Security & FinOps',
];

export function TalentScreen({
  shortlistIds,
  onToggleShortlist,
  onClearShortlist,
  onOpenBriefing,
}: TalentScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [practiceFilter, setPracticeFilter] = useState<PracticeArea | 'All'>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredProfiles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return TALENT_PROFILES.filter((profile) => {
      if (practiceFilter !== 'All' && profile.practice !== practiceFilter) return false;
      if (availabilityFilter !== 'All' && profile.availability !== availabilityFilter) return false;
      if (regionFilter !== 'All' && profile.region !== regionFilter) return false;
      if (!q) return true;
      return (
        profile.name.toLowerCase().includes(q) ||
        profile.role.toLowerCase().includes(q) ||
        profile.stack.some((tech) => tech.toLowerCase().includes(q)) ||
        profile.city.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, practiceFilter, availabilityFilter, regionFilter]);

  const shortlistedProfiles = useMemo(
    () => TALENT_PROFILES.filter((p) => shortlistIds.includes(p.id)),
    [shortlistIds],
  );

  const combinedDailyRate = useMemo(
    () => shortlistedProfiles.reduce((sum, p) => sum + p.dailyRateUsd, 0),
    [shortlistedProfiles],
  );

  const resetFilters = () => {
    setSearchQuery('');
    setPracticeFilter('All');
    setAvailabilityFilter('All');
    setRegionFilter('All');
  };

  const handleRequestShortlist = () => {
    const names = shortlistedProfiles.map((p) => `${p.name} (${p.role})`).join('; ');
    const firstPractice = shortlistedProfiles[0]?.practice ?? 'Applied AI';
    setDrawerOpen(false);
    onOpenBriefing(
      firstPractice,
      `Shortlist requisition for ${shortlistedProfiles.length} principal engineer(s): ${names}.`,
    );
  };

  return (
    <div className="apokrin-container py-12">
      {/* Screen Header */}
      <div className="flex flex-col gap-6 border-b border-[#E2E8F0] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[var(--color-secondary-text)]">Global Principal Bench</p>
          <h1
            style={{ textWrap: 'balance' }}
            className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0A1128] sm:text-4xl"
          >
            Vetted principal architects and staff systems engineers.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Every engineer on the Apokrin bench has shipped multi-region production infrastructure.
            Build a shortlist and confirm interview availability within 48 hours.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="apokrin-btn-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 self-start lg:self-auto"
        >
          <Users className="h-4 w-4" />
          <span className="tabular-nums">Shortlist ({shortlistedProfiles.length})</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="apokrin-card mt-8 grid grid-cols-1 gap-4 rounded-2xl p-4 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-4">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, Rust, Kubernetes, city..."
            aria-label="Search principal talent"
            className="apokrin-input w-full py-2.5 pl-10 pr-3.5 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 lg:col-span-5">
          {PRACTICES.map((practice) => {
            const active = practiceFilter === practice;
            return (
              <button
                key={practice}
                type="button"
                onClick={() => setPracticeFilter(practice)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'bg-[var(--color-primary-strong)] text-white' : 'text-[#475569] hover:text-[#0A1128]'
                }`}
              >
                {practice}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:col-span-3">
          <select
            aria-label="Filter by availability"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="apokrin-input w-full px-3 py-2 text-xs font-medium"
          >
            <option value="All">All Availability</option>
            <option value="Immediate (48h)">Immediate (48h)</option>
            <option value="2 Weeks">2 Weeks</option>
          </select>

          <select
            aria-label="Filter by region"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="apokrin-input w-full px-3 py-2 text-xs font-medium"
          >
            <option value="All">All Regions</option>
            <option value="North America">North America</option>
            <option value="EMEA">EMEA</option>
            <option value="APAC">APAC</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mt-6 flex items-center justify-between text-xs text-[#64748B]">
        <span className="font-mono tabular-nums">
          {filteredProfiles.length} principal profile{filteredProfiles.length === 1 ? '' : 's'} matching criteria
        </span>
        {(searchQuery || practiceFilter !== 'All' || availabilityFilter !== 'All' || regionFilter !== 'All') && (
          <button
            type="button"
            onClick={resetFilters}
            className="font-semibold text-[var(--color-primary-strong)] hover:opacity-80 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Two-Part Talent & Solution Profile Cards */}
      {filteredProfiles.length === 0 ? (
        <div className="apokrin-card mt-6 rounded-2xl p-12 text-center">
          <p className="font-display text-lg font-bold text-[#0A1128]">
            No matching principal profiles found
          </p>
          <p className="mt-2 text-sm text-[#475569]">
            Adjust your practice, availability, or stack filters—or request a custom 48-hour sourcing
            shortlist from our delivery desk.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="apokrin-btn-secondary rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Clear All Filters
            </button>
            <button
              type="button"
              onClick={() => onOpenBriefing('Cloud Engineering')}
              className="apokrin-btn-primary rounded-lg px-4 py-2 text-sm font-semibold"
            >
              Request Custom Shortlist
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {filteredProfiles.map((profile: TalentProfile) => {
            const isShortlisted = shortlistIds.includes(profile.id);
            const isImmediate = profile.availability === 'Immediate (48h)';
            return (
              <article
                key={profile.id}
                className="apokrin-card apokrin-card-interactive rounded-2xl p-6 sm:p-7"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
                  {/* Left Part: Technical Competency Metrics */}
                  <div className="flex flex-col justify-between lg:col-span-4 lg:pr-6">
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xs font-semibold text-[var(--color-secondary-text)]">
                          {profile.practice}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isImmediate ? 'text-[#EA580C]' : 'text-[var(--color-secondary-text)]'
                          }`}
                        >
                          {profile.availability}
                        </span>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs text-[#64748B]">{profile.primaryMetricLabel}</p>
                        <p className="mt-1 font-display text-2xl font-extrabold text-[#0A1128] tabular-nums">
                          {profile.primaryMetricValue}
                        </p>
                      </div>

                      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[#E2E8F0] pt-4 text-xs tabular-nums">
                        <div>
                          <dt className="text-[#64748B]">Experience</dt>
                          <dd className="mt-0.5 font-mono font-semibold text-[#0A1128]">
                            {profile.yearsExperience} yrs
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">Shipped</dt>
                          <dd className="mt-0.5 font-mono font-semibold text-[#0A1128]">
                            {profile.systemsDelivered} sys
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#64748B]">Reliability</dt>
                          <dd className="mt-0.5 font-mono font-semibold text-[var(--color-secondary-text)]">
                            {profile.uptimeRecord}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-5 border-t border-[#E2E8F0] pt-4 flex items-baseline justify-between">
                      <span className="text-xs text-[#64748B]">Engagement Rate</span>
                      <span className="font-mono text-sm font-semibold text-[#0A1128] tabular-nums">
                        ${profile.dailyRateUsd.toLocaleString()} / day
                      </span>
                    </div>
                  </div>

                  {/* Right Part: Practice-Lead Summary partitioned by 1px vertical slate divider */}
                  <div className="flex flex-col justify-between border-t border-[#E2E8F0] pt-6 lg:col-span-8 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h2 className="font-display text-xl font-bold text-[#0A1128]">
                            {profile.name}
                          </h2>
                          <p className="mt-0.5 text-sm font-medium text-[var(--color-primary-strong)]">
                            {profile.role}
                          </p>
                          <p className="mt-1 text-xs text-[#64748B]">
                            {profile.city} · {profile.region}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => onToggleShortlist(profile.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                            isShortlisted
                              ? 'border border-[var(--color-border-tint)] bg-[var(--color-surface-soft)] text-[var(--color-secondary-text)]'
                              : 'apokrin-btn-primary'
                          }`}
                        >
                          {isShortlisted ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              <span>Shortlisted</span>
                            </>
                          ) : (
                            <>
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add to Shortlist</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-[#475569]">
                        {profile.summary}
                      </p>

                      <p className="mt-3 text-xs leading-relaxed text-[#64748B]">
                        <span className="font-semibold text-[#0A1128]">Recent Delivery:</span>{' '}
                        {profile.recentEngagement}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-[#E2E8F0] pt-4 flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xs text-[#64748B]">
                        {profile.stack.join(' · ')}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onOpenBriefing(
                            profile.practice,
                            `Requesting technical interview with ${profile.name} (${profile.role}).`,
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary-strong)] hover:opacity-80 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>Book Technical Screen</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Shortlist Review Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortlist-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/45 backdrop-blur-sm"
        >
          <div className="apokrin-overlay flex h-full w-full max-w-md flex-col justify-between overflow-y-auto p-6 sm:p-8">
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] pb-5">
                <div>
                  <p className="text-xs font-semibold text-[var(--color-secondary-text)]">Procurement Requisition</p>
                  <h3
                    id="shortlist-drawer-title"
                    className="mt-1 font-display text-xl font-bold text-[#0A1128]"
                  >
                    Active Engineering Shortlist
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close shortlist drawer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#CBD5E1] bg-white text-[#475569] hover:border-[var(--color-primary-strong)] hover:text-[#0A1128]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {shortlistedProfiles.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-medium text-[#0A1128]">
                    Your shortlist is currently empty.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
                    Select engineers from the Principal Bench to bundle technical screens and
                    confirm pod availability.
                  </p>
                </div>
              ) : (
                <ul className="mt-6 divide-y divide-[#E2E8F0]">
                  {shortlistedProfiles.map((p) => (
                    <li key={p.id} className="flex items-start justify-between gap-4 py-4">
                      <div>
                        <p className="font-display text-sm font-bold text-[#0A1128]">{p.name}</p>
                        <p className="text-xs text-[#64748B]">
                          {p.practice} · {p.availability}
                        </p>
                        <p className="mt-1 font-mono text-xs font-semibold text-[var(--color-secondary-text)] tabular-nums">
                          ${p.dailyRateUsd.toLocaleString()} / day
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleShortlist(p.id)}
                        className="text-xs font-medium text-[#64748B] hover:text-[#DC2626]"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {shortlistedProfiles.length > 0 && (
              <div className="mt-6 border-t border-[#E2E8F0] pt-5">
                <div className="flex items-baseline justify-between text-sm tabular-nums">
                  <span className="text-[#64748B]">Combined Daily Run-Rate</span>
                  <span className="font-display text-lg font-bold text-[#0A1128]">
                    ${combinedDailyRate.toLocaleString()} / day
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={onClearShortlist}
                    className="apokrin-btn-secondary rounded-lg px-4 py-2.5 text-xs font-semibold"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleRequestShortlist}
                    className="apokrin-btn-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold"
                  >
                    Submit Requisition
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
