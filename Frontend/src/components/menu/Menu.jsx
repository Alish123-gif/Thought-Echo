import React from 'react'
import styles from './menu.module.css'
import MenuPosts from '../menuPosts/MenuPosts'
import MenuCategories from '../menuCatergories/MenuCategories'
const Menu = () => {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h2 className={styles.subtitle}>{"What's hot"}</h2>
                <h1 className={styles.title}>Most Popular</h1>
                <MenuPosts withImage={false} type="popular" limit={4} />
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>Discover by topic</h2>
                <h1 className={styles.title}>Categories</h1>
                <MenuCategories />
            </div>

            <div className={styles.section}>
                <h2 className={styles.subtitle}>Chosen by the editor</h2>
                <h1 className={styles.title}>Editors Pick</h1>
                <MenuPosts withImage={true} type="featured" limit={4} />
            </div>
        </div>
    )
}

export default Menu