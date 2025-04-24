import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDataContext } from './DataContext'

export default function App() {
    const { initLoad } = useDataContext()

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const cookbookName = searchParams.get('cookbook')

        initLoad(cookbookName ?? undefined)
    }, [])

    return (
        <div className="app">
            <Outlet />
        </div>
    )
}
