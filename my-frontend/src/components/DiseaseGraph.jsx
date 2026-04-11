import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getTimeseriesStats } from "../api/alerts";
import styles from "./DiseaseGraph.module.css";

function DiseaseGraph() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [disease, setDisease] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // so that the graph doesnt look incomplete
  const fillMissingPeriods = (results, from, to, interval) => {
    const map = {};
    results.forEach((r) => (map[r.period.slice(0, 10)] = r.count));

    const periods = [];
    const cursor = new Date(from);
    const end = new Date(to);

    // snap to start of period so keys match what the API returns
    if (interval === "month") cursor.setDate(1);
    if (interval === "week") {
      const day = cursor.getDay();
      cursor.setDate(cursor.getDate() + (day === 0 ? -6 : 1 - day)); // snap to Monday
    }

    while (cursor <= end) {
      // timezone bug fix
      const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      periods.push({ period: key, count: map[key] || 0 });

      if (interval === "day") cursor.setDate(cursor.getDate() + 1);
      else if (interval === "week") cursor.setDate(cursor.getDate() + 7);
      else cursor.setMonth(cursor.getMonth() + 1);
    }

    return periods;
  };

  const getInterval = () => {
    if (!from || !to) return "month";
    const days = (new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24);
    if (days <= 14) return "day";
    if (days <= 90) return "week";
    return "month";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const interval = getInterval();
      const result = await getTimeseriesStats({ from, to, disease, interval });
      console.log(result.results);
      setData(fillMissingPeriods(result.results || [], from, to, interval));
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
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

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {data.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default DiseaseGraph;
