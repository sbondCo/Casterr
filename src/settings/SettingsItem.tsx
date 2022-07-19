interface SettingsItemProps {
  title: string;
  children: React.ReactChild;
  row?: boolean;
}

export default function SettingsItem({ title, children, row }: SettingsItemProps) {
  const containerClass = row ? "flex flex-row-reverse justify-end" : "";

  return (
    <div className={`pb-5 last:pb-0 ${containerClass}`}>
      <p className={`mb-1.5 mr-2.5 font-bold capitalize ${row && "ml-2.5"}`}>{title}</p>
      {children}
    </div>
  );
}
