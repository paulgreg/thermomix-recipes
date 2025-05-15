import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import type { Recipe } from './Types'
import settings from './settings.json'
import * as jsonpatch from 'fast-json-patch'
import { CookBook } from './Types'

const KEY_NAME = 'THERMOMIXRECIPES_KEY'

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

const EMPTY_COOKBOOK = {
    categories: [],
    recipes: [],
    lastSave: 0,
}

const DataContext = createContext<DataContextType>({} as DataContextType)

export const useDataContext = () => useContext(DataContext)

interface DataContextProviderPropsType {
    children: React.ReactNode | React.ReactNode[]
}

const DataContextProvider: React.FC<DataContextProviderPropsType> = ({
    children,
}) => {
    const [loaded, setLoaded] = useState(false)
    const [cookBook, setCookBook] = useState<CookBook>(EMPTY_COOKBOOK)
    const [previousCookBook, setPreviousCookBook] =
        useState<CookBook>(EMPTY_COOKBOOK)
    const [newDoc, setNewDoc] = useState(true)
    const [key, setKey] = useState<string | null>(null)

    const loadOnline = useCallback(
        async (key: string) =>
            fetch(`${settings.saveUrl}/${key}.json`, {
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        setNewDoc(false)
                        return response.json()
                    }
                    if (response.status === 404) {
                        setNewDoc(true)
                        return EMPTY_COOKBOOK
                    }
                })
                .catch((e) => {
                    console.error(e)
                    alert('error while loading json')
                }),
        []
    )

    const load = useCallback(
        async (key: string) => {
            setKey(key)
            localStorage.setItem(KEY_NAME, key)
            let serverData, localData

            const rawData = localStorage.getItem(key)
            if (rawData) localData = JSON.parse(rawData)

            const json = await loadOnline(key)
            if (json) serverData = json

            setCookBook(serverData ?? localData ?? EMPTY_COOKBOOK)
            setPreviousCookBook(serverData ?? EMPTY_COOKBOOK)
        },
        [loadOnline, setCookBook, setPreviousCookBook]
    )

    const initLoad = async (cookbookName?: string) => {
        if (cookbookName) localStorage.setItem(KEY_NAME, cookbookName)

        const key = localStorage.getItem(KEY_NAME)
        if (key) await load(key)
        setLoaded(true)
    }

    const save = useCallback(
        async (key: string, cookBook: CookBook) => {
            cookBook.lastSave = Date.now()
            localStorage.setItem(KEY_NAME, key)
            localStorage.setItem(key, JSON.stringify(cookBook))
            saveOnline(key, cookBook, previousCookBook, newDoc)
        },
        [previousCookBook, newDoc]
    )

    const saveOnline = useCallback(
        (
            key: string,
            data: CookBook,
            previousData: CookBook,
            newDoc: boolean
        ) => {
            let method
            let bodyRaw
            if (!newDoc && previousData) {
                method = 'PATCH'
                bodyRaw = jsonpatch.compare(previousData, data)
            } else {
                method = 'POST'
                bodyRaw = data
            }

            return fetch(`${settings.saveUrl}/${key}.json`, {
                method,
                mode: 'cors',
                headers: {
                    Authorization: `Basic ${settings.authorization}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyRaw),
            }).then(() => {
                setPreviousCookBook(data)
                setNewDoc(false)
            })
        },
        []
    )

    const getNextCategoryId = () => {
        const maxId = cookBook.categories.reduce(
            (maxId, recipe) => Math.max(maxId, recipe.id),
            0
        )
        return maxId + 1
    }
    const getNextRecipeId = () => {
        const maxId = cookBook.recipes.reduce(
            (maxId, recipe) => Math.max(maxId, recipe.id),
            0
        )
        return maxId + 1
    }

    const addOrEditCategory = useCallback(
        async (name: string, maybeId?: number) => {
            const id = maybeId ?? getNextCategoryId()

            const newCategory = {
                id,
                name,
            }

            const categories = maybeId
                ? cookBook.categories.map((category) =>
                      category.id === maybeId ? newCategory : category
                  )
                : cookBook.categories.concat(newCategory)

            const newCookbook = {
                ...cookBook,
                categories,
            }
            setCookBook(newCookbook)
            if (key) await save(key, newCookbook)
            return id
        },
        [cookBook, key]
    )

    const deleteCategory = async (id: number) => {
        const recipeFromThatCategory = cookBook.recipes.find(
            (recipe) => recipe.categoryId === id
        )
        if (recipeFromThatCategory) throw new Error('Category not empty')

        const newCookbook = {
            ...cookBook,
            categories: cookBook.categories.filter(
                (category) => category.id !== id
            ),
        }
        setCookBook(newCookbook)
        if (key) await save(key, newCookbook)
    }

    const deleteRecipe = useCallback(
        async (id: number) => {
            const newCookbook = {
                ...cookBook,
                recipes: cookBook.recipes.filter((recipe) => recipe.id !== id),
            }
            setCookBook(newCookbook)
            if (key) await save(key, newCookbook)
        },
        [cookBook, key]
    )
    const addOrEditRecipe = useCallback(
        async (
            categoryId: number,
            name: string,
            recipe: string,
            tags: string[],
            maybeId?: number
        ) => {
            const id = maybeId ?? getNextRecipeId()
            const newRecipe: Recipe = {
                id,
                categoryId,
                name,
                recipe,
                tags,
            }

            const recipes = maybeId
                ? cookBook.recipes.map((recipe) =>
                      recipe.id === maybeId ? newRecipe : recipe
                  )
                : cookBook.recipes.concat(newRecipe)

            const newCookbook = {
                ...cookBook,
                recipes,
            }
            setCookBook(newCookbook)
            if (key) await save(key, newCookbook)
            return id
        },
        [cookBook, key]
    )

    const availableTags = useMemo(() => {
        const set = new Set<string>()
        const tags: string[] = cookBook.recipes
            .flatMap(({ tags }): string[] => tags || [])
            .filter((tag) => !!tag)
        tags.forEach((tag) => set.add(tag))
        return Array.from(set)
    }, [cookBook])

    const contextValue = useMemo(
        () => ({
            key,
            loaded,
            cookBook,
            availableTags,
            initLoad,
            load,
            save,
            addOrEditCategory,
            deleteCategory,
            addOrEditRecipe,
            deleteRecipe,
        }),
        [cookBook, availableTags, key, load, save]
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider
