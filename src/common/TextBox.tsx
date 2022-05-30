interface TextBoxProps {
  name: string;
  value?: string;
  placeholder?: string;
  folderSelect?: boolean;
}

export default function TextBox(props: TextBoxProps) {
  const { name, value, placeholder, folderSelect = false } = props;

  return (
    <div className="flex flex-col">
      <span className="font-bold">{name}</span>
      <input value={value} type="text" placeholder={placeholder} className="h-8 bg-secondary-100 rounded" />
    </div>
  );
}
