interface ButtonConnectorProps {
  children: React.ReactNode;
}

export default function ButtonConnector(props: ButtonConnectorProps) {
  const { children } = props;

  return <div className="flex btn-connector">{children}</div>;
}
