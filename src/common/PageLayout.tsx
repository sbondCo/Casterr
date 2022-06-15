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

export default function PageLayout(props: PageLayoutProps) {
  const { children, smPageWidth = true } = props;

  return (
    <div className="flex justify-center h-[calc(100vh-64px)] overflow-y-auto">
      <div className={`w-full mx-4 ${smPageWidth ? "sm:w-[500px]" : "max-w-7xl"}`}>{children}</div>
    </div>
  );
}
