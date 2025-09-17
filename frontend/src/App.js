import React, { useState } from "react";
import "./App.css";

const BACKEND = process.env.REACT_APP_BACKEND || "http://localhost:8080";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploadId, setUploadId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [memo, setMemo] = useState(null);
  const [error, setError] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setMemo(null);
    setUploadId(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return setError("Please choose a file first.");
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${BACKEND}/upload`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      setUploadId(data.upload_id);
    } catch (err) {
      setError("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadId) return setError("Upload first.");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/analyze/${uploadId}`, {
        method: "POST",
      });
      const data = await res.json();
      setMemo(data);
    } catch (err) {
      setError("Analysis failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>AI Analyst — Prototype</h1>
        <p>Upload a pitch deck and get an instant investment memo (mocked).</p>
      </header>

      <main>
        <section className="upload">
          <input type="file" onChange={onFileChange} />
          <div className="controls">
            <button onClick={handleUpload} disabled={!file || loading}>
              Upload
            </button>
            <button onClick={handleAnalyze} disabled={!uploadId || loading}>
              Analyze
            </button>
          </div>
          {loading && <div className="progress">Processing…</div>}
          {uploadId && <div className="info">Upload ID: {uploadId}</div>}
          {error && <div className="error">{error}</div>}
        </section>

        {memo && (
          <section className="result-card">
            <div className="score">Score: {memo.score}/100</div>
            <h2 className="thesis">{memo.thesis}</h2>

            <div className="columns">
              <div>
                <h3>Strengths</h3>
                <ul>
                  {memo.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Risks</h3>
                <ul>
                  {memo.risks.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3>Action Items</h3>
              <ol>
                {memo.action_items.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ol>
            </div>
            <div className="evidence">
              <h4>Evidence</h4>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(memo.evidence, null, 2)}
              </pre>
            </div>
          </section>
        )}
      </main>

      <footer>
        <small>Powered by Vertex AI (in the real pipeline) • Demo backend is mocked</small>
      </footer>
    </div>
  );
}
