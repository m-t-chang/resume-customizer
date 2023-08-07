import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [resumeInput, setResumeInput] = useState("");
  const [jobDescriptionInput, setJobDescriptionInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume: resumeInput, jobDescription: jobDescriptionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      console.log(data.result);
      // optionally reset the inputs here
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        {/* <link rel="icon" href="/dog.png" /> */}
      </Head>

      <main className={styles.main}>
        {/* <img src="/dog.png" className={styles.icon} /> */}
        <h3>Customize a resume for a job description</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="resume">Resume</label>
          <textarea
            id="resume"
            name="resume"
            value={resumeInput}
            onChange={(e) => setResumeInput(e.target.value)}
          />
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            name="job-description"
            value={jobDescriptionInput}
            onChange={(e) => setJobDescriptionInput(e.target.value)}
          />
          <input type="submit" value="Generate" />
        </form>

        {/* <div className={styles.result}>{result}</div> */}

        <textarea
            id="ai-result"
            name="ai-result"
            value={result}
            readOnly={true}
          />
      </main>
    </div>
  );
}
