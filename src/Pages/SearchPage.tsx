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
    const { cookBook, availableTags } = useDataContext()

    const filterByLength = (str: string) => str.length > 2

    const searchableTerms = useMemo(
        () =>
            cookBook.recipes.map((recipe) => ({
                ...recipe,
                terms: replaceSpecialCharBySpace(
                    removeAccent(recipe.name.toLocaleLowerCase())
                )
                    .split(' ')
                    .filter(filterByLength),
            })),

        [cookBook]
    )

    const matchingRecipes = useMemo(() => {
        if (search.length < 3) return []
        const searchTerms = replaceSpecialCharBySpace(
            removeAccent(search.toLocaleLowerCase())
        )
            .split(' ')
            .filter(filterByLength)

        return searchableTerms.filter((recipe) =>
            searchTerms.every((searchTerm) =>
                recipe.terms.some((term) => term.includes(searchTerm))
            )
        )
    }, [cookBook, search])

    return (
        <>
            <header>
                <span>{t('search.title')}</span>
            </header>
            <div className="content">
                <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    onChange={(e) => setSearch(e.target.value)}
                ></input>

                <div>
                    {matchingRecipes.toSorted(sortByName).map((recipe) => (
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
