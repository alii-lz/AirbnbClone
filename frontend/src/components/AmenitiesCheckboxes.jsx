import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const AmenitiesCheckboxes = ({ selectedAmenities, onChange }) => {
  const amenitiesOptions = ['Gym', 'Pool', 'Balcony'];

  const handleSelect = (e) => {
    const amenity = e.target.name;

    if (e.target.checked) {
      onChange([...selectedAmenities, amenity]);
    } else {
      onChange(selectedAmenities.filter((a) => a !== amenity));
    }
  };

  return (
    <FormGroup>
      {amenitiesOptions.map((amenity) => (
        <FormControlLabel
          key={amenity}
          control={
            <Checkbox
              checked={selectedAmenities.includes(amenity)}
              onChange={handleSelect}
              name={amenity}
            />
          }
          label={amenity}
        />
      ))}
    </FormGroup>
  );
};

export default AmenitiesCheckboxes;
