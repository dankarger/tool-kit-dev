import {
  useRef,
  useEffect,
  useState,
  type MouseEvent,
  MouseEventHandler,
  MutableRefObject,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface ModalProp {
  handleAction: (value: string) => void;
  value: string;
}

export const SimpleModal = ({ handleAction, value }: ModalProp) => {
  // const dialogRef =
  //   useRef<
  //     DetailedHTMLProps<
  //       DialogHTMLAttributes<HTMLDialogElement>,
  //       HTMLDialogElement
  //     >
  //   >(null);
  const dialogRef: MutableRefObject<null | HTMLDialogElement> = useRef(null);
  const showModalClick = () => {
    dialogRef.current?.showModal();
  };

  const handleCancelButton: MouseEventHandler<HTMLButtonElement> = () => {
    console.log("cancel");
    dialogRef.current?.close();
  };
  const handleConfirmButton: MouseEventHandler<HTMLButtonElement> = () => {
    // event.preventDefault();
    console.log("confirm");
    handleAction(value);
    dialogRef.current?.close();
  };

  return (
    <>
      <Card>
        <dialog
          // className="absolute left-52 top-52"
          id="favDialog"
          ref={dialogRef}
          // open={isOpen}
        >
          <form>
            <CardHeader>
              <CardTitle>Delete Operation</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Are you sure you want to delete this item? this will remove the
                item from our database
              </CardDescription>
            </CardContent>
            <CardFooter>
              <div className="flex w-full items-center justify-between py-2">
                <Button
                  value="cancel"
                  // formMethod="dialog"
                  variant={"outline"}
                  autoFocus
                  onClick={handleCancelButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  id="confirmBtn"
                  value="confirm"
                  formMethod="dialog"
                  onClick={handleConfirmButton}
                >
                  Confirm
                </Button>
              </div>
            </CardFooter>
          </form>
        </dialog>
      </Card>
      {/* <p> */}
      <button id="showDialog" onClick={showModalClick}>
        Delete Session
      </button>
      {/* </p> */}
      {/* <output></output> */}
    </>
  );
};
