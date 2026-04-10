import { useEffect, useMemo, useState } from "react";
import { getAlerts } from "../api/alerts";
import { useNavigate } from "react-router-dom";
import WorldMap from "react-svg-worldmap";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import styles from "./WorldMap.module.css";

countries.registerLocale(enLocale);

// To correct some coutry name differences beteen data and library
const mapCountryToSearchName = (name) => {
  const aliasMap = {
    "People's Republic of China": "China",
    "United States of America": "United States",
    "Russian Federation": "Russia",
    "Republic of Korea": "South Korea",
    "Democratic People's Republic of Korea": "North Korea",
  };

  return aliasMap[name] || name;
};

function WorldMapComponent() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // to fetch aleart
  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        setError("");

        const data = await getAlerts();

        const alertList = data.alerts || [];
        setAlerts(alertList);
      } catch (err) {
        setError(err.message || "Failed to fetch alerts");
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const data = useMemo(() => {
    const countryCountMap = {};

    alerts.forEach((alert) => {
      const diseases = alert.disease || [];
      const locations = alert.location || [];

      const uniqueCountryNames = new Set(
        locations.map((loc) => loc?.[0]).filter(Boolean),
      );

      uniqueCountryNames.forEach((countryName) => {
        const normalizedName = mapCountryToSearchName(countryName);
        const alpha2 = countries.getAlpha2Code(normalizedName, "en");

        if (!alpha2) return;

        const code = alpha2.toLowerCase();

        if (!countryCountMap[code]) {
          countryCountMap[code] = 0;
        }

        countryCountMap[code] += diseases.length;
      });
    });

    return Object.entries(countryCountMap).map(([code, count]) => ({
      country: code,
      value: count,
    }));
  }, [alerts]);

  // On click redirect to search page with location filter
  const handleClick = (country) => {
    const countryName = country.countryName;
    if (!countryName) return;

    const searchName = mapCountryToSearchName(countryName);

    navigate(`/search?location=${encodeURIComponent(searchName)}`);
  };

  if (loading) {
    return <div className={styles.worldmapWrapper}>Loading map...</div>;
  }

  if (error) {
    return <div className={styles.worldmapWrapper}>Error: {error}</div>;
  }

  return (
    <div className={styles.worldmapWrapper}>
      <WorldMap
        data={data}
        color="red"
        size={1070}
        onClickFunction={handleClick}
      />
    </div>
  );
}

export default WorldMapComponent;
