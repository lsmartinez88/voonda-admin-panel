import React from "react";
import { JumboScrollbar } from "@jumbo/components";
import { conversations, users } from "../data";
import { useParams } from "react-router-dom";
import { idGenerator } from "@jumbo/utilities/systemHelpers";
import { ContentPlaceholder } from "./ContentPlaceholder";
import { ActiveConversationHeader } from "./ActiveConversationHeader";
import { ConversationChatGroupByDate } from "./ConversationChatGroupByDate";
import { ActiveConversationFooter } from "./ActiveConversationFooter";

const ChatAppContent = () => {
  const { id, chatBy } = useParams();
  /** todo: change type activeConversation */
  let activeConversation;
  if (chatBy === "contact") {
    if (id) {
      const conversationIndex = conversations.findIndex((conversation) => {
        return (
          (conversation.first_user_id === parseInt(id) &&
            conversation.second_user_id === 1) ||
          (conversation.second_user_id === parseInt(id) &&
            conversation.first_user_id === 1)
        );
      });
      let conversation;
      if (conversationIndex === -1) {
        conversation = {
          id: idGenerator(),
          first_user_id: parseInt(id),
          second_user_id: 1,
          contact: users.find((user) => user.id === parseInt(id)),
          messages: [],
        };
        conversations.push(conversation);
      } else {
        activeConversation = conversations[conversationIndex];
      }
      activeConversation.last_message =
        activeConversation?.messages.length > 0
          ? activeConversation.messages[activeConversation?.messages.length - 1]
          : undefined;
    }
  } else {
    const conversationIndex = conversations.findIndex(
      (conversation) => conversation.id === parseInt(id)
    );
    activeConversation = conversations[conversationIndex];
  }
  if (!id) {
    return <ContentPlaceholder />;
  } else {
    return (
      <React.Fragment>
        <ActiveConversationHeader activeConversation={activeConversation} />
        <JumboScrollbar
          autoHide
          autoHideDuration={200}
          autoHideTimeout={500}
          autoHeightMin={30}
          style={{ minHeight: 200 }}
        >
          <ConversationChatGroupByDate
            activeConversation={activeConversation}
          />
        </JumboScrollbar>
        <ActiveConversationFooter />
      </React.Fragment>
    );
  }
};

export { ChatAppContent };
