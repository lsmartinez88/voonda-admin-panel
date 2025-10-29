import React from "react";
import { Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { StyledMenu } from "@/components/StyledMenu";
import { filtersOptions } from "../../data";
import { FilterItem } from "./FilterItem";

const FiltersList = () => {
  const { category } = useParams();
  return (
    <React.Fragment>
      <Typography
        variant={"h6"}
        color={"text.secondary"}
        sx={{
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontSize: "11px",
        }}
      >
        Filter
      </Typography>
      <StyledMenu sx={{ mb: 2 }}>
        {filtersOptions.map((filter, index) => (
          <FilterItem
            key={index}
            slug={filter.slug}
            name={filter.name}
            icon={filter.icon}
            selected={filter.slug === category}
          />
        ))}
      </StyledMenu>
    </React.Fragment>
  );
};

export { FiltersList };
