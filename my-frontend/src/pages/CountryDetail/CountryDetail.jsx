import { useState } from "react";
import { useParams } from "react-router-dom";
import australiaData from "../../data/australiaMockData";
import styles from "./CountryDetail.module.css";

// group alerts by disease name
const groupByDisease = (alerts) => {
  const groups = {};
  alerts.forEach((alert) => {
    const disease = alert.disease[0];
    if (!groups[disease]) {
      groups[disease] = [];
    }
    groups[disease].push(alert);
  });
  return groups;
};

function CountryDetail() {
  const { countryCode } = useParams();
  const [selectedDisease, setSelectedDisease] = useState(null);

  if (countryCode !== "AU") {
    return <div className={styles.notFound}>Not yet implemented.</div>;
  }

  const diseaseGroups = groupByDisease(australiaData.alerts);
  const diseaseNames = Object.keys(diseaseGroups);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Australia</h1>
        <p className={styles.subtitle}>
          A snapshot of global health events from the past year
        </p>
      </div>

      <div className={styles.layout}>
        {/* left panel */}
        <div className={styles.leftPanel}>
          <h3 className={styles.panelTitle}>Active Diseases</h3>
          {diseaseNames.map((disease) => {
            const alerts = diseaseGroups[disease];
            const latest = alerts[0].date;
            const isSelected = (selectedDisease === disease);

            return (
              <div
                key={disease}
                className={`${styles.diseaseCard} ${isSelected ? styles.diseaseCardSelected : ""}`}
                onClick={() => setSelectedDisease(disease)}
              >
                <p className={styles.diseaseName}>{disease}</p>
                <div className={styles.diseaseMeta}>
                  <span>{alerts.length} alert{alerts.length > 1 ? "s" : ""}</span>
                  <span>{latest}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* right panel */}
        <div className={styles.rightPanel}>
          {selectedDisease === null ? (
            <div className={styles.emptyState}>
              <p>Select a disease to view alerts</p>
            </div>
          ) : (
            <>
              <h2 className={styles.detailTitle}>{selectedDisease}</h2>
              <p className={styles.detailCount}>
                {diseaseGroups[selectedDisease].length} reported alert{diseaseGroups[selectedDisease].length > 1 ? "s" : ""} in Australia
              </p>

              {diseaseGroups[selectedDisease].map((alert) => {
                const locations = alert.location
                  .filter((loc) => loc[0] === "Australia")
                  .map((loc) => loc.slice(1).join(", "))
                  .filter((loc) => loc.length > 0);

                return (
                  <div key={alert.id} className={styles.alertCard}>
                    <p className={styles.alertDate}>{alert.date}</p>
                    <p className={styles.alertTitle}>{alert.title}</p>

                    <div className={styles.alertMeta}>
                      {/* locations */}
                      {locations.length > 0 && (
                        <div className={styles.alertLocations}>
                          {locations.map((loc, i) => (
                            <span key={i} className={styles.locationTag}>{loc}</span>
                          ))}
                        </div>
                      )}

                      {/* species */}
                      <div className={styles.alertSpecies}>
                        {alert.species.map((s, i) => (
                          <span key={i} className={styles.speciesTag}>{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;
