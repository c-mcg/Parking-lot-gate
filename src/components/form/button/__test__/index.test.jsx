import React from 'react'

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Button from '../index'

test('Button submit', () => {
    let onClick = jest.fn();
    let button = mount(<Button submit onClick={onClick}/>).find('input[type="submit"]');

    expect(button).toBeTruthy();
    expect(button.instance().onClick).not.toBe(onClick);
})

test('Button click', () => {
    let onClick = jest.fn();

    let clickBtn = (button) => {
        expect(button).toBeTruthy();
        button.simulate('click');
    }

    clickBtn(mount(<Button onClick={onClick}/>));
    expect(onClick).toBeCalled();

    clickBtn(mount(<Button submit onClick={onClick}/>));
    expect(onClick.mock.calls.length).toBe(1);
})