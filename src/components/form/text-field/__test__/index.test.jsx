/* global
    jest, test, expect
*/

import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

import TextField from '../index'

test('TextField onChange', () => {
    const onChange = jest.fn();
    const field = shallow(<TextField maxLength={4} value="tes" onChange={onChange}/>).find('input[type="text"]');

    expect(field).toBeTruthy();

    field.simulate('change', {
        target: {
            value: "test01234"
        }
    })

    expect(onChange).toBeCalledWith('test');
})