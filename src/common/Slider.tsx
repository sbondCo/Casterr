export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  wheelStep?: number;
  onChange: (newVal: number) => void;
}

export default function Slider(props: SliderProps) {
  const { value = 0, min = 0, max = 100, step = 1, wheelStep = 1, onChange } = props;

  const onWheel = (ev: React.WheelEvent<HTMLInputElement>) => {
    if (ev.deltaY < 0) {
      const newVal = Number((value + wheelStep).toFixed(2));
      if (newVal < 1) onChange(newVal);
      else onChange(max);
    } else {
      const newVal = Number((value - wheelStep).toFixed(2));
      if (newVal >= 0) onChange(newVal);
      else onChange(min);
    }
  };

  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(ev) => onChange(Number(ev.target.value))}
      onWheel={onWheel}
      className="w-full"
    />
  );
}
