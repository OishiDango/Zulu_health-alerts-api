import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./FilterPanel.module.css";
import filterIcon from "../assets/filter.png";

const defaultSections = {
  dateRange: true,
  network: false,
  diseases: false,
  species: false,
  location: false,
  region: false,
};

function FilterPanel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toDateRef = useRef(null);

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [sections, setSections] = useState(defaultSections);

  const filters = useMemo(
    () => ({
      from: searchParams.get("from") || "",
      to: searchParams.get("to") || "",
      disease: searchParams.get("disease") || "",
      species: searchParams.get("species") || "",
      continent: searchParams.get("region") || "",
      location: searchParams.get("location") || "",
    }),
    [searchParams],
  );

  const toggleSection = (sectionName) => {
    setSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();

    const params = new URLSearchParams(searchParams);

    let paramName = name;

    if (name === "continent") {
      paramName = "region";
    }

    if (trimmedValue) {
      if (name === "from" || name === "to") {
        params.set(paramName, trimmedValue);
      } else {
        params.set(paramName, trimmedValue.toLowerCase());
      }
    } else {
      params.delete(paramName);
    }

    if (name === "from") {
      const currentTo = params.get("to");
      if (currentTo && trimmedValue && currentTo < trimmedValue) {
        params.delete("to");
      }
    }

    if (name === "to") {
      const currentFrom = params.get("from");
      if (currentFrom && trimmedValue && trimmedValue < currentFrom) {
        params.set("to", currentFrom);
      }
    }

    navigate(`/search?${params.toString()}`);

    if (name === "from") {
      setTimeout(() => {
        toDateRef.current?.focus();
        toDateRef.current?.showPicker?.();
      }, 0);
    }
  };

  if (isPanelCollapsed) {
    return (
      <aside className={styles.collapsedPanel}>
        <div className={styles.collapsedInner}>
          <img src={filterIcon} className={styles.headerIcon} alt="Filter" />
          <button
            type="button"
            className={styles.panelToggleButton}
            onClick={() => setIsPanelCollapsed(false)}
            aria-label="Expand filter panel"
          >
            ›
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <img src={filterIcon} className={styles.headerIcon} alt="Filter" />
          <span>Filters</span>
        </div>

        <button
          type="button"
          className={styles.panelToggleButton}
          onClick={() => setIsPanelCollapsed(true)}
          aria-label="Collapse filter panel"
        >
          ‹
        </button>
      </div>

      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("dateRange")}
        >
          <span>Date Range</span>
          <span className={styles.arrow}>{sections.dateRange ? "⌃" : "⌄"}</span>
        </button>

        {sections.dateRange && (
          <div className={styles.sectionBody}>
            <div className={styles.dateRow}>
              <input
                type="date"
                name="from"
                value={filters.from}
                onChange={handleChange}
                className={styles.dateInput}
              />
              <input
                ref={toDateRef}
                type="date"
                name="to"
                value={filters.to}
                onChange={handleChange}
                min={filters.from || undefined}
                className={styles.dateInput}
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("diseases")}
        >
          <span>Diseases</span>
          <span className={styles.arrow}>{sections.diseases ? "⌃" : "⌄"}</span>
        </button>

        {sections.diseases && (
          <div className={styles.sectionBody}>
            <input
              type="text"
              name="disease"
              value={filters.disease}
              onChange={handleChange}
              placeholder="Search name..."
              className={styles.textInput}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("species")}
        >
          <span>Species</span>
          <span className={styles.arrow}>{sections.species ? "⌃" : "⌄"}</span>
        </button>

        {sections.species && (
          <div className={styles.sectionBody}>
            <input
              type="text"
              name="species"
              value={filters.species}
              onChange={handleChange}
              placeholder="Search name..."
              className={styles.textInput}
            />
          </div>
        )}
      </div>

      <div className={styles.section}>
        <button
          type="button"
          className={styles.sectionHeader}
          onClick={() => toggleSection("location")}
        >
          <span>Location</span>
          <span className={styles.arrow}>{sections.location ? "⌃" : "⌄"}</span>
        </button>

        {sections.location && (
          <div className={styles.sectionBody}>
            <label className={styles.subLabel}>Continent</label>
            <input
              type="text"
              name="continent"
              value={filters.continent}
              onChange={handleChange}
              placeholder="Search continent..."
              className={styles.textInput}
            />

            <div className={styles.checkboxList}>
              <label className={styles.checkboxItem}>
                <input type="checkbox" />
                <span>Asia</span>
              </label>
              <label className={styles.checkboxItem}>
                <input type="checkbox" />
                <span>Africa</span>
              </label>
              <label className={styles.checkboxItem}>
                <input type="checkbox" />
                <span>North America</span>
              </label>
              <label className={styles.checkboxItem}>
                <input type="checkbox" />
                <span>Europe</span>
              </label>
              <label className={styles.checkboxItem}>
                <input type="checkbox" />
                <span>South America</span>
              </label>
            </div>

            <label className={styles.subLabel} style={{ marginTop: "16px" }}>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleChange}
              placeholder="Search location..."
              className={styles.textInput}
            />
          </div>
        )}
      </div>
    </aside>
  );
}

export default FilterPanel;
