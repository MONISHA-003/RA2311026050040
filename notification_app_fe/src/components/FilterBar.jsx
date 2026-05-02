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
        <InputLabel id="type-filter-label" sx={{ color: currentFilter === 'All' ? 'white' : 'var(--text-muted)' }}>Type</InputLabel>
        <Select
          labelId="type-filter-label"
          id="type-filter"
          value={currentFilter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            // Logic: White text if 'All', Black text after selection
            color: currentFilter === 'All' ? 'white' : 'black',
            '.MuiSvgIcon-root': { color: currentFilter === 'All' ? 'white' : 'var(--text-muted)' },
            '&:before': { borderBottomColor: 'var(--glass-border)' },
            '&:after': { borderBottomColor: 'var(--primary)' },
            backgroundColor: currentFilter === 'All' ? 'rgba(0,0,0,0.2)' : 'rgba(255, 255, 255, 0.5)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.25)' },
            fontWeight: '600',
            borderRadius: '8px'
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
