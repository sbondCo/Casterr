import { useEffect, useRef } from "react";

interface SpinnerProps {
  scale?: number;
}

export default function Spinner({ scale }: SpinnerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scale && spinnerRef.current && containerRef.current) {
      spinnerRef.current.style.transform = `scale(${scale})`;

      const sb = spinnerRef.current.getBoundingClientRect();
      containerRef.current.style.height = `${sb.height}px`;
      containerRef.current.style.width = `${sb.width}px`;
    }
  }, []);

  return (
    <div ref={containerRef}>
      <div ref={spinnerRef} className="spinner"></div>
    </div>
  );
}
