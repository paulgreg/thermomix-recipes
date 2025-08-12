import { createContext, useContext } from 'react'
import { Category, Recipe } from './Types'

type DataContextType = {
    key: string | null
    setKey: (s: string) => void
    categories: Category[]
    recipes: Recipe[]
    availableTags: string[]
    addOrEditCategory: (name: string, maybeId?: number) => number
    deleteCategory: (id: number) => void
    addOrEditRecipe: (
        categoryId: number,
        name: string,
        recipe: string,
        tags: string[],
        maybeId?: number
    ) => number
    deleteRecipe: (id: number) => void
}

export const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)
