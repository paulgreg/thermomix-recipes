import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Config from './Components/Config'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Components/Home'
import DataContextProvider, { useDataContext } from './DataContext'
import { InjectableComponent, CookBook } from './Types'
import Category from './Components/Category'
import ErrorMessage from './Components/Error'
import settings from './settings.json'
import Recipe from './Components/Recipe'
import './index.css'
import EditRecipe from './Components/EditRecipe'

type ValidateInjectableType = {
    component: React.FC<InjectableComponent>
}

const validate =
    (
        cookBook: CookBook,
        categoryIdStr?: string,
        recipeIdStr?: string,
        tag?: string
    ) =>
    (Component: React.FC<InjectableComponent>) => {
        let category
        let recipe

        if (categoryIdStr) {
            if (!RegExp(/\w+/).exec(categoryIdStr))
                return <ErrorMessage msg="error.badid" />

            category = cookBook.categories.find(
                (category) => category.id === categoryIdStr
            )
            if (!category) return <ErrorMessage msg="error.nocategory" />
        }

        if (recipeIdStr) {
            if (!RegExp(/\w+/).exec(recipeIdStr))
                return <ErrorMessage msg="error.badid" />

            recipe = cookBook.recipes.find(
                (recipe) => recipe.id === recipeIdStr
            )
            if (!recipe) return <ErrorMessage msg="error.norecipe" />
        }

        return <Component category={category} recipe={recipe} tag={tag} />
    }

const ValidateComponent: React.FC<ValidateInjectableType> = ({ component }) => {
    const { cookBook } = useDataContext()
    const { categoryId, recipeId, tag } = useParams()
    return validate(cookBook, categoryId, recipeId, tag)(component)
}

const container: HTMLElement | null = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(
        <React.StrictMode>
            <DataContextProvider>
                <BrowserRouter basename={settings.baseUrl}>
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route index element={<Home />} />
                            <Route
                                path="/category/:categoryId"
                                element={
                                    <ValidateComponent component={Category} />
                                }
                            />
                            <Route
                                path="/recipe/:recipeId"
                                element={
                                    <ValidateComponent component={Recipe} />
                                }
                            />
                            <Route
                                path="/recipe/add"
                                element={
                                    <ValidateComponent component={EditRecipe} />
                                }
                            />
                            <Route
                                path="/recipe/:recipeId/edit"
                                element={
                                    <ValidateComponent component={EditRecipe} />
                                }
                            />
                            <Route
                                path="/category/:categoryId/recipe/:recipeId"
                                element={
                                    <ValidateComponent component={Recipe} />
                                }
                            />
                            <Route path="/configure" element={<Config />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DataContextProvider>
        </React.StrictMode>
    )
}
