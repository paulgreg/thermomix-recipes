import React from 'react'
import { useParams } from 'react-router-dom'
import ErrorMessage from '../Components/Error'
import { InjectableComponent } from '../Types'
import { useDataContext } from '../DataContext'

type ValidateInjectableType = {
    component: React.FC<InjectableComponent>
}

const validate =
    (categoryIdStr?: string, recipeIdStr?: string, tag?: string) =>
    (Component: React.FC<InjectableComponent>) => {
        const { categories, recipes } = useDataContext()
        let category
        let recipe

        if (categoryIdStr) {
            if (!RegExp(/\w+/).exec(categoryIdStr))
                return <ErrorMessage msg="error.badid" />

            category = categories?.find(
                (category) => category.id === parseInt(categoryIdStr, 10)
            )
            if (!category) return <ErrorMessage msg="error.nocategory" />
        }

        if (recipeIdStr) {
            if (!RegExp(/\w+/).exec(recipeIdStr))
                return <ErrorMessage msg="error.badid" />

            recipe = recipes?.find(
                (recipe) => recipe.id === parseInt(recipeIdStr, 10)
            )
            if (!recipe) return <ErrorMessage msg="error.norecipe" />
        }

        return <Component category={category} recipe={recipe} tag={tag} />
    }

export const ValidateComponent: React.FC<ValidateInjectableType> = ({
    component,
}) => {
    const { categoryId, recipeId, tag } = useParams()
    return validate(categoryId, recipeId, tag)(component)
}
