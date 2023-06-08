import React from "react";

export const DeleteDialog2 = ({ isOpen }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const dialogReff = React.useRef(null);

  const showDialogHandler = () => {
    setShowDialog(true);
    dialogReff.current?.show();
  };

  React.useEffect(() => {
    if (isOpen) showDialogHandler();
  }, [isOpen]);

  const handleConfirm = (e) => {
    e.preventDefault();
    console.log("confirm");
  };
  return (
    <>
      <dialog id="favDialog" ref={dialogReff}>
        <form>
          <p>Are you sure you want to delete this session?</p>
          <div>
            <button value="cancel" formmethod="dialog">
              Cancel
            </button>
            <button id="confirmBtn" value="default" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </form>
      </dialog>
      <p>
        {/* <button id="showDialog" onClick={showDialogHandler}>
          Show the dialog
        </button> */}
      </p>
    </>
  );
};
