import React from "react";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { useParams } from "react-router-dom";
import { conversations, users } from "../../data";
import { Div } from "@jumbo/shared";
import moment from "moment";

const ReceivedMessageContent = ({ message }) => {
  const sentDate = moment(message.sent_at, "h:mm a | MMMM DD, YYYY");
  const { id, chatBy } = useParams();
  let activeConversation;
  let activeConversationContact;
  if (chatBy === "contact") {
    activeConversation = users.find((user) => user.id === parseInt(id));
  } else {
    activeConversationContact = conversations.find(
      (item) => item.id === parseInt(id)
    );
    activeConversation = activeConversationContact?.contact;
  }
  return (
    <Div
      sx={{
        display: "flex",
        alignItems: "flex-start",
        mb: 2,
        px: 3,
        "& .Message-item": {
          marginTop: "2px",
        },
      }}
    >
      {message?.message_type !== "text" ? (
        <div className="Message-item">
          <Paper
            elevation={0}
            sx={{
              p: (theme) => theme.spacing(1.5, 2),
              bgcolor: "primary.main",
              color: "common.white",
            }}
          >
            <Typography variant={"body1"}>{message?.message}</Typography>
          </Paper>
        </div>
      ) : (
        <React.Fragment>
          <Avatar
            alt="Remy Sharp"
            src={activeConversation?.profile_pic}
            sx={{ width: 40, height: 40, mr: 2 }}
          />
          <div className="Message-root">
            <Typography
              variant={"body1"}
              color={"text.secondary"}
              fontSize={"smaller"}
              mb={0.5}
            >
              {activeConversation?.name} - {sentDate.format("h:mm A")}
            </Typography>
            <div className="Message-item">
              <Paper
                elevation={0}
                sx={{
                  p: (theme) => theme.spacing(1.5, 2),
                  bgcolor: "primary.main",
                  color: "common.white",
                }}
              >
                <Typography variant={"body1"}>{message?.message}</Typography>
              </Paper>
            </div>
          </div>
        </React.Fragment>
      )}
    </Div>
  );
};

export { ReceivedMessageContent };
