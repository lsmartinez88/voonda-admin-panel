
import { Div } from "@jumbo/shared";
import { Collapse, Typography } from "@mui/material";
import React from "react";
import { TransitionGroup } from "react-transition-group";
import { ConversationItem } from "../ConversationItem";
import { conversations, favorite_users, users } from "../../data";

const FavoriteConversationsList = () => {
  const authUserConversations = conversations.filter((conversation) => {
    if (conversation.first_user_id === 1) {
      return favorite_users.includes(conversation?.second_user_id);
    } else if (conversation.second_user_id === 1) {
      return favorite_users.includes(conversation?.first_user_id);
    }
    return false;
  });
  const chatConversations = authUserConversations.map((conversation) => {
    const userIndex = users.findIndex((user) => {
      if (conversation.first_user_id === 1)
        return user.id === conversation.second_user_id;

      return user.id === conversation.first_user_id;
    });
    conversation.contact = users[userIndex];
    conversation.last_message =
      conversation?.messages?.length > 0
        ? conversation.messages[conversation?.messages.length - 1]
        : undefined;
    return conversation;
  });
  return (
    <React.Fragment>
      <Div
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          p: (theme) => theme.spacing(1.5, 2),
          bgcolor: (theme) => theme.palette.action.hover,
        }}
      >
        <Typography
          sx={{ letterSpacing: 1.5, textTransform: "uppercase" }}
          variant="h6"
          color="text.secondary"
          mb={0}
        >
          <small>Favorites</small>
        </Typography>
      </Div>
      <Div>
        <TransitionGroup>
          {chatConversations?.map((item, index) => (
            <Collapse key={index}>
              <ConversationItem conversationItem={item} />
            </Collapse>
          ))}
        </TransitionGroup>
      </Div>
    </React.Fragment>
  );
};

export { FavoriteConversationsList };
