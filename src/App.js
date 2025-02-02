import './App.css'; 
import React, { useState } from 'react';
import axios from 'axios';

// Reusable Input Component
function TextBox({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Enter your issue..."
      value={value}
      onChange={onChange}
    />
  );
}

// Reusable Button Component
function MoodButton({ label, onClick, isSelected }) {
  return (
    <button 
      onClick={onClick} 
      style={{
        backgroundColor: isSelected ? "#333" : "",
        color: isSelected ? "white" : ""
      }}
    >
      {label}
    </button>
  );
}

     
   
// Main App Component
const App = () => {
  const [text, setText] = useState(""); // User's issue
  const [mood, setMood] = useState("neutral"); // User's mood
  const [response, setResponse] = useState({ pros: [], cons: [], recommendation: "" }); 
  const [loading, setLoading] = useState(false); // Loading state


  const moods = ["Happy", "Optimistic", "Neutral", "Anxious", "Upset"];

  // Handle input change
  const handleIssueChange = (e) => {
    setText(e.target.value);
  };

  // Handle mood selection
  const handleMoodChange = (newMood) => {
    setMood(newMood);
  };

  // Function to call backend for AI-generated pros and cons
  const generateChatResponse = async () => {
     if (!text.trim()) {
      setResponse({ pros: [], cons: [], recommendation: "" });  // Reset response when there's no text
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/generate', {
        issue: text,
        mood: mood
      });

      // Log the response to check its structure
      console.log(res.data);
    
      if (res.data && res.data.response) {
        const responseText = res.data.response;
        const prosStart = responseText.indexOf("Pros:");
        const consStart = responseText.indexOf("Cons:");

        const pros = prosStart !== -1 ? responseText.substring(prosStart + 5, consStart).trim().split("\n").filter(Boolean) : [];
        const cons = consStart !== -1 ? responseText.substring(consStart + 5).trim().split("\n").filter(Boolean) : [];

        // Determine the best recommendation based on mood and pros/cons
        let recommendation = "";

        if (pros.length > cons.length) {
          recommendation = "✅ The pros outweigh the cons. It's recommended to go ahead with this decision!";
        } else if (cons.length > pros.length) {
          recommendation = "❌ The cons outweigh the pros. It might be better to reconsider this decision.";
        } else {
          recommendation = "🤔 The pros and cons are balanced. It’s a neutral decision.";
        }

        // Set the final response with pros, cons, and recommendation
        setResponse({ pros, cons, recommendation });
      } else {
        setResponse({ pros: [], cons: [], recommendation: "" });  // In case of no valid response
      }
    } catch (error) {
      console.error('Error calling API:', error);
      setResponse({ pros: [], cons: [], recommendation: "" });  // Reset response on error
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>🤖 AI-Powered Decision-Making Chatbot</h1>
      <p className="mind-text">What’s on your mind today?</p>
      
      {/* Issue Input */}
      <TextBox value={text} onChange={handleIssueChange} className="textbox"/>
      
      <p>Choose one that aligns with how you feel. </p>

      {/* Mood Buttons - Display in a row */}
      <div className="button-container">
        {moods.map((moodOption) => (
          <MoodButton 
            key={moodOption} 
            label={moodOption} 
            onClick={() => handleMoodChange(moodOption.toLowerCase())} 
            isSelected={mood === moodOption.toLowerCase()} 
          />
        ))}
      </div>

      {/* Generate Pros and Cons */}
      <button onClick={generateChatResponse} disabled={loading}>
        {loading ? '⏳ Generating...' : '✅ Generate Pros and Cons'}
      </button>

      {/* Display Response */}
      {response && (
        <div>
          <h3>📜 Pros and Cons List:</h3>

          {/* Check if there are pros or cons to display */}
          {(response.pros.length > 0 || response.cons.length > 0) && (
            <div className="pros-cons-container">
              {/* Pros Section */}
              {response.pros.length > 0 && (
                <div className="pros-section">
                  <h2>✅ Pros</h2>
                  <ul>
                    {response.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons Section */}
              {response.cons.length > 0 && (
                <div className="cons-section">
                  <h2>❌ Cons</h2>
                  <ul>
                    {response.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Display the Recommendation */}
          {response.recommendation && (
            <div className="recommendation">
              <h3>Based on the pros and cons listed, your recommended decision is:</h3>
              <p>{response.recommendation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;