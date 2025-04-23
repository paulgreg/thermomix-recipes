import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Config from './Config'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Home from './Home'
import DataContextProvider, { useDataContext } from './DataContext'
import './index.css'
import { CategoryComponent, CookBook } from './Types'
import Category from './Category'
import ErrorMessage from './Error'

type ValidateCategoryType = {
    component: React.FC<CategoryComponent>
}

const validateCategory =
    (cookBook: CookBook, categoryIdStr?: string) =>
    (Component: React.FC<CategoryComponent>) => {
        if (!categoryIdStr || !RegExp(/\w+/).exec(categoryIdStr))
            return <ErrorMessage msg="error.badid" />

        const category = cookBook.categories.find(
            (category) => String(category.id) === categoryIdStr
        )
        if (!category) return <ErrorMessage msg="error.nocategory" />

        return <Component category={category} />
    }

const ValidateCategory: React.FC<ValidateCategoryType> = ({ component }) => {
    const { cookBook } = useDataContext()
    const { categoryId } = useParams()
    return validateCategory(cookBook, categoryId)(component)
}

const container: HTMLElement | null = document.getElementById('root')
if (container) {
    const root = createRoot(container)
    root.render(
        <React.StrictMode>
            <DataContextProvider>
                <BrowserRouter
                    basename={
                        process.env.NODE_ENV === 'production'
                            ? '/thermomix-recipes'
                            : ''
                    }
                >
                    <Routes>
                        <Route path="/" element={<App />}>
                            <Route index element={<Home />} />
                            <Route
                                path="/category/:categoryId"
                                element={
                                    <ValidateCategory component={Category} />
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
