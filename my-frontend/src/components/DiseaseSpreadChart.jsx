import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { getDiseaseStats } from "../api/alerts";
import styles from "./DiseaseSpreadChart.module.css";

const COLORS = ["#255ad4", "#889aeb", "#e53e3e", "#f6ad55", "#48bb78", "#38b2ac", "#ed64a6", "#9f7aea", "#667eea"];

function DiseaseSpreadChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getDiseaseStats();
        const total = result.by_disease.reduce((sum, d) => sum + d.count, 0);
        const chartData = result.by_disease.filter((d) => d.count / total >= 0.02);

        setData(chartData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch disease data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Top Diseases in the Last 30 Days</h2>

      <p className={styles.note}>Showing diseases that account for 2%+ of alerts. Many rarer diseases are not shown.</p>

      <PieChart width={700} height={400}>
        <Pie
          data={data}
          dataKey="count"
          nameKey="disease"
          cx="50%"
          cy="50%"
          outerRadius={140}
          label={({ name }) => name}
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default DiseaseSpreadChart;
