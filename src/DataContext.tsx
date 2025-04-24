import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
import type { Recipe } from './Types'
import settings from './settings.json'
import { getId } from './Utils/id'
import * as jsonpatch from 'fast-json-patch'
import { CookBook } from './Types'
import { debounce } from './Utils/debounce'

const DEBOUNCE_SAVE_TIME = 2000

const KEY_NAME = 'THERMOMIXRECIPES_KEY'

type DataContextType = {
    key: string | null
    cookBook: CookBook
    loaded: boolean
    availableTags: string[]
    initLoad: () => Promise<void>
    load: (key: string) => Promise<void>
    save: (key: string, cookBook: CookBook) => Promise<void>
    addCategory: (name: string) => Promise<void>
    renameCategory: (id: string, newName: string) => Promise<void>
    deleteCategory: (id: string) => Promise<void>
    addOrEditRecipe: (
        categoryId: string,
        name: string,
        recipe: string,
        tags: string[],
        id?: string
    ) => Promise<string>
    deleteRecipe: (id: string) => Promise<void>
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
                        return []
                    }
                })
                .catch((e) => {
                    console.error(e)
                    alert('error while loading json')
                }),
        []
    )

    const convertIdToString = (cookBook: CookBook): CookBook => {
        const categories = cookBook.categories.map((category) => ({
            ...category,
            id: String(category.id),
        }))
        const recipes = cookBook.recipes.map((recipe) => ({
            ...recipe,
            categoryId: String(recipe.categoryId),
            id: String(recipe.id),
        }))

        return { categories, recipes, lastSave: cookBook.lastSave }
    }

    const sortCookBook = (cookBook: CookBook): CookBook => ({
        ...cookBook,
        categories: cookBook.categories.toSorted((c1, c2) =>
            c1.name.localeCompare(c2.name)
        ),
        recipes: cookBook.recipes.toSorted((r1, r2) =>
            r1.name.localeCompare(r2.name)
        ),
    })

    const load = useCallback(
        async (key: string) => {
            setKey(key)
            localStorage.setItem(KEY_NAME, key)
            let serverData, localData

            const rawData = localStorage.getItem(key)
            if (rawData) {
                localData = sortCookBook(JSON.parse(rawData) ?? EMPTY_COOKBOOK)
            }

            const json = await loadOnline(key)
            if (json) {
                serverData = sortCookBook(
                    convertIdToString(json) ?? EMPTY_COOKBOOK
                )
            }

            setCookBook(serverData ?? localData ?? EMPTY_COOKBOOK)
            setPreviousCookBook(serverData ?? EMPTY_COOKBOOK)
        },
        [loadOnline, setCookBook, setPreviousCookBook]
    )

    const initLoad = async () => {
        const key = localStorage.getItem(KEY_NAME)
        if (key) await load(key)
        setLoaded(true)
    }

    const save = useCallback(
        async (key: string, cookBook: CookBook) => {
            cookBook.lastSave = Date.now()
            const sortedCookBook = sortCookBook(cookBook)
            localStorage.setItem(KEY_NAME, key)
            localStorage.setItem(key, JSON.stringify(sortedCookBook))
            saveOnline(key, sortedCookBook, previousCookBook, newDoc)
            setCookBook(sortedCookBook)
        },
        [previousCookBook, newDoc]
    )

    const saveOnline = useCallback(
        debounce(
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
            DEBOUNCE_SAVE_TIME
        ),
        []
    )

    const addCategory = useCallback(
        async (name: string) => {
            const categories = cookBook.categories.concat({
                id: getId(),
                name,
            })
            const newCookbook = {
                ...cookBook,
                categories,
            }
            setCookBook(newCookbook)
            if (key) await save(key, newCookbook)
        },
        [cookBook, key]
    )

    const renameCategory = useCallback(
        async (id: string, newName: string) => {
            const newCookbook = {
                ...cookBook,
                categories: cookBook.categories.map((category) =>
                    String(category.id) === id
                        ? {
                              ...category,
                              name: newName,
                          }
                        : category
                ),
            }
            setCookBook(newCookbook)
            if (key) await save(key, newCookbook)
        },
        [cookBook, key]
    )
    const deleteCategory = async (id: string) => {
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
        async (id: string) => {
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
            categoryId: string,
            name: string,
            recipe: string,
            tags: string[],
            maybeId?: string
        ) => {
            const id = maybeId ?? getId()
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
            addCategory,
            renameCategory,
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
