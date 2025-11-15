import { Box, Button, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";

const VehiclesPagination = ({ pagination, onPageChange, limit }) => {
    const [currentPage, setCurrentPage] = useState(pagination?.page || 1);

    // Sincronizar con la pagination externa
    useEffect(() => {
        setCurrentPage(pagination?.page || 1);
    }, [pagination?.page]);

    const totalPages = pagination?.pages || 0;

    const handleChange = (_, pageNumber) => {
        setCurrentPage(pageNumber);
        onPageChange(pageNumber);
    };

    const handlePrevious = () => {
        const newPage = Math.max(currentPage - 1, 1);
        setCurrentPage(newPage);
        onPageChange(newPage);
    };

    const handleNext = () => {
        const newPage = Math.min(currentPage + 1, totalPages);
        setCurrentPage(newPage);
        onPageChange(newPage);
    };

    // No mostrar paginación si no hay páginas o solo hay una
    if (!pagination || totalPages <= 1) {
        return null;
    }

    return (
        <Box display="flex" alignItems="center" justifyContent="center">
            <Button
                variant="outlined"
                disabled={currentPage === 1}
                onClick={handlePrevious}
                sx={{
                    mr: 2,
                    borderRadius: 5,
                    textTransform: "none",
                    letterSpacing: 0,
                    fontSize: 13,
                }}
            >
                Previous
            </Button>

            {/* Pagination */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handleChange}
                color="primary"
                shape="rounded"
                hideNextButton
                hidePrevButton
            />

            <Button
                variant="outlined"
                disabled={currentPage === totalPages}
                onClick={handleNext}
                sx={{
                    ml: 2,
                    borderRadius: 5,
                    textTransform: "none",
                    letterSpacing: 0,
                    fontSize: 13,
                }}
            >
                Next
            </Button>
        </Box>
    );
};

export { VehiclesPagination };