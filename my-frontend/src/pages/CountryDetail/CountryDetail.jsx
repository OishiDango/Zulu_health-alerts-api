import { useParams } from "react-router-dom";
import { countryData } from "../../data/mockData";

function CountryDetail() {
  const { countryCode } = useParams();
  const data = countryData[countryCode];

  if (!data) {
    return <div>Country not found.</div>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <h1>{data.country}</h1>
      <p>{data.summary}</p>

      <div>
        {data.diseases.map((disease) => (
          <div
            key={disease.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "12px",
            }}
          >
            <h3>{disease.name}</h3>
            <p>Risk level: {disease.level}</p>
            <p>Date: {disease.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CountryDetail;
