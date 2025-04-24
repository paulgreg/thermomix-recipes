import React, { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { t } from '../i18n/i18n'
import { InjectableComponent } from '../Types'
import { useDataContext } from '../DataContext'
import { ReactTags } from 'react-tag-autocomplete'
import type { TagSelected } from 'react-tag-autocomplete'
import './react-tags.css'
import ThermomixIcons from './ThermomixIcons'

const EditRecipe: React.FC<InjectableComponent> = ({ recipe }) => {
    const navigate = useNavigate()
    const { cookBook, availableTags, addOrEditRecipe } = useDataContext()
    const formRef = useRef<HTMLFormElement>(null)
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const [nameValue, setNameValue] = useState(recipe?.name ?? '')
    const [categoryIdValue, setCategoryIdValue] = useState(recipe?.categoryId)
    const [tagsValue, setTagsValue] = useState<TagSelected[]>(
        (recipe?.tags ?? [])?.map((t) => ({ value: t, label: t }))
    )
    const [recipeValue, setRecipeValue] = useState(recipe?.recipe ?? '')

    const onAddTag = useCallback(
        (newTag: TagSelected) => {
            setTagsValue([...tagsValue, newTag])
        },
        [tagsValue]
    )

    const onDeleteTag = useCallback(
        (tagIndex: number) => {
            setTagsValue(tagsValue.filter((_, i) => i !== tagIndex))
        },
        [tagsValue]
    )

    const onIconClick = useCallback((markdown: string) => {
        if (!textAreaRef.current) return
        const value = textAreaRef.current.value
        const newRecipeValue =
            value.substring(0, textAreaRef.current.selectionStart) +
            markdown +
            value.substring(textAreaRef.current.selectionEnd)
        textAreaRef.current.value = newRecipeValue
        setRecipeValue(newRecipeValue)
        textAreaRef.current.selectionStart += markdown.length
        textAreaRef.current.focus()
    }, [])

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
            tagsValue.map(({ label }) => label),
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
                <form
                    ref={formRef}
                    className="area"
                    style={{
                        textAlign: 'left',
                    }}
                    action={onSubmit}
                >
                    <div className="area">
                        <label htmlFor="name">{t('recipe.name.label')} :</label>
                        <input
                            type="text"
                            id="name"
                            required
                            value={nameValue}
                            onChange={(e) => setNameValue(e.target.value)}
                        />
                    </div>
                    <div className="area">
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
                    </div>
                    <div className="area">
                        <label htmlFor="tags">{t('tags.label')} :</label>
                        <ReactTags
                            id="tags"
                            placeholderText={t('tags.placeholder')}
                            selected={tagsValue}
                            allowNew={true}
                            newOptionText={t('tags.add')}
                            onAdd={onAddTag}
                            onDelete={onDeleteTag}
                            suggestions={availableTags.map((t) => ({
                                value: t,
                                label: t,
                            }))}
                        />
                    </div>
                    <div className="area">
                        <label htmlFor="recipe">{t('recipe.label')} : </label>
                        <textarea
                            ref={textAreaRef}
                            id="recipe"
                            value={recipeValue}
                            onChange={(e) => setRecipeValue(e.target.value)}
                            style={{
                                display: 'block',
                                width: '100%',
                                height: '60vh',
                            }}
                        ></textarea>
                    </div>
                    <div style={{ margin: '4px auto 8px auto' }}>
                        <ThermomixIcons onIconClick={onIconClick} />
                    </div>
                    <details>
                        <summary>{t('help.title')}</summary>

                        <h3>{t('help.bold')}</h3>
                        <pre>**{t('help.bold')}**</pre>

                        <h3>{t('help.italic')}</h3>
                        <pre>_{t('help.italic')}_</pre>

                        <h3>{t('help.list')}</h3>
                        <pre>{`- ${t('help.list.element')}
- ${t('help.list.element')}
  - ${t('help.list.subelement')}`}</pre>

                        <h3>{t('help.title.1')}</h3>
                        <pre># {t('help.title.label')} #</pre>

                        <h3>{t('help.title.2')}</h3>
                        <pre>## {t('help.title.label')} ##</pre>

                        <h3>{t('help.title.3')}</h3>
                        <pre>### {t('help.title.label')} ###</pre>

                        <h3>Lien</h3>
                        <pre>[Thermomix](http://www.vorwerk.com)</pre>

                        <h3>Image</h3>
                        <pre>![description](imgs/logo_thermomix.png)</pre>
                    </details>
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
