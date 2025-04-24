import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ConfigPage from './Pages/ConfigPage'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import DataContextProvider, { useDataContext } from './DataContext'
import { InjectableComponent } from './Types'
import CategoryPage from './Pages/CategoryPage'
import ErrorMessage from './Components/Error'
import settings from './settings.json'
import RecipePage from './Pages/RecipePage'
import EditRecipePage from './Pages/EditRecipePage'
import SearchPage from './Pages/SearchPage'
import TagPage from './Pages/TagPage'
import './index.css'

type ValidateInjectableType = {
    component: React.FC<InjectableComponent>
}

const validate =
    (categoryIdStr?: string, recipeIdStr?: string, tag?: string) =>
    (Component: React.FC<InjectableComponent>) => {
        const { cookBook, loaded } = useDataContext()
        let category
        let recipe

        if (!loaded) return <></>

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
    const { categoryId, recipeId, tag } = useParams()
    return validate(categoryId, recipeId, tag)(component)
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
                            <Route index element={<HomePage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route
                                path="/tag/:tag"
                                element={
                                    <ValidateComponent component={TagPage} />
                                }
                            />
                            <Route
                                path="/category/:categoryId"
                                element={
                                    <ValidateComponent
                                        component={CategoryPage}
                                    />
                                }
                            />
                            <Route
                                path="/recipe/:recipeId"
                                element={
                                    <ValidateComponent component={RecipePage} />
                                }
                            />
                            <Route
                                path="/recipe/add"
                                element={
                                    <ValidateComponent
                                        component={EditRecipePage}
                                    />
                                }
                            />
                            <Route
                                path="/recipe/:recipeId/edit"
                                element={
                                    <ValidateComponent
                                        component={EditRecipePage}
                                    />
                                }
                            />
                            <Route
                                path="/category/:categoryId/recipe/:recipeId"
                                element={
                                    <ValidateComponent component={RecipePage} />
                                }
                            />
                            <Route path="/configure" element={<ConfigPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DataContextProvider>
        </React.StrictMode>
    )
}
