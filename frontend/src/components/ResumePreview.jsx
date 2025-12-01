export default function ResumePreview({ data, title }) {
  return (
    <div style={{
      flex: 1,
      border: "1px solid #ccc",
      padding: "20px",
      background: "#fff"
    }}>
      <h1>{data.fullName}</h1>
      <h3>{data.headline}</h3>
      <h4>Summary</h4>
      <p>{data.summary}</p>

      <hr />
      <h4>Skills</h4>
      <ul>
        {(data.skills || []).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <hr />
      <i>Preview of: {title}</i>
    </div>
  );
}
