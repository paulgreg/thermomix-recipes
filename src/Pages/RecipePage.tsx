import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from '../i18n/i18n'
import { InjectableComponent } from '../Types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import settings from '../settings.json'
import { useDataContext } from '../DataContext'
import TagsCloud from '../Components/TagsCloud'
import { replaceStars } from '../Utils/string'

const RecipePage: React.FC<InjectableComponent> = ({ category, recipe }) => {
    const navigate = useNavigate()
    const { deleteRecipe } = useDataContext()

    const onDelete = useCallback(() => {
        if (recipe && confirm(t('recipe.delete.confirm'))) {
            deleteRecipe(recipe.id)
            navigate('/')
        }
    }, [deleteRecipe, navigate, recipe])

    if (!recipe) {
        navigate('/')
        return <></>
    }

    return (
        <>
            <header>
                {category ? (
                    <Link to={`/category/${category.id}`}>{category.name}</Link>
                ) : (
                    <Link to="/">{t('home')}</Link>
                )}
                &gt; <span>{replaceStars(recipe.name)}</span>
            </header>
            <div className="content">
                <h1>{replaceStars(recipe.name)}</h1>
                <div
                    style={{
                        textAlign: 'left',
                    }}
                >
                    <TagsCloud tags={recipe?.tags ?? []} />
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            img: ({ ...props }) => (
                                <img
                                    {...props}
                                    src={
                                        props?.src?.startsWith('http')
                                            ? props.src
                                            : settings.baseUrl + props.src
                                    }
                                    alt={props.alt}
                                    className="thermomixIcon"
                                />
                            ),
                        }}
                    >
                        {recipe.recipe}
                    </Markdown>
                </div>
            </div>
            <footer>
                <button
                    style={{
                        color: 'white',
                        backgroundColor: 'darkslategray',
                    }}
                    onClick={onDelete}
                >
                    {t('recipe.delete')}
                </button>
                <button
                    onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
                    style={{
                        color: 'black',
                        backgroundColor: 'bisque',
                    }}
                >
                    {t('recipe.edit')}
                </button>
            </footer>
        </>
    )
}

export default RecipePage
