import React from 'react';
import { shallow } from 'enzyme';
import ErrorBoundary from './ErrorBoundary';

let wrapper;

let TestComponent = () => <div>This is a test component</div>;

beforeEach(() => wrapper = shallow(<ErrorBoundary><TestComponent /></ErrorBoundary>));

afterEach(() => wrapper.unmount());

describe('<ErrorBoundary />', () => {

    it('should display correctly', () => expect(wrapper).toMatchSnapshot());

    it('should return an error indicator component if there is something wrong on a component', () => {
        let withErrorBoundary = wrapper.shallow();
        let actualComponent = shallow(<TestComponent />);
        expect(withErrorBoundary).toEqual(actualComponent);
        //setState is async
        wrapper.setState({ hasError: true }, () => {
            withErrorBoundary = wrapper.shallow();
            expect(withErrorBoundary).not.toEqual(actualComponent);
        });
    });
    
});
