import MultiSelectFilter from "./MultiSelectFilter";

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
  return (
    <MultiSelectFilter
      label="Disease"
      options={DISEASE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}