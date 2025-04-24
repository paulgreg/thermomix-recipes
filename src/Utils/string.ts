export const replaceStars = (str: string) => str.replaceAll('*', '⭐')

export const removeAccent = (str: string) =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

export const replaceSpecialCharBySpace = (str: string) =>
    str.replace(/[-_'`"()[\]]/g, ' ')
