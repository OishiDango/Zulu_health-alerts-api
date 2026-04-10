import { useState } from "react";
import styles from "./DiseaseGraph.module.css";

function DiseaseGraph() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [disease, setDisease] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // gotta fetch here
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Disease Outbreak Trends</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={styles.input}
          />
          <input
            type="date"
            value={to}
            min={from || undefined}
            onChange={(e) => setTo(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Disease (e.g. measles)"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default DiseaseGraph;
