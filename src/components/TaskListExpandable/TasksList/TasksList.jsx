import { List } from "@mui/material";
import { TaskItem } from "../TaskItem";

const TaskList = ({ tasks }) => {
  return (
    <List disablePadding>
      {tasks.map((task, index) => (
        <TaskItem task={task} key={index} />
      ))}
    </List>
  );
};

export { TaskList };
