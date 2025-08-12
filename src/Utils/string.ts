import { NamedEntity } from '../Types'

export const replaceStars = (str: string) => str.replaceAll('*', '⭐')

export const removeAccent = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const replaceSpecialCharBySpace = (str: string) =>
    str?.replace(/[-_'`"()[\]]/g, ' ')

export const sortByName = (o1: NamedEntity, o2: NamedEntity) =>
    o1.name.localeCompare(o2.name)

export const slugify = (s: string | null) =>
    replaceSpecialCharBySpace(s || '')
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with dashes
