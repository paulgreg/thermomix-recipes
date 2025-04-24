import React from 'react'
import { t } from '../i18n/i18n'
import { Link } from 'react-router-dom'

type TagsType = {
    tags: string[]
}

const TagsCloud: React.FC<TagsType> = ({ tags }) => (
    <div
        style={{
            margin: '16px 0 12px 0',
            display: 'flex',
            flexFlow: 'wrap',
            alignItems: 'center',
        }}
    >
        {t('tags.label')}&nbsp;:&nbsp;
        {tags.length === 0
            ? t('tags.no')
            : tags.map((t) => (
                  <Link to={`/tag/${t}`} key={t} className="tag">
                      #{t}
                  </Link>
              ))}
    </div>
)

export default TagsCloud
