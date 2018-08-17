import React from 'react'

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Form from '../index'
import TextField from '../text-field'
import Button from '../button'

test('Form injectedChildren', () => {
    var ogOnChange = jest.fn();
    var ogOnClick = jest.fn();
    var onSubmit = jest.fn();

    var form = mount(
        <Form onSubmit={onSubmit}>
            [
                <TextField key={0} name="test" onChange={ogOnChange} value=""/>,
                <Button key={1} onClick={ogOnClick} submit/>
            ]
        </Form>
    )

    var field = form.find('input[type="text"]');
    expect(field.props().onChange).not.toBe(ogOnChange);

    form.instance().onValueChanged('test', 'a');

    var event = {preventDefault: jest.fn()};
    form.instance().onSubmit(event);

    expect(event.preventDefault).toBeCalled();
    expect(onSubmit).toBeCalledWith({'test': 'a'});
})