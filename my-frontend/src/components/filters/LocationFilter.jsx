import MultiSelectFilter from "./MultiSelectFilter"; // reusable version
import styles from "./MultiSelectFilter.module.css";

const CONTINENTS = [
  "Asia",
  "North America",
  "Europe",
  "Africa",
  "South America",
  "Oceania",
  "Antarctica",
];

const COUNTRIES = [
  "United States",
  "India",
  "Russia",
  "Brazil",
  "China",
  "Canada",
  "Australia",
  "United Kingdom",
];

export default function LocationFilter({ value, onChange }) {
  const handleChange = (key, newValues) => {
    onChange({
      ...value,
      [key]: newValues,
    });
  };

  return (
    <div className={styles.container}>

      {/* CONTINENT */}
      <MultiSelectFilter
        label="Continent"
        options={CONTINENTS}
        value={value.continent}
        onChange={(v) => handleChange("continent", v)}
      />

      {/* COUNTRY */}
      <MultiSelectFilter
        label="Country"
        options={COUNTRIES}
        value={value.country}
        onChange={(v) => handleChange("country", v)}
      />
    </div>
  );
}