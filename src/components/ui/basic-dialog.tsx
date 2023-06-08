import ExitIcon from "@components/Icons/Exit";
// import IconButton from '@components/Button/IconButton';

import IconButton from "./icon-button";

interface Props {
  children: React.ReactNode;
  open: boolean;
  onClose: Function;
}
export default function Dialog(props: Props) {
  const { open, onClose } = props;
  if (!open) {
    return <></>;
  }
  return (
    <div className="bg-smoke-light fixed inset-0 z-50 flex overflow-auto">
      <div className="relative m-auto flex w-full max-w-md flex-col rounded-lg bg-white p-8">
        <div>{props.children}</div>
        <span className="absolute right-0 top-0 p-4">
          <IconButton onClick={() => onClose()}>
            <ExitIcon />
          </IconButton>
        </span>
      </div>
    </div>
  );
}
