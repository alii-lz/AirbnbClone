import React from 'react';
import Enzyme, { shallow } from 'enzyme'

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Register from './pages/Register';
import CreateListing from './pages/CreateListing';
import SearchPanel from './components/SearchBar';
import AmenitiesCheckboxes from './components/AmenitiesCheckboxes';
import BasicModal from './components/BasicModal';
import InputDropdown from './components/InputDropdown';

const mockUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

describe('<Register/>', () => {
  it('Should render a registration Page', () => {
    Enzyme.configure({ adapter: new Adapter() });
    // Render a single register Form
    const wrapper = shallow(<Register/>)
    const form = wrapper.find({ name: 'Registration-grid' })
    expect(form).toHaveLength(1)
    // Should have a register Heading
    const text = wrapper.find('h2')
    expect(text).toHaveLength(1)
    expect(text.text()).toEqual('Register');

    // Find input for name
    const nameInput = wrapper.find({ name: 'form-input-name' })
    expect(nameInput).toHaveLength(1)
    // Find input for email
    const emailInput = wrapper.find({ name: 'form-input-email' })
    expect(emailInput).toHaveLength(1)

    const passwordInput = wrapper.find({ name: 'form-input-password' })
    expect(passwordInput).toHaveLength(1)

    const confirmPasswordInput = wrapper.find({ name: 'form-input-password-confirm' })
    expect(confirmPasswordInput).toHaveLength(1)

    const submit = wrapper.find({ name: 'Registration-form-submit' })
    expect(submit).toHaveLength(1)
    expect(submit.text()).toEqual('Submit')
  })
})

describe('<Create Listing/>', () => {
  it('Should Create a listing', () => {
    const click = jest.fn()
    Enzyme.configure({ adapter: new Adapter() });
    const wrapper = shallow(<CreateListing/>)
    const form = wrapper.find('form')
    expect(form).toHaveLength(1)
    const title = wrapper.find({ name: 'createListing-Title' })
    expect(title.text()).toEqual('Enter Listing Details')

    // <submitListingButton/>
    const upload = shallow(<submitListingButton onClick = {click}/>)
    upload.simulate('click')
    expect(click).toHaveBeenCalledTimes(1)
  })
})

describe('<Search Bar>', () => {
  it('Should Create a listing', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const wrapper = shallow(<SearchPanel/>)
    const form = wrapper.find({ name: 'Price-slider' })
    expect(form).toHaveLength(1)
  })
})

describe('<Amenities Checkbox>', () => {
  const noop = () => {}
  it('Should Display the correct amentity checkbox option', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const amenities = ['Gym']
    const wrapper = shallow(<AmenitiesCheckboxes selectedAmenities={amenities} onChange={noop}/>)

    const gymCheckbox = wrapper.find({ label: 'Gym' }).dive()
    const gymCheck = gymCheckbox.find({ name: 'Gym' })
    const poolCheckbox = wrapper.find({ label: 'Pool' }).dive()
    const poolCheck = poolCheckbox.find({ name: 'Pool' })
    const balconyCheckbox = wrapper.find({ label: 'Balcony' }).dive()
    const balconyCheck = balconyCheckbox.find({ name: 'Balcony' })

    // expect All amenities checkbox to show up
    expect(gymCheckbox).toHaveLength(1)
    expect(poolCheckbox).toHaveLength(1)
    expect(balconyCheckbox).toHaveLength(1)
    // The gym checkbox should be ticked all other options should be false
    expect(gymCheck.props().checked).toBe(true)
    expect(poolCheck.props().checked).toBe(false)
    expect(balconyCheck.props().checked).toBe(false)
  })
})

describe('<Booking Confirmation>', () => {
  it('should display a success message and Modal popup and display the dates for the booking', () => {
    Enzyme.configure({ adapter: new Adapter() });

    const content = 'Booking from 12-02-2021 to 14-02-2021'
    const header = 'Booking Made!!'
    const wrapper = shallow(<BasicModal open={true} setOpen={true} content={content} header={header}/>)

    const heading = wrapper.find({ name: 'header' })
    expect(heading.text()).toEqual(header)

    const message = wrapper.find({ name: 'content' })
    expect(message.text()).toEqual(content)
  })
})

describe('<Input DropDown>', () => {
  let value = 'Lowest to Highest'
  const noop = (newValue) => {
    value = newValue
  }
  it('should display the correct dropdown options', () => {
    Enzyme.configure({ adapter: new Adapter() });
    const label = 'Reviews'
    const options = ['Lowest to Highest', 'Highest to Lowest']
    const wrapper = shallow(<InputDropdown label={label} options={options} value={value} onChange={noop}/>)

    const heading = wrapper.find({ name: 'inputLabel' })
    expect(heading.text()).toEqual(label)

    const dropdown = wrapper.find({ name: 'select-dropdown' })
    expect(dropdown.text()).toEqual('Lowest to HighestHighest to Lowest')
    expect(dropdown.props().value).toEqual(value)
    // Test changing dropdown option
    dropdown.simulate('change', 'Highest to Lowest')
    expect(value).toEqual('Highest to Lowest')
  })
})
