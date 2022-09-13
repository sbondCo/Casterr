export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Slider(props: SliderProps) {
  let { value = 0, min = 0, max = 100, step = 1, onChange } = props;

  return <input type="range" value={value} min={min} max={max} step={step} onChange={onChange} className="w-full" />;
}
