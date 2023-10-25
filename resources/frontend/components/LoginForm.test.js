import React from 'react';
import HeaderLoginForm, { LoginSkeleton} from './LoginForm';
import { shallow } from 'enzyme';
import { UserConsumer } from 'frontend/contexts/User';

let wrapperHeaderLoginForm, wrapperLoginSkeleton, testFunction = jest.fn();

beforeEach(() => {
    wrapperHeaderLoginForm = shallow(<HeaderLoginForm />);
    wrapperLoginSkeleton = shallow(<LoginSkeleton count={3} width={70} />);
});

afterEach(() => {
    wrapperHeaderLoginForm.unmount();
    wrapperLoginSkeleton.unmount();
});

describe('<HeaderLoginForm />', () => {

    it('should render corrrectly', () => expect(wrapperHeaderLoginForm).toMatchSnapshot());

    it('should have input field for username, password, forgotPassword and component for submit', () => {
        expect(wrapperHeaderLoginForm.find(UserConsumer).shallow().find('.userName')).toHaveLength(1);
        expect(wrapperHeaderLoginForm.find(UserConsumer).shallow().find('.password')).toHaveLength(1);
        expect(wrapperHeaderLoginForm.find(UserConsumer).shallow().find('.login')).toHaveLength(1);
        expect(wrapperHeaderLoginForm.find(UserConsumer).shallow().find('.forgotPassword')).toHaveLength(1);
    });

    it('should trigger onClick event after user clicks the button', () => {
        let loginWrapper = wrapperHeaderLoginForm.find(UserConsumer).shallow().find('.login').shallow();
        loginWrapper.setProps({ onClick: testFunction });
        loginWrapper.update();
        loginWrapper.props().onClick();
        expect(testFunction).toHaveBeenCalled();
    });
});

describe('<LoginSkeleton />', () => {

    it('should render corrrectly', () => expect(wrapperLoginSkeleton).toMatchSnapshot());
});
