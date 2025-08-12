import { replaceSpecialCharBySpace, slugify } from './string'

describe('string', () => {
    describe('replaceSpecialCharBySpace', () => {
        test('should replace special char', () => {
            expect(replaceSpecialCharBySpace("curry d'agneau")).toEqual(
                'curry d agneau'
            )
            expect(replaceSpecialCharBySpace('curry d`agneau')).toEqual(
                'curry d agneau'
            )
            expect(replaceSpecialCharBySpace('curry d"agneau')).toEqual(
                'curry d agneau'
            )
            expect(replaceSpecialCharBySpace('(sans viande)')).toEqual(
                ' sans viande '
            )
            expect(replaceSpecialCharBySpace('[sans viande]')).toEqual(
                ' sans viande '
            )
        })
    })
    describe('slugify', () => {
        test('should handle null', () => expect(slugify(null)).toEqual(''))

        test('should remove space', () => expect(slugify('a a')).toEqual('a-a'))

        test('should trim space', () => expect(slugify('  a  ')).toEqual('a'))

        test('should keep accent', () => expect(slugify('àé')).toEqual('àé'))

        test('should keep uppercase', () =>
            expect(slugify('Test')).toEqual('Test'))
    })
})
