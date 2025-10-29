import { Div } from "@jumbo/shared";
import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import moment from "moment";

const SentMessageContent = ({ message }) => {
  const sentDate = moment(message.sent_at, "h:mm a | MMMM DD, YYYY");
  return (
    <Div
      sx={{
        display: "flex",
        textAlign: "right",
        alignItems: "flex-start",
        flexDirection: "row-reverse",
        mb: 2,
        px: 3,
      }}
    >
      <div className="Message-root">
        <div className="Message-item">
          <Typography
            variant={"body1"}
            color={"text.secondary"}
            fontSize={"smaller"}
            mb={0.5}
          >
            {sentDate.format("h:mm A")}
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: (theme) => theme.spacing(1.5, 2),
              bgcolor: (theme) => theme.palette.divider,
            }}
          >
            <Typography variant={"body1"}>{message?.message}</Typography>
          </Paper>
        </div>
      </div>
    </Div>
  );
};

export { SentMessageContent };
