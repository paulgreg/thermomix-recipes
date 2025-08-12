import * as Y from 'yjs'

export interface NamedEntity {
    id: number
    name: string
}

export type Category = NamedEntity

export type Recipe = NamedEntity & {
    categoryId: number
    recipe: string
    tags?: string[]
}

export type YCategory = number | string

export type YRecipe = number | string | Y.Array<string>

export type InjectableComponent = {
    category?: Category
    recipe?: Recipe
    tag?: string
}
