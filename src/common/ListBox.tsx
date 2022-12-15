import NamedContainer from "./NamedContainer";
import TickBox from "./TickBox";

interface ListBoxProps {
  options?: ListBoxItem[];
  enabled: string[];
}

export interface ListBoxItem {
  id: string;
  name: string;
}

export default function ListBox({ options, enabled }: ListBoxProps) {
  return (
    <div className="flex flex-col gap-3 p-3.5 bg-secondary-100 rounded">
      {options ? (
        options.map((lb) => (
          <NamedContainer key={lb.id} title={lb.name} row className="!pb-0">
            <TickBox ticked={enabled.includes(lb.id)} onChange={(t) => {}} />
          </NamedContainer>
        ))
      ) : (
        <span>No Items</span>
      )}
    </div>
  );
}
