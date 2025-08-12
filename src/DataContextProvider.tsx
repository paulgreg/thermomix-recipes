import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as Y from 'yjs'
import type { Category, Recipe, YCategory, YRecipe } from './Types'
import settings from './settings.json'
import { DataContext } from './DataContext'
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket'
import { slugify, sortByName } from './Utils/string'
import { useY } from 'react-yjs'

const KEY_NAME = 'THERMOMIXRECIPES_KEY'

const PREFIX = 'tr'

interface DataContextProviderPropsType {
    children: React.ReactNode | React.ReactNode[]
}

const DataContextProvider: React.FC<DataContextProviderPropsType> = ({
    children,
}) => {
    const key = localStorage.getItem(KEY_NAME)

    const guid = `${PREFIX}:${key}`
    const yDoc = useMemo(() => new Y.Doc({ guid }), [guid])

    const yCategories = yDoc.getArray<Y.Map<YCategory>>('categories')
    const yRecipes = yDoc.getArray<Y.Map<YRecipe>>('recipes')

    const persistence = useRef<IndexeddbPersistence>(null)
    const provider = useRef<WebsocketProvider>(null)

    const persistKey = useCallback((newKey: string) => {
        const slugKey = slugify(newKey)
        if (!slugKey) {
            alert('Malformed key')
        } else {
            localStorage.setItem(KEY_NAME, slugKey)
            window.location.href = settings.baseUrl
        }
    }, [])

    useEffect(() => {
        if (key) {
            persistence.current = new IndexeddbPersistence(guid, yDoc)
            provider.current = new WebsocketProvider(
                settings.crdtUrl,
                guid,
                yDoc,
                {
                    params: { secret: settings.secret },
                }
            )
            return () => provider.current?.disconnect()
        }
    }, [guid, key, yDoc])

    const getNextCategoryId = useCallback(() => {
        const categories = yCategories.toArray()
        const maxId = categories.reduce(
            (maxId, category) =>
                Math.max(maxId, category?.get('id') as unknown as number),
            0
        )
        return maxId + 1
    }, [yCategories])

    const getNextRecipeId = useCallback(() => {
        const recipes = yRecipes.toArray()
        const maxId = recipes.reduce(
            (maxId, recipe) =>
                Math.max(maxId, recipe.get('id') as unknown as number),
            0
        )
        return maxId + 1
    }, [yRecipes])

    const addOrEditCategory = useCallback(
        (name: string, maybeId?: number) => {
            if (maybeId === undefined) {
                const id = getNextCategoryId()
                const yCategory = new Y.Map<YCategory>()
                yCategory.set('id', getNextCategoryId())
                yCategory.set('name', name)
                yCategories.push([yCategory])
                return id
            } else {
                const categoryIdx = yCategories
                    .toArray()
                    .findIndex((yCategory) => yCategory.get('id') === maybeId)

                if (categoryIdx === -1) throw new Error('Category not found')

                const yCategory = yCategories.get(categoryIdx)
                const id = yCategory.get('id') as unknown as number
                yCategory.set('name', name)
                return id
            }
        },
        [getNextCategoryId, yCategories]
    )

    const deleteCategory = useCallback(
        (id: number) => {
            const recipeFromThatCategory = yRecipes
                .toArray()
                .find((yRecipe) => yRecipe.get('categoryId') === id)

            if (recipeFromThatCategory) throw new Error('Category not empty')

            const categoryIdx = yCategories
                .toArray()
                .findIndex((yCategory) => yCategory.get('id') === id)

            if (categoryIdx !== -1) {
                yCategories.delete(categoryIdx, 1)
            } else {
                throw new Error('Category not found')
            }
        },
        [yCategories, yRecipes]
    )

    const deleteRecipe = useCallback(
        (id: number) => {
            const recipeIdx = yRecipes
                .toArray()
                .findIndex((yRecipe) => yRecipe.get('id') === id)

            if (recipeIdx !== -1) {
                yRecipes.delete(recipeIdx, 1)
            } else {
                throw new Error('Recipe not found')
            }
        },
        [yRecipes]
    )
    const addOrEditRecipe = useCallback(
        (
            categoryId: number,
            name: string,
            recipe: string,
            tags: string[],
            maybeId?: number
        ) => {
            if (maybeId === undefined) {
                const id = getNextRecipeId()
                yDoc.transact(() => {
                    const yRecipe = new Y.Map<YRecipe>()
                    yRecipe.set('id', id)
                    yRecipe.set('name', name)
                    yRecipe.set('categoryId', categoryId)
                    yRecipe.set('recipe', recipe)
                    const yTags = new Y.Array<string>()
                    yTags.push(tags)
                    yRecipe.set('tags', yTags)
                    yRecipes.push([yRecipe])
                })
                return id
            } else {
                const recipeIdx = yRecipes
                    .toArray()
                    .findIndex((yRecipe) => yRecipe.get('id') === maybeId)

                if (recipeIdx !== -1) {
                    const yRecipe = yRecipes.get(recipeIdx)
                    const id = yRecipe.get('id') as unknown as number
                    yDoc.transact(() => {
                        yRecipe.set('name', name)
                        yRecipe.set('categoryId', categoryId)
                        yRecipe.set('recipe', recipe)
                        const yTags = new Y.Array<string>()
                        yTags.push(tags)
                        yRecipe.set('tags', yTags)
                    })
                    return id
                } else {
                    throw new Error('Recipe not found')
                }
            }
        },
        [getNextRecipeId, yDoc, yRecipes]
    )

    const unsortedRecipes = useY(yRecipes) as unknown as Recipe[]
    const recipes = unsortedRecipes.toSorted(sortByName)

    const unsortedCategories = useY(yCategories) as unknown as Category[]
    const categories = unsortedCategories.toSorted(sortByName)

    const availableTags = useMemo(() => {
        const set = new Set<string>()
        const tags: string[] = recipes
            .flatMap((item): string[] => item.tags ?? [])
            .filter((tag) => !!tag)
        tags.forEach((tag) => set.add(tag))
        return Array.from(set)
    }, [recipes])

    const contextValue = useMemo(
        () => ({
            key,
            setKey: persistKey,
            categories,
            recipes,
            availableTags,
            addOrEditCategory,
            deleteCategory,
            addOrEditRecipe,
            deleteRecipe,
        }),
        [
            key,
            persistKey,
            categories,
            recipes,
            availableTags,
            addOrEditCategory,
            deleteCategory,
            addOrEditRecipe,
            deleteRecipe,
        ]
    )

    return (
        <DataContext.Provider value={contextValue}>
            {children}
        </DataContext.Provider>
    )
}

export default DataContextProvider
