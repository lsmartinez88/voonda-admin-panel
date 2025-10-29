import { JumboScrollbar, JumboTabs } from "@jumbo/components";
import { JumboDdMenu } from "@jumbo/components/JumboDdMenu";
import { Close, MoreHoriz } from "@mui/icons-material";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import React from "react";
import { TaskItem } from "./TaskItem";
import { tasks } from "./data";
import PropTypes from "prop-types";
import { CardHeaderWithExtras } from "@/components/CardHeaderWithExtras";

const filterTabs = [
  { label: "All Tasks", value: 0 },
  { label: "My Tasks", value: 100 },
];

const TasksList2 = ({ scrollHeight, title }) => {
  const [filterOptions, setFilterOptions] = React.useState({
    id: 0,
  });

  const handleTabChange = React.useCallback((item) => {
    setFilterOptions({
      id: item.value,
    });
  }, []);

  const visibleTasks = tasks.filter((item) => {
    if (!filterOptions.id) return true;

    return item.user.id === filterOptions.id;
  });

  return (
    <Card>
      <CardHeaderWithExtras
        title={title}
        extras={
          <JumboTabs
            items={filterTabs}
            onChange={handleTabChange}
            primaryKey="value"
            labelKey="label"
            defaultValue={filterTabs[0]}
          />
        }
        action={
          <JumboDdMenu
            menuItems={[
              { icon: <MoreHoriz />, title: "More Detail" },
              { icon: <Close />, title: "Close" },
            ]}
          />
        }
        spacing={3}
        sx={{
          borderBottom: 1,
          borderBottomColor: "divider",
        }}
      />
      <CardContent sx={{ p: 0 }}>
        <JumboScrollbar
          autoHeight
          autoHeightMin={scrollHeight ? scrollHeight : 392}
        >
          {visibleTasks.map((task) => (
            <TaskItem key={task.id} item={task} />
          ))}
        </JumboScrollbar>
      </CardContent>
    </Card>
  );
};

export { TasksList2 };

TasksList2.propTyeps = {
  title: PropTypes.node.isRequired,
  scrollHeight: PropTypes.number,
};
