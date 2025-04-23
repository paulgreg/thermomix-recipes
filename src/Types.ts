export type CookBook = {
    categories: Category[]
    recipes: Recipe[]
    lastSave: number
}

export type Category = {
    id: string
    name: string
}

export type Recipe = {
    id: string
    name: string
    categoryId: string
    recipe: string
    tags?: string[]
}

export type CategoryComponent = {
    category: Category
}
export type RecipeComponent = {
    recipe: Recipe
}
