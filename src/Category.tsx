import React from 'react'
import { Link } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { t } from './i18n/i18n'
import { CategoryComponent } from './Types'

const Category: React.FC<CategoryComponent> = ({ category }) => {
    const { cookBook } = useDataContext()

    const recipes = cookBook.recipes.filter(
        ({ categoryId }) => categoryId === category.id
    )

    return (
        <>
            <div className="content">
                {recipes.length === 0 && <p>{t('recipes.empty')}</p>}
                {recipes
                    .toSorted((r1, r2) => r1.name.localeCompare(r2.name))
                    .map((recipe) => (
                        <div key={recipe.id} className="row">
                            <Link
                                to={`/recipes/${recipe.id}`}
                                style={{ margin: 4 }}
                            >
                                {recipe.name}
                            </Link>
                        </div>
                    ))}
            </div>
            <footer>
                <Link to="/search">{t('search')}</Link>
                {' | '}
                <Link to="/add">{t('recipe.add')}</Link>
                {' | '}
                <Link to="/">{t('home')}</Link>
            </footer>
        </>
    )
}

export default Category
