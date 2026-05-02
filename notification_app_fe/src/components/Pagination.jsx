import React from 'react';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';
import './Pagination.css';

const CustomPagination = ({ count, page, onChange }) => {
  return (
    <Box className="pagination-container">
      <Pagination 
        count={count} 
        page={page} 
        onChange={onChange} 
        variant="outlined" 
        shape="rounded" 
        size="large"
        color="primary"
      />
    </Box>
  );
};

export default CustomPagination;
