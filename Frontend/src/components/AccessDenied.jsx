'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './AccessDenied.module.css'

const AccessDenied = () => {
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/')
        }, 3000)

        return () => clearTimeout(timer)
    }, [router])

    return (
        <div className={styles.accessDenied}>
            <h1>Access Denied</h1>
            <p>You do not have permission to access this page.</p>
            <span>You will be redirected back in 3 seconds</span>
        </div>
    )
}

export default AccessDenied
