import { createContext, useContext } from 'react'
import { CookBook } from './Types'

type DataContextType = {
    key: string | null
    cookBook: CookBook
    loaded: boolean
    availableTags: string[]
    initLoad: (cookbookName?: string) => Promise<void>
    load: (key: string) => Promise<void>
    save: (key: string, cookBook: CookBook) => Promise<void>
    addOrEditCategory: (name: string, maybeId?: number) => Promise<number>
    deleteCategory: (id: number) => Promise<void>
    addOrEditRecipe: (
        categoryId: number,
        name: string,
        recipe: string,
        tags: string[],
        maybeId?: number
    ) => Promise<number>
    deleteRecipe: (id: number) => Promise<void>
}

export const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)
