import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;

  /**
   * (defaults to true) If we should limit width to 500px
   * for readability. Most pages will have this limit
   * so everything is together and not stetched across
   * whole screen if in fullscreen.
   */
  smPageWidth?: boolean;
}

function PageLayout(props: PageLayoutProps, ref: React.Ref<HTMLDivElement>) {
  const { children, smPageWidth = true } = props;

  return (
    <div ref={ref} className="flex justify-center h-[calc(100vh-64px)] overflow-y-auto">
      <div className={`w-full mx-4 ${smPageWidth ? "sm:w-[500px]" : "max-w-7xl"}`}>
        <div className="py-4">{children}</div>
      </div>
    </div>
  );
}

export default React.forwardRef(PageLayout);
