import { useState } from "react";
import Icon, { IconDirection, Icons } from "./Icon";
import Slider, { SliderProps } from "./Slider";
import { CommonComponentProps } from "./types";

interface ButtonProps extends CommonComponentProps {
  icon?: Icons;
  iconDirection?: IconDirection;
  text?: string;
  disabled?: boolean;
  outlined?: boolean;
  slider?: SliderProps;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  const { icon, iconDirection, text, disabled = false, outlined = false, slider, onClick, className } = props;

  if (!text && !icon) console.error("Button component requires atleast of one 'text' or 'icon' prop to be functional.");

  const sliderOpenClasses = "ml-1.5 mr-2";
  const sliderClosedClasses = "btn-slider-closed w-0";
  const [sliderClasses, setSliderClasses] = useState(sliderClosedClasses);

  return (
    <button
      className={`flex items-center bg-secondary-100 rounded border-2 border-secondary-100 transition-colors enabled:hover:bg-transparent disabled:bg-tertiary-100 disabled:cursor-not-allowed ${className}`}
      onMouseEnter={() => setSliderClasses(sliderOpenClasses)}
      onMouseLeave={() => setSliderClasses(sliderClosedClasses)}
      disabled={disabled}
    >
      <div onClick={onClick} className="p-1.5">
        {icon && <Icon i={icon} direction={iconDirection} wh={20} className={text && "mr-2"} />}
        {text && <span>{text}</span>}
      </div>
      {slider && (
        <div className={`flex items-center transition-all ${sliderClasses}`}>
          <Slider
            value={slider.value}
            min={slider.min}
            max={slider.max}
            step={slider.step}
            wheelStep={slider.wheelStep}
            onChange={slider.onChange}
          />
        </div>
      )}
    </button>
  );
}
