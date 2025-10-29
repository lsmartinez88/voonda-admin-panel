import React from "react";
import { ActiveConversationChat } from "../ActiveConversationChat";
/** todo : change any typescript */
const chatGroupedByDate = (array, key) =>
  Object.entries(
    array.reduce((result, { [key]: k, ...rest }) => {
      (result[k] = result[k] || []).push(rest);
      return result;
    }, {})
  ).map(([sent_date, messages]) => ({
    sent_date,
    messages,
  }));
const ConversationChatGroupByDate = ({ activeConversation }) => {
  const conversationMessages = React.useMemo(() => {
    if (activeConversation)
      return chatGroupedByDate(activeConversation?.messages, "sent_date");

    return [];
  }, [activeConversation]);
  return (
    <React.Fragment>
      {conversationMessages?.map((messagesGroupByDate, index) => (
        <ActiveConversationChat
          key={index}
          conversation={messagesGroupByDate}
        />
      ))}
    </React.Fragment>
  );
};

export { ConversationChatGroupByDate };
