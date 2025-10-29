import React from "react";
import {
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Label } from "@mui/icons-material";
import { useJumboDialog } from "@jumbo/components/JumboDialog/hooks/useJumboDialog";
import { ContactForm } from "../ContactForm";
import { LabelForm } from "../LabelForm";

const ContactFab = () => {
  const { showDialog } = useJumboDialog();

  const showAddLabelDialog = React.useCallback(() => {
    showDialog({
      title: "Add New Label",
      content: <LabelForm />,
    });
  }, []);

  const showAddContactDialog = React.useCallback(() => {
    showDialog({
      title: "Add New contact",
      content: <ContactForm />,
    });
  }, [showDialog]);

  return (
    <SpeedDial
      ariaLabel={"contact-fab"}
      icon={<SpeedDialIcon />}
      sx={{
        position: "fixed",
        right: 30,
        bottom: 30,
      }}
    >
      <SpeedDialAction
        icon={
          <IconButton onClick={showAddContactDialog}>
            <PersonAddIcon />
          </IconButton>
        }
        tooltipTitle={"Add Contact"}
      />
      <SpeedDialAction
        icon={
          <IconButton onClick={showAddLabelDialog}>
            <Label />
          </IconButton>
        }
        tooltipTitle={"Add Label"}
      />
    </SpeedDial>
  );
};
export { ContactFab };
