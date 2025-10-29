import { Div } from "@jumbo/shared";
import { Button, Popover } from "@mui/material";
import React from "react";
import { CheckboxList } from "../CheckboxList";
import { ProductAvatars } from "../ProductAvatars";

const ProductSelectionControl = ({
  items,
  selectedItems,
  onSelectedChanged,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  return (
    <Div
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(1, 3),
      }}
    >
      {selectedItems.length > 0 && <ProductAvatars items={selectedItems} />}
      <Button
        variant={"contained"}
        color={"inherit"}
        disableElevation
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        +ADD
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <CheckboxList
          items={items}
          selectedItems={selectedItems}
          onCheckboxChange={onSelectedChanged}
        />
      </Popover>
    </Div>
  );
};

export { ProductSelectionControl };
