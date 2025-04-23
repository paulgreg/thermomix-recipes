import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { t } from './i18n/i18n'

export default function App() {
    const { initLoad } = useDataContext()

    useEffect(() => {
        initLoad()
    }, [])

    return (
        <div className="app">
            <header>
                <Link to="/">{t('title')}</Link>
            </header>
            <Outlet />
        </div>
    )
}
