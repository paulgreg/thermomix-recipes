import React, { useState, useRef, MouseEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDataContext } from '../DataContext'

const Config = () => {
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
                        Type a cookbook name :
                        <input
                            ref={inputRef}
                            type="text"
                            name="key"
                            defaultValue={key ?? ''}
                            placeholder="myCookbook"
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
                        <small>
                            (only letters or number without space or special
                            characters)
                        </small>
                    </label>
                    <p>
                        <button
                            style={{ margin: '1em auto 0' }}
                            onClick={onLoad}
                        >
                            Load
                        </button>
                        <small>
                            (will fetch data from server and overwrite your
                            local data if any)
                        </small>
                    </p>
                </form>
            </div>
            <footer>
                <Link to="/">back</Link>
            </footer>
        </>
    )
}

export default Config
