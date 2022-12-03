interface TickBoxProps {
  ticked: boolean;

  onChange: (ticked: boolean) => void;
}

export default function TickBox({ ticked, onChange }: TickBoxProps) {
  return (
    <label className="tickBox">
      <input type="checkbox" checked={ticked} onChange={(e) => onChange(e.target.checked)} />
      <span />
    </label>
  );
}
