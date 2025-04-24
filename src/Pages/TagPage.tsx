import React, { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'
import { replaceStars, sortByName } from '../Utils/string'
import { InjectableComponent } from '../Types'

const TagPage: React.FC<InjectableComponent> = ({ tag }) => {
    const { cookBook } = useDataContext()
    const navigate = useNavigate()

    const matchingRecipes = useMemo(
        () =>
            tag
                ? cookBook.recipes.filter((recipe) =>
                      recipe.tags?.includes(tag)
                  )
                : [],
        [cookBook]
    )

    if (!tag) {
        navigate('/')
        return <></>
    }

    return (
        <>
            <header>
                <span>#{tag}</span>
            </header>
            <div className="content">
                <div>
                    {matchingRecipes.toSorted(sortByName).map((recipe) => (
                        <div key={recipe.id} className="row">
                            <Link to={`/recipe/${recipe.id}`}>
                                {replaceStars(recipe.name)}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <footer>
                <Link to="/">{t('home')}</Link>
            </footer>
        </>
    )
}

export default TagPage
