import Navigation from "../../components/Navigation";
import WorldMapComponent from "../../components/WorldMap";
import DiseaseGraph from "../../components/DiseaseGraph";
import styles from "./Home.module.css";
import DiseaseSpreadChart from "../../components/DiseaseSpreadChart";

function Home() {
  return (
    <>
      <Navigation />
      <main className={styles.pageContainer}>
        <div className={styles.mapWrapper}>
          <WorldMapComponent />
        </div>
        <div className={styles.graphSection}>
          <DiseaseGraph />
        </div>
        <div className={styles.pieChartSection}>
          <DiseaseSpreadChart />
        </div>
      </main>
    </>
  );
}

export default Home;
