/* global
    jest, test, expect
*/

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import CreditCardField from '../credit-card'

test('CreditCardField onChange', () => {
    const onChange = jest.fn();
    const field = mount(<CreditCardField onChange={onChange}/>);

    const input = field.find('input[type="text"]')

    expect(input.length).toBe(1);

    input.simulate('change', {
        target: {
            value: "tt"
        }
    })
    expect(onChange).not.toBeCalled();


    input.simulate('change', {
        target: {
            value: "9"
        }
    })
    expect(onChange).toBeCalledWith('9');
})