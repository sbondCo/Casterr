interface ProgressProps {
  /**
   * Percentage.
   */
  p: number;
}

export default function Progress({ p }: ProgressProps) {
  return (
    // Old inset box shadow `shadow-[0_1px_5px_rgb(0,0,0,0.7)_inset]` doesn't look right anymore... think about it
    <div className="progressBar w-full h-5 rounded bg-secondary-100">
      <div style={{ width: `${p}%` }}></div>
    </div>
  );
}
