export interface SliderProps {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  wheelStep?: number;
  onChange: (newVal: number) => void;

  /**
   * When the user is done changing the volume (mouse up, wheel events).
   * This can be used kind of like onBlur, so we know when we can do an intensive operation on the new value.
   */
  onFinishedChanging: (newVal: number) => void;
}

export default function Slider(props: SliderProps) {
  const { value = 0, min = 0, max = 100, step = 1, wheelStep = 1, onChange, onFinishedChanging } = props;

  const onWheel = (ev: React.WheelEvent<HTMLInputElement>) => {
    let newVolume = max;
    if (ev.deltaY < 0) {
      const newVal = Number((value + wheelStep).toFixed(2));
      if (newVal < 1) newVolume = newVal;
      else newVolume = max;
    } else {
      const newVal = Number((value - wheelStep).toFixed(2));
      if (newVal >= 0) newVolume = newVal;
      else newVolume = min;
    }
    onChange(newVolume);
    onFinishedChanging(newVolume);
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
      onMouseUp={(ev) => onFinishedChanging(Number((ev.target as HTMLInputElement).value))}
      className="w-full"
    />
  );
}
