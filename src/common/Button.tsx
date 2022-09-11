import Icon, { IconDirection, Icons } from "./Icon";

interface ButtonProps {
  icon?: Icons;
  iconDirection?: IconDirection;
  text?: string;
  disabled?: boolean;
  outlined?: boolean;
  slider?: boolean;
  onClick?: () => void;
}

export default function Button(props: ButtonProps) {
  const { icon, iconDirection, text, disabled = false, outlined = false, onClick } = props;

  if (!text && !icon) console.error("Button component requires atleast of one 'text' or 'icon' prop to be functional.");

  return (
    <button
      className="flex items-center p-1.5 bg-secondary-100 rounded border-2 border-secondary-100 transition-colors enabled:hover:bg-transparent disabled:bg-tertiary-100 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <Icon i={icon} direction={iconDirection} wh={20} className={text && "mr-2"} />}
      {text && <span>{text}</span>}
    </button>
  );
}
