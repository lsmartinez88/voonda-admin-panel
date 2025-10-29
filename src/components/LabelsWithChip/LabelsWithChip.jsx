import { Stack, Chip } from "@mui/material";
import { getArrayElementFromKey } from "@jumbo/utilities/systemHelpers";
import { colorForBgColor } from "@jumbo/utilities/styleHelpers";
import { labels } from "./data";

export const LabelsWithChip = ({
  labelsArray,
  max = -1,
  onClick,
  sx,
  mapKeys,
  defaultColor = "#DDDDDD",
  spacing,
  ...restProps
}) => {
  const chips = labels.filter((label) => labelsArray?.includes(label?.id));
  const chipsToShow = max !== -1 ? chips.slice(0, max) : chips;
  return (
    <Stack direction={"row"} spacing={spacing}>
      {chipsToShow.map((chip, index) => {
        const label = chip?.name
          ? chip.name
          : getArrayElementFromKey(chip, mapKeys?.label);
        const bgColor = chip?.color ? chip.color : defaultColor;
        const color = colorForBgColor(bgColor);
        return (
          <Chip
            key={index}
            label={label}
            sx={{
              bgcolor: bgColor,
              color: color,
              ...sx,
            }}
            {...restProps}
          />
        );
      })}
      {chipsToShow.length < chips.length && (
        <Chip
          label={`+${chips.length - chipsToShow.length}`}
          size={restProps?.size}
        />
      )}
    </Stack>
  );
};
