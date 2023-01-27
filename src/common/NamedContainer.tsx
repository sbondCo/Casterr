import type { CommonComponentProps } from "./types";

type NamedContainerProps = {
  title: string;
  children: React.ReactNode;
  row?: boolean;
} & CommonComponentProps;

export default function NamedContainer({ title, children, row, className }: NamedContainerProps) {
  const containerClass = row ? "flex flex-row-reverse justify-end" : "";

  return (
    <div className={`pb-5 last:pb-0 ${containerClass} ${className ?? ""}`}>
      <p className={`mb-1.5 mr-2.5 font-bold capitalize ${row ? "ml-2.5" : ""}`}>{title}</p>
      {children}
    </div>
  );
}
