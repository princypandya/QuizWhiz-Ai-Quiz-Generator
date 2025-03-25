import React, { useState, useEffect } from "react";

const AIChatComponent = () => {
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [config, setConfig] = useState({ topic: "", difficulty: "medium", numQuestions: 5 });

    useEffect(() => {
        const storedTopic = localStorage.getItem("selectedTopic") || "";
        const storedDifficulty = localStorage.getItem("selectedDifficulty") || "medium";
        const storedNumQuestions = parseInt(localStorage.getItem("numQuestions")) || 5;

        setConfig({ topic: storedTopic, difficulty: storedDifficulty, numQuestions: storedNumQuestions });
    }, []);

    const handleTopicChange = (e) => {
        const newTopic = e.target.value;
        setConfig((prevConfig) => ({ ...prevConfig, topic: newTopic }));
        localStorage.setItem("selectedTopic", newTopic);
    };

    const handleDifficultyChange = (e) => {
        const newDifficulty = e.target.value;
        setConfig((prevConfig) => ({ ...prevConfig, difficulty: newDifficulty }));
        localStorage.setItem("selectedDifficulty", newDifficulty);
    };

    const handleNumQuestionsChange = (e) => {
        const newNumQuestions = parseInt(e.target.value);
        setConfig((prevConfig) => ({ ...prevConfig, numQuestions: newNumQuestions }));
        localStorage.setItem("numQuestions", newNumQuestions);
    };

    const handleCompletion = async () => {
        setIsLoading(true);
        setError(null);
        setIsButtonDisabled(true); // Disable the button

        try {
            const apiKey = "AIzaSyAjGFif217NTM9i3-QFAVyl5FNdMo4Rx0k";
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{
                                text: `Generate "${config.numQuestions}" multiple-choice questions (MCQs) having difficulty level "${config.difficulty}" out of 3 difficulty levels: easy, medium, hard and the topic is "${config.topic}" in JSON format. Each question should have four options and indicate the correct answer.`
                            }],

                        },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResponse(data.candidates[0].content.parts[0].text);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
            // Re-enable the button after 5 seconds
            setTimeout(() => {
                setIsButtonDisabled(false);
            }, 5000); // 5-second cooldown
        }
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif" }}>
            {/* Header */}
            <header style={{ backgroundColor: "#007bff", color: "#fff", padding: "20px", textAlign: "center" }}>
                <h1>AI Haiku Generator</h1>
            </header>

            {/* Main Content */}
            <div style={{ padding: "20px" }}>
                <button
                    onClick={handleCompletion}
                    disabled={isLoading || isButtonDisabled}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        backgroundColor: isLoading || isButtonDisabled ? "#ccc" : "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    {isLoading ? "Generating..." : "Generate Haiku"}
                </button>
                {error && <p style={{ color: "red" }}>Error: {error}</p>}
                {response && (
                    <div style={{ marginTop: "20px" }}>
                        <h2>Haiku:</h2>
                        <p style={{ whiteSpace: "pre-wrap" }}>{response}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIChatComponent;