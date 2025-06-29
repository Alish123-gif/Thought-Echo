import { getCurrentUser } from '@/utils/auth'
import React from 'react'
import AccessDenied from '@/components/AccessDenied'

const layout = async ({ children }) => {
    const user = await getCurrentUser()
    console.log('Admin Layout - User:', user)
    // Show access denied message with delayed redirect
    if (!user || !user.isAdmin) {
        return <AccessDenied />
    }

    return (
        <>
            {children}
        </>
    )
}

export default layout