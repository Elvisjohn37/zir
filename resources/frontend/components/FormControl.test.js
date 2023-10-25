import React from 'react';
import { shallow } from 'enzyme';
import FormControl from './FormControl';

let wrapper;

beforeEach(() => wrapper = shallow(<FormControl />));

afterEach(() => wrapper.unmount());

describe('<FormControl />', () => {

    it('should render correctly', () => expect(wrapper).toMatchSnapshot());

    it('should trigger error message when error property is present', () => {
        let withoutErrorMessage = shallow(<FormControl />);
        wrapper.setProps({ error: { message: "testError" }, formHelperTextProps: { className: "form_helper_text" } });
        expect(withoutErrorMessage.find('.form_helper_text')).toHaveLength(0);
        expect(wrapper.find('.form_helper_text')).toHaveLength(1);
    });

    it('should display form label when formLabel property is present', () => {
        let withoutFormLabel = shallow(<FormControl />);
        wrapper.setProps({ formLabel: "testFormLabel", formLabelProps: { className: "form_label" } });
        expect(withoutFormLabel.find('.form_label')).toHaveLength(0);
        expect(wrapper.find('.form_label')).toHaveLength(1);
    });

    it('should display input label when inputLabel property is present', () => {
        let withoutInputLabel = shallow(<FormControl />);
        wrapper.setProps({ inputLabel: "testInputLabel", inputLabelProps: { className: "input_label" } });
        expect(withoutInputLabel.find('.input_label')).toHaveLength(0);
        expect(wrapper.find('.input_label')).toHaveLength(1);
    });

});
