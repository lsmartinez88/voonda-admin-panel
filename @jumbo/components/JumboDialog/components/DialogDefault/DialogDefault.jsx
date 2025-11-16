import DialogBase from "../DialogBase";

const DialogDefault = ({ open = false, onClose, ...restProps }) => {
  return (
    <DialogBase
      sx={{ "& .MuiPaper-root": { borderRadius: 2 } }}
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={onClose}
      {...restProps}
    />
  );
};

export { DialogDefault };
export default DialogDefault;
