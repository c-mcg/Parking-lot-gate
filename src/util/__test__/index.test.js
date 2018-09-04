/*global
    test, expect
*/

import React from 'react'

import {
    cls,
    splitStringIntoChunks,
    formatDate,
    formatTime,
    componentInstanceOf
} from '../index'

const TEST_DATE = new Date('December 17, 1995 23:24:00');

class MockParentParent extends React.Component {
}

class MockParent extends MockParentParent {
}

class MockComponent extends MockParent {
}

test('cls', () => {
    const parentClassName = "MockParent"
    const className = 'MockComponent';

    var mockComponent = new MockComponent({});

    var baseClassName = cls(mockComponent);
    expect(baseClassName.indexOf(className)).not.toBe(-1);
    expect(baseClassName.indexOf(parentClassName)).toBe(-1);
    expect(baseClassName.length).toBe(className.length);

    var childClassName = cls(mockComponent, 'child', {
        show: true
    })
    expect(childClassName.indexOf(className)).not.toBe(-1);
    expect(childClassName.indexOf(parentClassName)).toBe(-1);
    expect(childClassName.indexOf(className + '-child')).not.toBe(-1);
    expect(childClassName.indexOf(className + '-child--show')).not.toBe(-1);

    var childClassNameHidden = cls(mockComponent, 'child', {
        show: false
    })
    expect(childClassNameHidden.indexOf(className)).not.toBe(-1);
    expect(childClassNameHidden.indexOf(parentClassName)).toBe(-1);
    expect(childClassNameHidden.indexOf(className + '-child')).not.toBe(-1);
    expect(childClassNameHidden.indexOf(className + '-child--show')).toBe(-1);
});

test('splitStringIntoChunks', () => {
    const str = "0123456789"
    const expectedChunks = {
        "3": [
            '012',
            '345',
            '678',
            '9'
        ],
        "4": [
            '0123',
            '4567',
            '89'
        ],
        "5": [
            '01234',
            '56789'
        ]
    }

    Object.keys(expectedChunks).forEach((numChunks) => {
        numChunks = parseInt(numChunks);

        var result = splitStringIntoChunks(str, numChunks);

        expect(result).toEqual(expectedChunks[numChunks]);
    })
})

test('formatDate', () => {
    expect(formatDate(TEST_DATE)).toBe('12/17/1995');
})

test('formatTime', () => {
    expect(formatTime(TEST_DATE)).toBe('23:24:00');
})

test('componentInstanceOf', () => {

    var mock = new MockComponent();
    expect(componentInstanceOf(mock, MockComponent)).toBe(true);
    expect(componentInstanceOf(mock, MockParent)).toBe(true);
    expect(componentInstanceOf(mock, MockParentParent)).toBe(true);


    var mockParent = new MockParent();
    expect(componentInstanceOf(mockParent, MockComponent)).toBe(false);
    expect(componentInstanceOf(mockParent, MockParent)).toBe(true);
    expect(componentInstanceOf(mockParent, MockParentParent)).toBe(true);

    var mockParentParent = new MockParentParent();
    expect(componentInstanceOf(mockParentParent, MockComponent)).toBe(false);
    expect(componentInstanceOf(mockParentParent, MockParent)).toBe(false);
    expect(componentInstanceOf(mockParentParent, MockParentParent)).toBe(true);
})