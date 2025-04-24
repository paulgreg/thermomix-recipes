import React from 'react'
import { t } from '../i18n/i18n'
import { Link } from 'react-router-dom'

type TagsType = {
    tags: string[]
}

const Tags: React.FC<TagsType> = ({ tags }) => {
    return (
        <div>
            {t('tags.label')}:
            {tags.length > 0
                ? tags.map((t) => (
                      <Link to={`/tags/${t}`} key={t} className="tag">
                          #{t}
                      </Link>
                  ))
                : t('tags.no')}
        </div>
    )
}

export default Tags
