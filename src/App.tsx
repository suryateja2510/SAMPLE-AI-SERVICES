import React, { useState } from "react";
import "./App.css";
import { AnalyseInput } from "./languageService";
import { type AnalyzeActionName } from "@azure/ai-language-text";

const App: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [storedInput, setStoredInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<
    AnalyzeActionName | ""
  >("");
  const [languageServiceData, setLanguageServiceData] = useState({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setUserInput(e.target.value);
    setStoredInput(e.target.value);
  };

  const [loading, setLoading] = useState(false);

  const processUserInput = async (
    text: string,
    actionType: AnalyzeActionName
  ) => {
    setLanguageServiceData({});
    setLoading(true);
    try {
      const data = await AnalyseInput(text, actionType);
      setStoredInput(text);
      setLanguageServiceData(data);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (userInput.trim() === "") {
      setError("Please enter some text.");
      return;
    }
    if (!selectedService) {
      setError("Please select a service type.");
      return;
    }
    setError(null);
    processUserInput(userInput, selectedService as AnalyzeActionName);
    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const analyzeActionOptions = [
    "EntityLinking",
    "EntityRecognition",
    "KeyPhraseExtraction",
    "PiiEntityRecognition",
    "LanguageDetection",
    "SentimentAnalysis",
  ];

  return (
    <>
    <h3>Language Analyser</h3>
      <div className="app-container">
        <div className="label">Your Input: {storedInput}</div>
        <div className="label">
          Selected Service: {selectedService || "None selected"}
        </div>
        <pre
          style={{
            padding: "10px",
            borderRadius: "5px",
            height: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            backgroundColor: "black",
          }}
        >
          {loading && <div className="loading-label">Loading...</div>}
          {JSON.stringify(languageServiceData, null, 2)}
        </pre>
        <select
          title="Select service type"
          className="service-select"
          value={selectedService}
          onChange={(e) =>
            setSelectedService(e.target.value as AnalyzeActionName)
          }
        >
          <option value="">Select service type</option>
          {Array.isArray(analyzeActionOptions) &&
            analyzeActionOptions.map((item: any, idx: number) => (
              <option key={idx} value={item}>
                {item}
              </option>
            ))}
        </select>
        <div className="input-row">
          <input
            className="text-input"
            type="text"
            placeholder="enter your text"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={userInput}
            autoFocus
          />
          <button className="submit-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="error-message">
          {error && <span className="error-text">{error}</span>}
        </div>
      </div>
    </>
  );
};

export default App;
