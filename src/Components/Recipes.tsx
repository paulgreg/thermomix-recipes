import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'
import { InjectableComponent } from '../Types'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Settings from '../settings.json'

const Recipe: React.FC<InjectableComponent> = ({ category, tag, recipe }) => {
    const navigate = useNavigate()

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
                    <p>Tag: {recipe.tags ?? t('tags.no')}</p>
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
                <Link to="/search">{t('search')}</Link>
                {' | '}
                <Link to="/add">{t('recipe.add')}</Link>
            </footer>
        </>
    )
}

export default Recipe
