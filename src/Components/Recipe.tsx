import React, { useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { t } from '../i18n/i18n'
import { InjectableComponent } from '../Types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Settings from '../settings.json'
import { useDataContext } from '../DataContext'

const Recipe: React.FC<InjectableComponent> = ({ category, recipe }) => {
    const navigate = useNavigate()
    const { deleteRecipe } = useDataContext()

    const onDelete = useCallback(() => {
        if (recipe && confirm(t('recipe.delete.confirm'))) {
            deleteRecipe(recipe.id)
            navigate('/')
        }
    }, [])

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
                &gt; <span>{recipe.name}</span>
            </header>
            <div className="content">
                <h1>{recipe.name}</h1>
                <div
                    style={{
                        textAlign: 'left',
                    }}
                >
                    <p>
                        {t('tags.label')}: {recipe.tags ?? t('tags.no')}
                    </p>
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            img: ({ node, ...props }) => (
                                <img
                                    {...props}
                                    src={
                                        props?.src?.startsWith('http')
                                            ? props.src
                                            : Settings.baseUrl + props.src
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
                    style={{ color: 'white', backgroundColor: 'crimson' }}
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

export default Recipe
