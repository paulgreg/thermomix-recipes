import React, { useState, useRef, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from '../DataContext'
import { t } from '../i18n/i18n'

const ConfigPage = () => {
    const inputRef = useRef<HTMLInputElement>(null)
    const navigate = useNavigate()
    const [error, setError] = useState<string | undefined>()
    const { key, load } = useDataContext()

    const commonCheck = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if (!inputRef.current) return false
        if (!inputRef.current.value) {
            setError('Empty value')
            return false
        }
        if (!inputRef.current.checkValidity()) {
            setError('Bad format')
            return false
        }
        setError(undefined)
        return true
    }

    const onLoad = (e: MouseEvent<HTMLButtonElement>) => {
        if (inputRef.current && commonCheck(e)) {
            load(inputRef.current.value)
            navigate('/')
        }
    }
    return (
        <>
            <div className="content">
                <form>
                    <label>
                        {t('configure.label')} :
                        <input
                            ref={inputRef}
                            type="text"
                            name="key"
                            defaultValue={key ?? ''}
                            placeholder={t('configure.label.placeholder')}
                            minLength={3}
                            maxLength={32}
                            pattern="[a-zA-Z0-9-]+"
                            style={{ width: '90%' }}
                            autoFocus
                        />
                        {error && (
                            <strong
                                style={{ display: 'block', color: '#e1eebc' }}
                            >
                                {error}
                            </strong>
                        )}
                        <small>({t('configure.restrictions')})</small>
                    </label>
                    <p>
                        <button
                            style={{ margin: '1em auto 0' }}
                            onClick={onLoad}
                        >
                            {t('load')}
                        </button>
                    </p>
                </form>
            </div>
            <footer>
                <Link to="/">{t('back')}</Link>
            </footer>
        </>
    )
}

export default ConfigPage
