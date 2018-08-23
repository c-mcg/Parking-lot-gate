import React from 'react'

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import NumberField from '../number'

test('NumberField onChange', () => {
    var onChange = jest.fn();
    var field = mount(<NumberField onChange={onChange}/>);

    var input = field.find('input[type="text"]')
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