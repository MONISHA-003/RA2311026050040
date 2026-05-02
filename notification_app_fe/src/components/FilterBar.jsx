import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { Filter } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ currentFilter, onFilterChange }) => {
  return (
    <Box className="filter-bar-container glass-card">
      <div className="filter-label-group">
        <Filter size={20} className="filter-icon" />
        <span className="filter-text">Category Filter</span>
      </div>
      
      <FormControl variant="filled" size="small" className="filter-form-control">
        <InputLabel id="type-filter-label" sx={{ color: 'var(--text-muted)' }}>Type</InputLabel>
        <Select
          labelId="type-filter-label"
          id="type-filter"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            color: 'var(--text-main)',
            '.MuiSvgIcon-root': { color: 'var(--text-muted)' },
            '&:before': { borderBottomColor: 'var(--glass-border)' },
            '&:after': { borderBottomColor: 'var(--primary)' },
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
          }}
        >
          <MenuItem value="All">All Notifications</MenuItem>
          <MenuItem value="Event">Events Only</MenuItem>
          <MenuItem value="Result">Results Only</MenuItem>
          <MenuItem value="Placement">Placements Only</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;
