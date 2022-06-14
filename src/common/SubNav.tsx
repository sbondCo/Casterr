import { NavLink, useLocation } from "react-router-dom";

interface SubNavProps {
  children: React.ReactNode;
}

export default function SubNav({ children }: SubNavProps) {
  return <ul className="flex row justify-center items-center my-4 text-xl">{children}</ul>;
}

interface SubNavItemProps {
  text: string;
}

export function SubNavItem({ text }: SubNavItemProps) {
  const to = text.replace(" ", "").toLowerCase();
  const isActive = useLocation().pathname.match(new RegExp("[^/]*$"))![0].toLowerCase() == to;

  return (
    <NavLink
      to={to}
      className={["mx-2", isActive ? `text-white-100 text-1xl` : `text-white-25 hover:text-white-50`].join(" ")}
    >
      <span className={`cursor-pointer`}>{text}</span>
      <div className={["h-0.5", isActive ? "rounded-full bg-white-100" : ""].join(" ")}></div>
    </NavLink>
  );
}
