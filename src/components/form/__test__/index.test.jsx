/* global
    jest, test, expect
*/

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import Form from '../index'
import TextField from '../text-field'
import Button from '../button'

test('Form injectedChildren', () => {
    const ogOnChange = jest.fn();
    const ogOnClick = jest.fn();
    const onSubmit = jest.fn();

    const form = mount(<Form onSubmit={onSubmit}>
            [
                <TextField key={0} name="test" onChange={ogOnChange} value=""/>,
                <Button key={1} onClick={ogOnClick} submit/>
            ]
        </Form>)

    const field = form.find('input[type="text"]');

    expect(field.props().onChange).not.toBe(ogOnChange);

    form.instance().onValueChanged('test', 'a');

    const event = {preventDefault: jest.fn()};

    form.instance().onSubmit(event);

    expect(event.preventDefault).toBeCalled();
    expect(onSubmit).toBeCalledWith({'test': 'a'});
})