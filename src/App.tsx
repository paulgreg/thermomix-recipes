import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDataContext } from './DataContext'
import { useLocation } from 'react-router-dom'

export default function App() {
    const { key, setKey } = useDataContext()
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const cookbookName = searchParams.get('cookbook')
        if (cookbookName) {
            setKey(cookbookName)
        } else if (!key && !location.pathname.includes('/config')) {
            navigate('/config')
        }
    }, [key, location, navigate, setKey])

    return (
        <div className="app">
            <Outlet />
        </div>
    )
}
