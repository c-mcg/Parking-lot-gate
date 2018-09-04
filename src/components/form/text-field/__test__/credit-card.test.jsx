import React from 'react'

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import CreditCardField from '../credit-card'

test('CreditCardField onChange', () => {
    let onChange = jest.fn();
    let field = mount(<CreditCardField onChange={onChange}/>);

    let input = field.find('input[type="text"]')
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