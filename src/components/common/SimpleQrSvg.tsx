import React, { useMemo } from 'react';

interface SimpleQrSvgProps {
  seed: string;
  size?: number;
  fgColor?: string;
}

/**
 * Tạo ma trận QR trực quan ổn định từ chuỗi seed (tên chủ tài khoản + STK hoặc URL thiệp),
 * hiển thị ngay lập tức không phụ thuộc API ngoài.
 */
export const SimpleQrSvg: React.FC<SimpleQrSvgProps> = ({
  seed,
  size = 140,
  fgColor = '#243025',
}) => {
  const modules = useMemo(() => {
    const dim = 21;
    const grid: boolean[][] = Array.from({ length: dim }, () =>
      Array<boolean>(dim).fill(false),
    );

    const drawFinder = (r0: number, c0: number) => {
      for (let r = 0; r < 7; r += 1) {
        for (let c = 0; c < 7; c += 1) {
          const isOuter = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[r0 + r][c0 + c] = isOuter || isInner;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, dim - 7);
    drawFinder(dim - 7, 0);

    let hash = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      hash ^= seed.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < dim; r += 1) {
      for (let c = 0; c < dim; c += 1) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= dim - 8;
        const inBottomLeft = r >= dim - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        hash ^= (r * 31 + c * 17) & 0xff;
        hash = Math.imul(hash, 16777619);
        grid[r][c] = (hash & 1) === 1;
      }
    }

    return grid;
  }, [seed]);

  const dim = modules.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${dim} ${dim}`}
      role="img"
      aria-label={`Mã QR cho ${seed}`}
      shapeRendering="crispEdges"
    >
      <rect width={dim} height={dim} fill="#ffffff" />
      {modules.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width={1}
              height={1}
              fill={fgColor}
            />
          ) : null,
        ),
      )}
    </svg>
  );
};
