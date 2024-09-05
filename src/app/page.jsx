
import { CardList, CategoryList, Featured, Menu } from "@/components";
import styles from "./homepage.module.css";


export default function Home() {
  return (
    <div className={styles.container}>
      <Featured />
      <CategoryList />
      <div className={styles.content}>
        <CardList />
        <Menu />
      </div>
    </div>
  );
}
