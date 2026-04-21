import MultiSelectFilter from "./MultiSelectFilter";

const SPECIES_OPTIONS = [
  "Human",
  "Bird",
  "Poultry",
  "Cattle",
  "Pig",
  "Horse",
  "Dog",
  "Cat",
];

export default function SpeciesFilter({ value, onChange }) {
  return (
    <MultiSelectFilter
      label="Species"
      options={SPECIES_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}