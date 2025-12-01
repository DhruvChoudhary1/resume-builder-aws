import { useState } from "react";
import { api } from "../api";
import ResumePreview from "../components/ResumePreview";

export default function EditorPage({ resume, onBack }) {
  const [title, setTitle] = useState(resume?.title || "My Resume");
  const [data, setData] = useState(
    resume?.data_json || {
      fullName: "",
      headline: "",
      summary: "",
      skills: [],
    }
  );

  async function save() {
    const payload = { title, template: "modern", data };

    if (resume) await api.update(resume.id, payload);
    else await api.create(payload);

    alert("Saved!");
    onBack();
  }

  return (
    <div className="editor-container">

      {/* Left panel */}
      <div className="editor-left">
        <h2 style={{ marginBottom: "15px" }}>Edit Resume</h2>

        <input
          placeholder="Resume Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Full Name"
          value={data.fullName}
          onChange={(e) =>
            setData({ ...data, fullName: e.target.value })
          }
        />

        <input
          placeholder="Headline (e.g. Web Developer)"
          value={data.headline}
          onChange={(e) =>
            setData({ ...data, headline: e.target.value })
          }
        />

        <textarea
          placeholder="Professional Summary"
          value={data.summary}
          onChange={(e) =>
            setData({ ...data, summary: e.target.value })
          }
        />

        <button onClick={save} style={{ marginRight: "10px" }}>Save</button>
        <button onClick={onBack} style={{ background: "#777" }}>Back</button>
      </div>

      {/* Right preview panel */}
      <ResumePreview data={data} title={title} />
    </div>
  );
}

