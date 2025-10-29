import React from "react";
import { TextField } from "@mui/material";
import { Div } from "@jumbo/shared";

const ActiveConversationFooter = () => {
  const [message, setMessage] = React.useState("");

  return (
    <Div
      sx={{
        display: "flex",
        alignItems: "center",
        p: (theme) => theme.spacing(2, 3),
        borderTop: 1,
        borderTopColor: "divider",
        bgcolor: (theme) => theme.palette.action.hover,
      }}
    >
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        size={"small"}
        placeholder={"Type message...."}
        fullWidth
        sx={{
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      />
    </Div>
  );
};

export { ActiveConversationFooter };
