import Icon, { IconDirection, Icons } from "./Icon";

interface ButtonProps {
  icon?: Icons;
  iconDirection?: IconDirection;
  text?: string;
  disabled?: boolean;
  outlined?: boolean;
  slider?: boolean;
  sliderValue?: string;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

export default function Button(props: ButtonProps) {
  const { icon, iconDirection, text, disabled = false, outlined = false } = props;

  if (!text && !icon) console.error("Button component requires atleast of one 'text' or 'icon' prop to be functional.");

  return (
    <button className="p-1.5 bg-secondary-100 rounded border-2 border-secondary-100 transition-colors hover:bg-transparent">
      {icon && <Icon i={icon} direction={iconDirection} />}
      {text && <span>{text}</span>}
    </button>
  );
}
