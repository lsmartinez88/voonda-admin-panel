import styled from "@emotion/styled";
import { JumboScrollbar } from "@jumbo/components";
import { useJumboTheme } from "@jumbo/components/JumboTheme/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { ProductSaleItem } from "../ProductSaleItem";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none",
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
}));

const ProductSalesList = ({ products }) => {
  const { theme } = useJumboTheme();
  return (
    <JumboScrollbar
      autoHeight={true}
      autoHeightMin={274}
      hideTracksWhenNotNeeded
    >
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ pl: 3 }} theme={theme}>
              Product
            </StyledTableCell>
            <StyledTableCell align={"right"} theme={theme}>
              Sales
            </StyledTableCell>
            <StyledTableCell theme={theme} />
            <StyledTableCell theme={theme} sx={{ pr: 3 }} align={"right"}>
              Revenue
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <ProductSaleItem item={product} key={index} />
          ))}
        </TableBody>
      </Table>
    </JumboScrollbar>
  );
};

export { ProductSalesList };
