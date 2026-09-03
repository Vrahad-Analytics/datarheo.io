import { useCallback, useEffect, useId, useState } from 'react';

/*
 * AnimatedBeam — a port of the MagicUI component
 * (https://magicui.design/docs/components/animated-beam).
 *
 * The geometry is the same as the original: measure `fromRef` and `toRef`
 * against `containerRef`, then draw a quadratic curve between their centres,
 * bent by `curvature`. The travelling highlight is the original's animated
 * linear gradient.
 *
 * The upstream component drives that gradient with framer-motion. This build
 * uses SVG's own SMIL <animate> instead, so the effect is identical without
 * adding a ~40 kB animation runtime to a marketing page. The prop names are
 * kept, so swapping in the upstream component later is a drop-in change.
 */
export default function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4.5,
  delay = 0,
  pathColor = '#8fc0ff',
  pathWidth = 2,
  pathOpacity = 0.28,
  gradientStartColor = '#0073ff',
  gradientStopColor = '#8fc0ff',
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
  className = '',
}) {
  const id = useId().replace(/:/g, '');
  const [pathD, setPathD] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [animate, setAnimate] = useState(true);

  const updatePath = useCallback(() => {
    const container = containerRef?.current;
    const from = fromRef?.current;
    const to = toRef?.current;
    if (!container || !from || !to) return;

    const containerRect = container.getBoundingClientRect();
    const fromRect = from.getBoundingClientRect();
    const toRect = to.getBoundingClientRect();

    setDimensions({ width: containerRect.width, height: containerRect.height });

    const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
    const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
    const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
    const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

    const controlX = (startX + endX) / 2;
    const controlY = (startY + endY) / 2 - curvature;

    setPathD(`M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`);
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAnimate(!media.matches);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    updatePath();
    const container = containerRef?.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(updatePath);
    observer.observe(container);
    window.addEventListener('resize', updatePath);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePath);
    };
  }, [containerRef, updatePath]);

  // Sweep direction of the travelling highlight.
  const x1 = reverse ? ['90%', '-10%'] : ['10%', '110%'];
  const x2 = reverse ? ['100%', '0%'] : ['0%', '100%'];

  return (
    <svg
      fill="none"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      className={`animated-beam ${className}`.trim()}
      aria-hidden="true"
    >
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      <path d={pathD} stroke={`url(#beam-${id})`} strokeWidth={pathWidth} strokeLinecap="round" />
      <defs>
        <linearGradient id={`beam-${id}`} gradientUnits="userSpaceOnUse" x1={x1[0]} x2={x2[0]} y1="0%" y2="0%">
          {animate && (
            <>
              <animate
                attributeName="x1"
                values={`${x1[0]};${x1[1]}`}
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="x2"
                values={`${x2[0]};${x2[1]}`}
                dur={`${duration}s`}
                begin={`${delay}s`}
                repeatCount="indefinite"
              />
            </>
          )}
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
