import { CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { getServiceConfig, ServiceId } from '../../data/servicesConfig';
import { useTheme } from '../../theme/themeConfig';

interface ServiceBenefitsProps {
  serviceId: ServiceId;
  badge?: string;
  heading?: string;
  subtitle?: string;
}

/**
 * Reusable "Why Choose Apokrin" benefits module aligned with the Apokrin light glassmorphic system.
 */
export function ServiceBenefits({
  serviceId,
  badge = 'Why Choose Apokrin',
  heading,
  subtitle,
}: ServiceBenefitsProps) {
  const { themeConfig } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const service = getServiceConfig(serviceId);

  if (!service.benefits.length) return null;

  return (
    <section
      aria-labelledby={`${serviceId}-benefits-heading`}
      className="apokrin-section border-t border-[#E2E8F0] bg-white"
    >
      <div className="apokrin-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="apokrin-badge">{badge}</span>
          <h2
            id={`${serviceId}-benefits-heading`}
            className="apokrin-heading-section mt-4 font-display font-extrabold text-[#0A1128]"
          >
            {heading ?? `Why Choose Apokrin for ${service.name}`}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base leading-relaxed text-[#475569]">{subtitle}</p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {service.benefits.map((benefit, idx) => (
            <motion.div
              key={benefit}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="apokrin-clay-panel flex items-start gap-3.5 rounded-2xl border border-white/95 p-5"
            >
              <span
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white bg-[var(--color-surface-tint)]"
                style={{ color: themeConfig.primaryStrong }}
              >
                <CheckCircle2 className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <p className="text-sm font-medium leading-relaxed text-[#1E293B]">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
