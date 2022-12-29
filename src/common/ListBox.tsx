import NamedContainer from "./NamedContainer";
import TickBox from "./TickBox";

interface ListBoxProps {
  options?: ListBoxItem[];

  /**
   * String array of ListBoxItem ids.
   */
  enabled: string[];

  onChange: (enabled: boolean, id: string) => void;
}

export interface ListBoxItem {
  id: string;
  name: string;
}

export default function ListBox({ options, enabled, onChange }: ListBoxProps) {
  return (
    <div className="flex flex-col gap-3 p-3.5 bg-secondary-100 rounded">
      {options ? (
        options.map((lb) => (
          <NamedContainer key={lb.id} title={lb.name} row className="!pb-0">
            <TickBox ticked={enabled.includes(lb.id)} onChange={(t) => onChange(t, lb.id)} />
          </NamedContainer>
        ))
      ) : (
        <span>No Items</span>
      )}
    </div>
  );
}
