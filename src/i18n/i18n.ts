import fr from './fr.json'

interface Translation {
    [key: string]: string
}

export const t = (key: string, parameter = '') => {
    const translations = fr as Translation
    if (translations.hasOwnProperty(key)) {
        const translation = translations[key]
        return translation.replace('$', parameter)
    }
    return key
}
