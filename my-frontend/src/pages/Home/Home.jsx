import Navigation from "../../components/Navigation";
import WorldMapComponent from "../../components/WorldMap";
import styles from "./Home.module.css";

function Home() {
  return (
    <>
      <Navigation />
      <main className={styles.pageContainer}>
        <div className={styles.mapWrapper}>
          <WorldMapComponent />
        </div>
      </main>
    </>
  );
}

export default Home;
