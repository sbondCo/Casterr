import type { CommonComponentProps } from "./types";

type NamedContainerProps = {
  title: string;
  desc?: string;
  children: React.ReactNode;
  row?: boolean;
} & CommonComponentProps;

export default function NamedContainer({ title, desc, children, row, className }: NamedContainerProps) {
  const containerClass = row ? "flex flex-row-reverse justify-end" : "";

  return (
    <div className={`pb-5 last:pb-0 ${containerClass} ${className ?? ""}`}>
      <div className={`mb-1.5 mr-2.5 ${row ? "ml-2.5" : ""}`}>
        <p className="font-bold capitalize">{title}</p>
        {desc && <p className="text-sm">{desc}</p>}
      </div>
      {children}
    </div>
  );
}
