import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'
import { Category } from '../Types'
import { sortByName } from '../Utils/string'

const HomePage = () => {
    const { categories, recipes, addOrEditCategory, deleteCategory } =
        useDataContext()

    const categoriesItems = useMemo(
        () =>
            categories
                .map((category) => {
                    const { id, name } = category
                    const recipesByCategory = recipes.filter(
                        ({ categoryId }) => categoryId === id
                    )
                    return { id, name, count: recipesByCategory.length }
                })
                .toSorted(sortByName),
        [categories, recipes]
    )

    const onAddCategory = () => {
        const name = window.prompt(t('category.add'))
        if (name) addOrEditCategory(name)
    }
    const onRenameCategory = (category: Category) => () => {
        const { name, id } = category
        const newName = window.prompt(t('category.rename', name), name)
        if (newName) addOrEditCategory(newName, id)
    }
    const onDeleteCategory = (category: Category) => () => {
        const { name, id } = category
        if (window.confirm(t('category.delete', name))) deleteCategory(id)
    }

    return (
        <>
            <header>
                {t('title')}
                {' | '}
                <Link to="/search">{t('search')}</Link>
            </header>
            <div className="content">
                {categoriesItems.length === 0 && <p>{t('category.empty')}</p>}
                {categoriesItems.map((category) => (
                    <div key={category.id} className="grid row">
                        <span style={{ display: 'flex' }}>
                            <button
                                className="icon"
                                onClick={onRenameCategory(category)}
                            >
                                ✏️
                            </button>

                            {category.count === 0 && (
                                <button
                                    className="icon"
                                    onClick={onDeleteCategory(category)}
                                >
                                    🗑️
                                </button>
                            )}
                        </span>
                        <Link to={`/category/${category.id}`}>
                            {category.name}
                        </Link>
                        <small style={{ fontSize: '.7em' }}>
                            ({category.count})
                        </small>
                    </div>
                ))}
                <div style={{ marginTop: 20 }}>
                    <button style={{ margin: 'auto' }} onClick={onAddCategory}>
                        {t('category.add')}
                    </button>
                </div>
            </div>
            <footer>
                <Link to="/config">{t('configure')}</Link>
                {' | '}
                <Link to="/recipe/add">{t('recipe.add')}</Link>
            </footer>
        </>
    )
}

export default HomePage
