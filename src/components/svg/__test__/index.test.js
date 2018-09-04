/*global
    test, expect
*/


import {SVGS} from '../index'

test('SVG null check', () => {

    Object.values(SVGS).forEach((svg) => {
        expect(svg).not.toBe(null)
    })

})