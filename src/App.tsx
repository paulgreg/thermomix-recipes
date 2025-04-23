import React, { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useDataContext } from './DataContext'

export default function App() {
    const { initLoad } = useDataContext()

    useEffect(() => {
        initLoad()
    }, [])

    return (
        <div className="app">
            <Outlet />
        </div>
    )
}
