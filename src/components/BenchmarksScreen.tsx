import { useMemo, useState } from 'react';
import { ArrowUpDown, Download, Search } from 'lucide-react';
import {
  BENCHMARK_RECORDS,
  BenchmarkRecord,
  VELOCITY_SERIES,
} from '../data/apokrinData';
import { useTheme } from '../theme/themeConfig';

type TimeframeKey = '6M' | '12M' | '24M';
type SortField = 'leadTimeDays' | 'costDeltaPct' | 'uptimePct';

export function BenchmarksScreen() {
  const { themeConfig } = useTheme();
  const [timeframe, setTimeframe] = useState<TimeframeKey>('12M');
  const [hoveredIndex, setHoveredIndex] = useState<number>(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('leadTimeDays');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const series = VELOCITY_SERIES[timeframe];
  const inspectedPoint = series[hoveredIndex] ?? series[series.length - 1];

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = BENCHMARK_RECORDS.filter((rec) => {
      if (statusFilter !== 'All' && rec.status !== statusFilter) return false;
      if (!q) return true;
      return (
        rec.engagementName.toLowerCase().includes(q) ||
        rec.clientSector.toLowerCase().includes(q) ||
        rec.practice.toLowerCase().includes(q) ||
        rec.region.toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      const diff = a[sortField] - b[sortField];
      return sortAsc ? diff : -diff;
    });
  }, [searchQuery, statusFilter, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === 'leadTimeDays' || field === 'costDeltaPct');
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'Engagement',
      'Sector',
      'Practice',
      'Region',
      'Team Size',
      'Lead Time (Days)',
      'Cloud Cost Delta (%)',
      'Uptime (%)',
      'Status',
      'Quarter',
    ];
    const rows = filteredRecords.map((r: BenchmarkRecord) => [
      `"${r.engagementName}"`,
      `"${r.clientSector}"`,
      `"${r.practice}"`,
      `"${r.region}"`,
      r.teamSize,
      r.leadTimeDays,
      r.costDeltaPct,
      r.uptimePct,
      r.status,
      r.quarter,
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apokrin-sla-benchmarks-${timeframe.toLowerCase()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Chart geometry helpers
  const chartWidth = 680;
  const chartHeight = 220;
  const padX = 42;
  const padY = 24;
  const usableW = chartWidth - padX * 2;
  const usableH = chartHeight - padY * 2;
  const maxDays = 55;

  const getX = (idx: number) => padX + (idx / (series.length - 1)) * usableW;
  const getY = (days: number) => padY + usableH - (days / maxDays) * usableH;

  const apokrinPath = series
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(pt.apokrinDays).toFixed(1)}`)
    .join(' ');
  const baselinePath = series
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(pt.baselineDays).toFixed(1)}`)
    .join(' ');

  return (
    <div className="apokrin-container py-12">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-[#E2E8F0] pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold text-[var(--color-secondary-text)]">Delivery Velocity &amp; SLA Ledger</p>
          <h1
            style={{ textWrap: 'balance' }}
            className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0A1128] sm:text-4xl"
          >
            Audited production benchmarks and SLA performance.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#475569] sm:text-base">
            Track verified onboarding lead times, cluster availability, and cloud unit-cost
            compression across active and completed enterprise engagements.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="apokrin-btn-secondary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold whitespace-nowrap shrink-0 self-start lg:self-auto"
        >
          <Download className="h-4 w-4 text-[var(--color-primary-strong)]" />
          <span>Download CSV</span>
        </button>
      </div>

      {/* Velocity Comparison Chart Section */}
      <section className="apokrin-card mt-8 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0A1128]">
              Time-to-First-Production Commit (Days)
            </h2>
            <p className="mt-1 text-xs text-[#64748B]">
              Apokrin Principal Pod onboarding speed vs. traditional enterprise vendor baseline
            </p>
          </div>

          <div
            role="group"
            aria-label="Chart timeframe"
            className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 self-start sm:self-auto"
          >
            {(['6M', '12M', '24M'] as TimeframeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setTimeframe(key);
                  setHoveredIndex(VELOCITY_SERIES[key].length - 1);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                  timeframe === key ? 'bg-[var(--color-primary-strong)] text-white' : 'text-[#475569] hover:text-[#0A1128]'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label="Chart comparing Apokrin delivery lead time against industry baseline"
            >
              {/* Horizontal Reference Grid Lines */}
              {[10, 25, 40, 50].map((val) => {
                const y = getY(val);
                return (
                  <g key={val}>
                    <line
                      x1={padX}
                      y1={y}
                      x2={chartWidth - padX}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={padX - 10}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-[#64748B] text-[10px] font-mono tabular-nums"
                    >
                      {val}d
                    </text>
                  </g>
                );
              })}

              {/* Baseline Line */}
              <path
                d={baselinePath}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="2"
                strokeDasharray="6 4"
              />

              {/* Apokrin Brand Line */}
              <path
                d={apokrinPath}
                fill="none"
                stroke={themeConfig.primaryStrong}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Points */}
              {series.map((pt, i) => {
                const cx = getX(i);
                const cyApokrin = getY(pt.apokrinDays);
                const cyBase = getY(pt.baselineDays);
                const isSelected = i === hoveredIndex;
                return (
                  <g key={pt.period}>
                    {isSelected && (
                      <line
                        x1={cx}
                        y1={padY}
                        x2={cx}
                        y2={chartHeight - padY}
                        stroke={themeConfig.glow}
                        strokeWidth="1"
                      />
                    )}
                    <circle
                      cx={cx}
                      cy={cyBase}
                      r={isSelected ? 5 : 3.5}
                      fill="#FFFFFF"
                      stroke="#94A3B8"
                      strokeWidth="2"
                    />
                    <circle
                      cx={cx}
                      cy={cyApokrin}
                      r={isSelected ? 6.5 : 4.5}
                      fill={isSelected ? themeConfig.secondaryText : themeConfig.primaryStrong}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                    <text
                      x={cx}
                      y={chartHeight - 4}
                      textAnchor="middle"
                      className={`text-[11px] font-mono ${
                        isSelected ? 'fill-[#0A1128] font-semibold' : 'fill-[#64748B]'
                      }`}
                    >
                      {pt.period}
                    </text>
                    <rect
                      x={cx - 32}
                      y={0}
                      width={64}
                      height={chartHeight}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onClick={() => setHoveredIndex(i)}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Inspected Period Telemetry Card */}
          <div className="lg:col-span-4 lg:border-l lg:border-[#E2E8F0] lg:pl-8">
            <p className="text-xs font-semibold text-[var(--color-secondary-text)]">
              Period Inspection · {inspectedPoint.period}
            </p>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-[#64748B]">Apokrin Pod Lead Time</dt>
                <dd className="mt-1 font-display text-3xl font-extrabold text-[#0A1128] tabular-nums">
                  {inspectedPoint.apokrinDays} Days
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#E2E8F0] pt-3 text-sm tabular-nums">
                <dt className="text-[#64748B]">Industry Vendor Baseline</dt>
                <dd className="font-mono font-semibold text-[#334155]">
                  {inspectedPoint.baselineDays} Days
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#E2E8F0] pt-3 text-sm tabular-nums">
                <dt className="text-[#64748B]">Avg Cloud Unit-Cost Reduction</dt>
                <dd className="font-mono font-semibold text-[var(--color-secondary-text)]">
                  -{inspectedPoint.savingsPct}%
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Enterprise Data Table with Light Zebra Striping */}
      <section className="mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter engagements, sector, region..."
              aria-label="Filter SLA benchmark records"
              className="apokrin-input w-full py-2 pl-10 pr-3.5 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 self-start sm:self-auto">
            {['All', 'Active', 'Completed', 'At Risk'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-[var(--color-primary-strong)] text-white'
                    : 'text-[#475569] hover:text-[#0A1128]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E2E8F0] bg-white shadow-xs">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-semibold text-[#475569]">
                <th className="px-5 py-3.5">Engagement</th>
                <th className="px-4 py-3.5">Practice &amp; Region</th>
                <th className="px-4 py-3.5 text-right">Team</th>
                <th className="px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('leadTimeDays')}
                    className="inline-flex items-center gap-1 hover:text-[#0A1128]"
                  >
                    <span>Lead Time</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('costDeltaPct')}
                    className="inline-flex items-center gap-1 hover:text-[#0A1128]"
                  >
                    <span>Spend Delta</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-4 py-3.5 text-right">
                  <button
                    type="button"
                    onClick={() => toggleSort('uptimePct')}
                    className="inline-flex items-center gap-1 hover:text-[#0A1128]"
                  >
                    <span>Uptime</span>
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </button>
                </th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="bg-white px-6 py-12 text-center">
                    <p className="font-display text-base font-bold text-[#0A1128]">
                      No engagements match your filters
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('All');
                      }}
                      className="apokrin-btn-secondary mt-4 rounded-lg px-4 py-2 text-xs font-semibold"
                    >
                      Reset Table Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-[#E2E8F0] transition-colors hover:bg-[var(--color-surface-soft)] ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-display font-semibold text-[#0A1128]">
                        {row.engagementName}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {row.clientSector} · {row.quarter}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[#334155]">{row.practice}</p>
                      <p className="text-xs text-[#64748B]">{row.region}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#334155]">
                      {row.teamSize}
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#0A1128]">
                      {row.leadTimeDays}d
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-semibold tabular-nums text-[var(--color-secondary-text)]">
                      {row.costDeltaPct}%
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums text-[#334155]">
                      {row.uptimePct.toFixed(2)}%
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span
                        className={`text-xs font-semibold whitespace-nowrap ${
                          row.status === 'At Risk'
                            ? 'text-[#EA580C]'
                            : row.status === 'Active'
                              ? 'text-[var(--color-primary-strong)]'
                              : 'text-[#64748B]'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
