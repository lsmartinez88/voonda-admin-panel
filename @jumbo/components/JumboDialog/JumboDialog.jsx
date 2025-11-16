import DialogConfirm from "./components/DialogConfirm";
import DialogDefault from "./components/DialogDefault";
import { useJumboDialog } from "./hooks/useJumboDialog";

// Debug logs
console.log('JumboDialog imported:', { DialogDefault, DialogConfirm });

const dialogVariants = {
  default: DialogDefault,
  confirm: DialogConfirm,
};

const JumboDialog = () => {
  // Temporalmente deshabilitado para debug
  return null;

  const { variant, showDialog, hideDialog, ...restDialogProps } =
    useJumboDialog();

  const DialogVariant = variant
    ? dialogVariants[variant]
    : dialogVariants.default;

  // Validación para evitar que se renderice undefined
  if (!DialogVariant) {
    console.error('DialogVariant is undefined:', { variant, dialogVariants });
    return null;
  }

  return <DialogVariant {...restDialogProps} />;
};

export { JumboDialog };
export default JumboDialog;
