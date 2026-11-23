import React, { useMemo } from 'react';
import { CalendarHeartMark } from '../common/SageArtwork';

export interface CalendarCell {
  key: string;
  day: number | null;
  isWeddingDay: boolean;
}

const WEEKDAYS_MON_FIRST = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

/**
 * Tạo lưới lịch 7 cột (bắt đầu từ Thứ 2 -> Chủ Nhật) cho bất kỳ tháng/năm nào,
 * tự động đánh dấu đúng ngày cưới.
 */
export function buildWeddingCalendarCells(
  year: number,
  month1Based: number,
  weddingDayOrDays: number | number[],
): CalendarCell[] {
  const highlightedDays = new Set(
    Array.isArray(weddingDayOrDays) ? weddingDayOrDays : [weddingDayOrDays],
  );
  const firstJsDay = new Date(year, month1Based - 1, 1).getDay(); // 0=CN, 1=T2 ... 6=T7
  const leadingEmpty = (firstJsDay + 6) % 7;
  const totalDays = new Date(year, month1Based, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < leadingEmpty; i += 1) {
    cells.push({
      key: `empty-start-${i}`,
      day: null,
      isWeddingDay: false,
    });
  }

  for (let d = 1; d <= totalDays; d += 1) {
    cells.push({
      key: `day-${d}`,
      day: d,
      isWeddingDay: highlightedDays.has(d),
    });
  }

  return cells;
}

interface WeddingCalendarProps {
  year: number;
  month: number;
  weddingDay: number;
  weddingDays?: number[];
}

/**
 * Lịch tháng trong suốt đè lên nền ảnh Polaroid khung vòm (template-three của CineLove),
 * hiển thị ngày trọng đại bằng trái tim xanh lá dịu.
 */
export const WeddingCalendar: React.FC<WeddingCalendarProps> = ({
  year,
  month,
  weddingDay,
  weddingDays,
}) => {
  const targetDays = weddingDays?.length ? weddingDays : weddingDay;
  const cells = useMemo(
    () => buildWeddingCalendarCells(year, month, targetDays),
    [year, month, targetDays],
  );

  return (
    <div
      className="wedding-cal-grid"
      role="grid"
      aria-label={`Lịch Tháng ${month} năm ${year}`}
    >
      {WEEKDAYS_MON_FIRST.map((wd) => (
        <div key={wd} className="wedding-cal-cell wedding-cal-cell--head" role="columnheader">
          {wd}
        </div>
      ))}

      {cells.map((cell) => (
        <div
          key={cell.key}
          role="gridcell"
          aria-selected={cell.isWeddingDay || undefined}
          className={`wedding-cal-cell ${cell.isWeddingDay ? 'wedding-cal-cell--wedding' : ''}`}
        >
          {cell.isWeddingDay && <CalendarHeartMark />}
          <span className="wedding-cal-cell__num">{cell.day ?? ''}</span>
        </div>
      ))}
    </div>
  );
};
