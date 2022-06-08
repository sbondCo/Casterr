interface TextBoxProps {
  value?: string;
  placeholder?: string;
  folderSelect?: boolean;
}

export default function TextBox(props: TextBoxProps) {
  const { value, placeholder, folderSelect = false } = props;

  return (
    <div className="flex flex-col">
      <input value={value} type="text" placeholder={placeholder} className="h-8 py-1.5 px-3 bg-secondary-100 rounded" />
    </div>
  );
}
