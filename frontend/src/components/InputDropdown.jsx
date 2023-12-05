import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

const InputDropdown = ({ label, options, value, onChange }) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel name = 'inputLabel' id={`demo-simple-select-label-${label}`}>{label}</InputLabel>
        <Select
          name = 'select-dropdown'
          labelId={`demo-simple-select-label-${label}`}
          id={`demo-simple-select-${label}`}
          value={value}
          label={label}
          onChange={onChange}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default InputDropdown;
