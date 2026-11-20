import React from 'react';
import { useCountdown } from '../../hooks/useCountdown';

interface CountdownSectionProps {
  targetIsoDate: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/**
 * Dải đếm ngược 4 ô ngang theo mẫu PluginCountDown, phối nền xanh lá rêu trầm dịu mắt.
 */
export const CountdownSection: React.FC<CountdownSectionProps> = ({
  targetIsoDate,
}) => {
  const remaining = useCountdown(targetIsoDate);

  const items = [
    { key: 'days', value: pad2(remaining.days), label: 'Ngày' },
    { key: 'hours', value: pad2(remaining.hours), label: 'Giờ' },
    { key: 'minutes', value: pad2(remaining.minutes), label: 'Phút' },
    { key: 'seconds', value: pad2(remaining.seconds), label: 'Giây' },
  ];

  return (
    <section className="countdown-band" aria-label="Đếm ngược ngày cưới">
      <div className="countdown-tiles">
        {items.map((item) => (
          <div key={item.key} className="countdown-tile">
            <span className="countdown-tile__value">{item.value}</span>
            <span className="countdown-tile__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
