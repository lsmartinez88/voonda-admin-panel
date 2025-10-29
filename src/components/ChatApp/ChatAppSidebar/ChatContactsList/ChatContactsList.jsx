import { Div } from "@jumbo/shared";
import { Collapse } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { ContactItem } from "../ChatContactItem";
import { users } from "../../data";
const ChatContactsList = () => {
  const usersData = users.filter((user) => user.id !== 1);
  return (
    <Div>
      <TransitionGroup>
        {usersData.map((user, index) => (
          <Collapse key={index}>
            <ContactItem contactItem={user} />
          </Collapse>
        ))}
      </TransitionGroup>
    </Div>
  );
};

export { ChatContactsList };
