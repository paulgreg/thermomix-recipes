import { replaceSpecialCharBySpace } from './string'

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
})
