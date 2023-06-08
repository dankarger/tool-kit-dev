import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
type DeleteDialogueProps = {
  onDelete: () => void;
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function DeleteDialogue({
  onDelete,
  isOpen,
  setOpen,
}: DeleteDialogueProps) {
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false);
  const handleChange = () => {
    console.log("deleetetetett");
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline">Show Dialog</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            session and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              void event.preventDefault();
              void setIsDeleteLoading(true);
              console.log("delete");
              const deleted = void onDelete();

              if (deleted) {
                setIsDeleteLoading(false);
                setOpen(false);
                // router.refresh()
              }
            }}
            className="bg-red-600 focus:ring-red-600"
          >
            <Button
              variant="outline"
              color="red"
              onClick={() => handleChange()}
            >
              click
            </Button>
            {isDeleteLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.trash className="mr-2 h-4 w-4" />
            )}
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
