import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'
import { InjectableComponent } from '../Types'
import useOnline from '../Utils/useOnline'
import { replaceStars } from '../Utils/string'

const CategoryPage: React.FC<InjectableComponent> = ({ category }) => {
    const { cookBook } = useDataContext()
    const online = useOnline()
    const navigate = useNavigate()

    if (!category) {
        navigate('/')
        return <></>
    }

    const recipes = cookBook.recipes.filter(
        ({ categoryId }) => categoryId === category.id
    )

    return (
        <>
            <header>
                <Link to="/">{t('home')}</Link> &gt;{' '}
                <span>{category.name}</span>
            </header>
            <div className="content">
                {recipes.length === 0 && <p>{t('recipes.empty')}</p>}
                {recipes.map((recipe) => (
                    <div key={recipe.id} className="row">
                        <Link
                            to={`/category/${category.id}/recipe/${recipe.id}`}
                        >
                            {replaceStars(recipe.name)}
                        </Link>
                    </div>
                ))}
            </div>
            <footer>
                <Link to="/search">{t('search')}</Link>
                {online && (
                    <>
                        {' | '}
                        <Link to="/recipe/add">{t('recipe.add')}</Link>
                    </>
                )}
            </footer>
        </>
    )
}

export default CategoryPage
