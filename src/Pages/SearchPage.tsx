import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'
import {
    removeAccent,
    replaceSpecialCharBySpace,
    replaceStars,
    sortByName,
} from '../Utils/string'
import TagsCloud from '../Components/TagsCloud'

const SearchPage: React.FC = () => {
    const [search, setSearch] = useState('')
    const { recipes, availableTags } = useDataContext()

    const filterByLength = (str: string) => str.length > 2

    const searchableTerms = useMemo(
        () =>
            recipes.map((recipe) => ({
                ...recipe,
                terms: replaceSpecialCharBySpace(
                    removeAccent(recipe.name.toLocaleLowerCase())
                )
                    .split(' ')
                    .filter(filterByLength),
            })),

        [recipes]
    )

    const matchingRecipes = useMemo(() => {
        if (search.length < 3) return []
        const searchTerms = replaceSpecialCharBySpace(
            removeAccent(search.toLocaleLowerCase())
        )
            .split(' ')
            .filter(filterByLength)

        return searchableTerms
            .filter((recipe) =>
                searchTerms.every((searchTerm) =>
                    recipe.terms.some((term) => term.includes(searchTerm))
                )
            )
            .toSorted(sortByName)
    }, [search, searchableTerms])

    return (
        <>
            <header>
                <span>{t('search.title')}</span>
            </header>
            <div className="content">
                <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                    autoFocus
                ></input>

                <div>
                    {matchingRecipes.map((recipe) => (
                        <div key={recipe.id} className="row">
                            <Link to={`/recipe/${recipe.id}`}>
                                {replaceStars(recipe.name)}
                            </Link>
                        </div>
                    ))}
                </div>

                {search.length === 0 && <TagsCloud tags={availableTags} />}
            </div>
            <footer>
                <Link to="/">{t('home')}</Link>
            </footer>
        </>
    )
}

export default SearchPage
