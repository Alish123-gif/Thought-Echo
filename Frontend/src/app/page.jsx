
import { RecentPosts, Featured, Menu } from "@/components";
import styles from "./homepage.module.css";
import { getHomePageData } from "@/utils/api";
import HomePageClient from "./HomePageClient";

// Server-side data fetching
async function getHomeData() {
  try {
    const data = await getHomePageData({
      featuredLimit: 5,
      recentLimit: 6,
      menuLimit: 5
    });
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return { data: null, error: error.message };
  }
}

export default async function Home({ searchParams }) {
  const { data: initialData, error: dataError } = await getHomeData();

  return (
    <div className={styles.container}>
      <HomePageClient
        initialData={initialData}
        dataError={dataError}
        searchParams={searchParams}
      />
    </div>
  );
}
