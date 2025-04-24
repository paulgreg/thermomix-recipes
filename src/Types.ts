export type CookBook = {
    categories: Category[]
    recipes: Recipe[]
    lastSave: number
}

export interface NamedEntity {
    name: string
}
export type Category = NamedEntity & {
    id: string
}

export type Recipe = NamedEntity & {
    id: string
    categoryId: string
    recipe: string
    tags?: string[]
}

export type InjectableComponent = {
    category?: Category
    recipe?: Recipe
    tag?: string
}
