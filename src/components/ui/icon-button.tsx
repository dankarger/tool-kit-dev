interface Props {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}
export default function IconButton(props: Props) {
  const {
    children,
    onClick = (event: React.MouseEvent<HTMLButtonElement>) => {},
    className = "",
  } = props;
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full p-2 hover:bg-gray-400 hover:bg-opacity-25 focus:border-none focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
}
