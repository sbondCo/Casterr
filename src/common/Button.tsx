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
  children?: React.ReactNode;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  const { icon, iconDirection, text, disabled = false, outlined = false, slider, children, onClick, className } = props;

  const btnClasses = !outlined ? "bg-secondary-100 enabled:hover:bg-transparent" : "enabled:hover:bg-secondary-100";
  const sliderOpenClasses = "ml-1.5 mr-2";
  const sliderClosedClasses = "btn-slider-closed w-0";
  const [sliderClasses, setSliderClasses] = useState(sliderClosedClasses);

  return (
    <button
      className={`flex items-center justify-center p-1.5 ${btnClasses} w-auto rounded border-2 border-secondary-100 ${
        className ?? ""
      } transition-colors disabled:bg-tertiary-100 disabled:cursor-not-allowed`}
      onMouseEnter={() => setSliderClasses(sliderOpenClasses)}
      onMouseLeave={() => setSliderClasses(sliderClosedClasses)}
      disabled={disabled}
    >
      <div onClick={onClick} className="flex capitalize">
        {icon && <Icon i={icon} direction={iconDirection} wh={20} className={text && "mr-2"} />}
        {text && <span className="text-sm">{text}</span>}
        {children && <div className="flex gap-3 text-sm">{children}</div>}
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
