import { useState } from "react";
import styles from "./DiseaseFilter.module.css";

const DISEASE_OPTIONS = [
  "Dengue",
  "Avian Influenza",
  "COVID-19",
  "Measles",
  "Cholera",
  "Rabies",
  "Anthrax",
  "Antimicrobial resistance",
];

export default function DiseaseFilter({ value, onChange }) {
  const [search, setSearch] = useState("");

  const toggleDisease = (disease) => {
    const exists = value.includes(disease);

    if (exists) {
      onChange(value.filter((d) => d !== disease));
    } else {
      onChange([...value, disease]);
    }
  };

  const filtered = DISEASE_OPTIONS.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <label>Disease</label>

      <input
        placeholder="Search disease..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.search}
      />

      <div className={styles.list}>
        {filtered.map((disease) => (
          <label key={disease} className={styles.option}>
            <input
              type="checkbox"
              checked={value.includes(disease)}
              onChange={() => toggleDisease(disease)}
            />
            <span>{disease}</span>
          </label>
        ))}
      </div>
    </div>
  );
}