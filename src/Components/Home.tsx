import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'
import { Category } from '../Types'

const Home = () => {
    const { cookBook, addCategory, renameCategory, deleteCategory } =
        useDataContext()

    const categories = useMemo(
        () =>
            cookBook.categories.map((category) => {
                const { id, name } = category
                const recipesByCategory = cookBook.recipes.filter(
                    ({ categoryId }) => categoryId === id
                )
                return { id, name, count: recipesByCategory.length }
            }),
        [cookBook]
    )

    const onAddCategory = () => {
        const name = window.prompt(t('category.add'))
        if (name) addCategory(name)
    }
    const onRenameCategory = (category: Category) => () => {
        const { name, id } = category
        const newName = window.prompt(t('category.rename', name), name)
        if (newName) renameCategory(id, newName)
    }
    const onDeleteCategory = (category: Category) => () => {
        const { name, id } = category
        if (window.confirm(t('category.delete', name))) deleteCategory(id)
    }

    return (
        <>
            <header>
                <Link to="/">{t('title')}</Link>
            </header>
            <div className="content">
                {categories.length === 0 && <p>{t('category.empty')}</p>}
                {categories
                    .toSorted((c1, c2) => c1.name.localeCompare(c2.name))
                    .map((category) => (
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
                <Link to="/search">{t('search')}</Link>
                {' | '}
                <Link to="/add">{t('recipe.add')}</Link>
                {' | '}
                <Link to="/configure">{t('configure')}</Link>
            </footer>
        </>
    )
}

export default Home
