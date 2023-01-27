interface FilterBarProps {
  options: string[];
  activeOptions: string[];
  optionClicked: (opt: string) => void;
}

export default function FilterBar({ options, activeOptions, optionClicked }: FilterBarProps) {
  const isActive = (opt: string) => activeOptions.includes(opt);

  return (
    <ul className="flex gap-2.5 row justify-center items-center text-2xl select-none">
      {options.map((opt) => (
        <div
          key={opt}
          className={`text-[20px] rounded-md py-0.5 px-2 ${
            isActive(opt) ? "text-white-100 bg-quaternary-100" : "text-white-25 hover:text-white-50"
          }`}
          onClick={() => {
            optionClicked(opt);
          }}
        >
          <span className={`cursor-pointer`}>{opt}</span>
        </div>
      ))}
    </ul>
  );
}
