import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import ConfigPage from './Pages/ConfigPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import DataContextProvider from './DataContextProvider'
import CategoryPage from './Pages/CategoryPage'
import settings from './settings.json'
import RecipePage from './Pages/RecipePage'
import EditRecipePage from './Pages/EditRecipePage'
import SearchPage from './Pages/SearchPage'
import TagPage from './Pages/TagPage'
import { ValidateComponent } from './Utils/ValidateComponent'

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
                            <Route path="/config" element={<ConfigPage />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </DataContextProvider>
        </React.StrictMode>
    )
}

if ('serviceWorker' in navigator)
    navigator.serviceWorker.register(`${settings.baseUrl}sw.js`)
