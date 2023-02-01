import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Icon, { type Icons } from "./Icon";

interface SubNavProps {
  children: React.ReactNode;
}

export default function SubNav({ children }: SubNavProps) {
  return <ul className="flex justify-between row justify-center items-center mb-4 text-2xl">{children}</ul>;
}

interface SubNavItemProps {
  icon: Icons;
  text: string;
}

export function SubNavItem({ icon, text }: SubNavItemProps) {
  const to = text.replace(" ", "").toLowerCase();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const isActive =
    useLocation()
      .pathname.match(/[^/]*$/)?.[0]
      .toLowerCase() === to;

  const inactiveLinkClass = ["w-[50px]", "min-w-[50px]"];
  const inactiveTextClass = ["invisible", "group-hover:visible", "group-hover:w-min", "w-0"];

  const hovIn = () => {
    if (isActive) return;
    const el = document.querySelector<HTMLElement>(".navlink.active");
    const elIcon = document.querySelector<HTMLElement>(".navlink.active .navlink-icon");
    const elText = document.querySelector<HTMLElement>(".navlink.active .navlink-text");
    if (el && elIcon && elText) {
      el.classList.add(...inactiveLinkClass);
      elText.classList.add(...inactiveTextClass, "!w-0");
      elIcon.classList.remove("!mr-2");
    }
  };

  const hovOut = () => {
    if (isActive) return;
    const el = document.querySelector<HTMLElement>(".navlink.active");
    const elIcon = document.querySelector<HTMLElement>(".navlink.active .navlink-icon");
    const elText = document.querySelector<HTMLElement>(".navlink.active .navlink-text");
    if (el && elIcon && elText) {
      el.classList.remove(...inactiveLinkClass);
      elText.classList.remove(...inactiveTextClass, "!w-0");
      elIcon.classList.add("!mr-2");
    }
  };

  useEffect(() => {
    linkRef.current?.addEventListener("mouseenter", hovIn);
    linkRef.current?.addEventListener("mouseleave", hovOut);

    return () => {
      linkRef.current?.removeEventListener("mouseenter", hovIn);
      linkRef.current?.removeEventListener("mouseleave", hovOut);
    };
  }, [linkRef, isActive]);

  return (
    <NavLink
      to={to}
      ref={linkRef}
      className={[
        "navlink group hover:w-full overflow-hidden items-center mx-2 transition-all",
        isActive ? `text-white-100 w-full` : `${inactiveLinkClass.join(" ")} text-white-25 hover:text-white-50`
      ].join(" ")}
    >
      <div className="flex justify-center items-center m-2 outline outline-offset-4 outline-color-white outline-2 rounded">
        <Icon i={icon} className={["navlink-icon group-hover:mr-2", isActive ? "!mr-2" : ""].join(" ")} />
        <div
          className={[
            `navlink-text transition-all cursor-pointer whitespace-nowrap`,
            isActive ? "visible w-min" : `${inactiveTextClass.join(" ")} `
          ].join(" ")}
        >
          {text}
        </div>
      </div>
    </NavLink>
  );
}
