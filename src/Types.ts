export type CookBook = {
    categories: Category[]
    recipes: Recipe[]
    lastSave: number
}

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

export type InjectableComponent = {
    category?: Category
    recipe?: Recipe
    tag?: string
}
