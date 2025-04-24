import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../i18n/i18n'
import { InjectableComponent } from '../Types'
import { useDataContext } from '../DataContext'

const EditRecipe: React.FC<InjectableComponent> = ({ recipe }) => {
    const navigate = useNavigate()
    const { cookBook, availableTags, addOrEditRecipe } = useDataContext()
    const formRef = useRef<HTMLFormElement>(null)
    const [nameValue, setNameValue] = useState(recipe?.name ?? '')
    const [categoryIdValue, setCategoryIdValue] = useState(recipe?.categoryId)
    const [tagsValue, setTagsValue] = useState((recipe?.tags ?? []).join(' '))
    const [recipeValue, setRecipeValue] = useState(recipe?.recipe ?? '')

    const onSubmit = useCallback(async () => {
        if (!nameValue || !categoryIdValue) {
            alert('error: missing fields')
            navigate('/')
            return
        }
        const recipeId = await addOrEditRecipe(
            categoryIdValue,
            nameValue,
            recipeValue,
            tagsValue.split(' '),
            recipe?.id
        )
        navigate(`/recipe/${recipeId}`)
    }, [nameValue, categoryIdValue, tagsValue, recipeValue])

    return (
        <>
            <header>
                <span>{recipe?.name ?? t('recipe.new')}</span>
            </header>
            <div className="content">
                <h1>{recipe?.name}</h1>
                <form
                    ref={formRef}
                    className="area"
                    style={{
                        textAlign: 'left',
                    }}
                    action={onSubmit}
                >
                    <p className="area">
                        <label htmlFor="name">{t('recipe.name.label')} :</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                        />
                    </p>
                    <p className="area">
                        <label htmlFor="category">
                            {t('category.label')} :
                        </label>
                        <select
                            id="category"
                            value={categoryIdValue}
                            required
                            onChange={(e) => setCategoryIdValue(e.target.value)}
                        >
                            {cookBook.categories.map(({ id, name }) => (
                                <option value={id} key={id}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </p>
                    <p className="area">
                        <label htmlFor="tags">{t('tags.label')} :</label>
                        <input
                            type="text"
                            id="tags"
                            list="availableTags"
                            value={tagsValue}
                            placeholder={t('tags.placeholder')}
                            onChange={(e) => setTagsValue(e.target.value)}
                        />
                        <datalist id="availableTags">
                            {availableTags.map((tag) => (
                                <option value={tag} key={tag} />
                            ))}
                        </datalist>
                    </p>
                    <p className="area">
                        <label htmlFor="recipe">{t('recipe.label')} : </label>
                        <textarea
                            id="recipe"
                            value={recipeValue}
                            onChange={(e) => setRecipeValue(e.target.value)}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '80vh',
                            }}
                        ></textarea>
                    </p>
                </form>
            </div>
            <footer>
                <button
                    style={{ color: 'white', backgroundColor: 'crimson' }}
                    onClick={() => navigate(-1)}
                >
                    {t('cancel')}
                </button>
                <button
                    style={{ color: 'black', backgroundColor: 'bisque' }}
                    onClick={() => formRef.current?.requestSubmit()}
                >
                    {t('save')}
                </button>
            </footer>
        </>
    )
}

export default EditRecipe
