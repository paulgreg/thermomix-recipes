import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react'
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
    initLoad: () => Promise<void>
    load: (key: string) => Promise<void>
    save: (key: string, cookBook: CookBook) => Promise<void>
    addCategory: (name: string) => void
    renameCategory: (id: string, newName: string) => void
    deleteCategory: (id: string) => void
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

    const load = useCallback(
        async (key: string) => {
            setKey(key)
            localStorage.setItem(KEY_NAME, key)
            let serverData, localData

            const rawData = localStorage.getItem(key)
            if (rawData) localData = JSON.parse(rawData)

            const json = await loadOnline(key)
            if (json) serverData = convertIdToString(json)

            setCookBook(serverData ?? localData ?? EMPTY_COOKBOOK)
            setPreviousCookBook(serverData ?? EMPTY_COOKBOOK)
        },
        [loadOnline, setCookBook, setPreviousCookBook]
    )

    const initLoad = async () => {
        const key = localStorage.getItem(KEY_NAME)
        if (key) load(key)
    }

    const save = useCallback(
        async (key: string, cookBook: CookBook) => {
            localStorage.setItem(KEY_NAME, key)
            localStorage.setItem(key, JSON.stringify(cookBook))
            saveOnline(key, cookBook, previousCookBook, newDoc)
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
        (name: string) => {
            const categories = cookBook.categories.concat({
                id: getId(),
                name,
            })
            const newCookbook = {
                ...cookBook,
                categories,
            }
            setCookBook(newCookbook)
            if (key) save(key, newCookbook)
        },
        [cookBook, key]
    )

    const renameCategory = useCallback(
        (id: string, newName: string) => {
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
            if (key) save(key, newCookbook)
        },
        [cookBook, key]
    )
    const deleteCategory = (id: string) => {
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
        if (key) save(key, newCookbook)
    }

    const contextValue = useMemo(
        () => ({
            key,
            cookBook,
            initLoad,
            load,
            save,
            addCategory,
            renameCategory,
            deleteCategory,
        }),
        [cookBook, key, load, save]
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider
