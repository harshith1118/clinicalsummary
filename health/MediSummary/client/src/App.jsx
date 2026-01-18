import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { 
  FaStethoscope, 
  FaClipboardList, 
  FaUserMd, 
  FaNotesMedical, 
  FaCopy, 
  FaCheck, 
  FaHeartbeat, 
  FaExclamationTriangle,
  FaMagic,
  FaChevronRight,
  FaVolumeUp,
  FaStop,
  FaTrash
} from 'react-icons/fa';

function App() {
  const [note, setNote] = useState('');
  const [output, setOutput] = useState('');
  const [activeMode, setActiveMode] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const sampleNote = `Patient: John Doe, 45M
Reason: Chest pain, mild SOB
History: HTN, smoker (10 pack-years)
Vitals: BP 145/90, HR 88, SpO2 98%
Exam: Lungs clear, regular rhythm, no murmurs. Mild tenderness chest wall.
Plan: EKG normal. Likely musculoskeletal. Rec NSAIDs. Follow up with PCP in 1 week. Stop smoking.`;

  const stripMarkdown = (text) => {
    return text
      .replace(/[#*`_]/g, '') // Remove simple markdown chars
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/^\s*[-+]\s+/gm, '') // Remove list markers
      .replace(/^\s*>\s+/gm, '') // Remove blockquotes
      .replace(/\n{2,}/g, '\n'); // Normalize newlines
  };

  const handleSpeak = () => {
    if (!output) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const cleanText = stripMarkdown(output);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleGenerate = async (mode) => {
    if (!note.trim()) {
      setError('Please enter a clinical note first.');
      return;
    }
    
    setLoading(true);
    setActiveMode(mode);
    setError('');
    setOutput('');
    setCopied(false);

    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, note }),
      });

      const data = await response.json();
      if (response.ok) {
        setOutput(data.output);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      setError('Failed to connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setNote('');
    setOutput('');
    setActiveMode(null);
    setError('');
    if (isSpeaking) handleStopSpeak();
  };

  return (
    <div className="app-container">
      
      {/* Minimized Sidebar */}
      <aside className="sidebar">
        <div className="brand-icon">
          <FaHeartbeat size={28} />
        </div>
        
        <div className="nav-icon active" title="Workspace">
          <FaNotesMedical size={20} />
        </div>
        <div className="nav-icon" title="History">
          <FaClipboardList size={20} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        
        {/* Hero Header */}
        <header className="hero-header">
          <h1 className="hero-title">Clinical Workspace</h1>
          
          <div className="d-flex align-items-center gap-3">
            <div className="status-pill">
              <div className="dot-live"></div>
              GEMINI 3.0 FLASH
            </div>
            <button className="btn-ghost" onClick={() => setNote(sampleNote)}>
               Load Sample
            </button>
          </div>
        </header>

        {/* Bento Grid Workspace */}
        <div className="workspace">
          <div className="row h-100 g-5">
            
            {/* Input Card */}
            <div className="col-lg-6 h-100">
              <div className="floating-card">
                <div className="card-top">
                  <span className="card-label">01 // Input Stream</span>
                  <div className="d-flex gap-2">
                    {(note || output) && (
                      <button className="btn-circle-small" onClick={handleClear} title="Clear All">
                        <FaTrash size={12} />
                      </button>
                    )}
                    <FaStethoscope className="text-secondary" />
                  </div>
                </div>
                
                <textarea
                  className="input-canvas"
                  placeholder="Start typing clinical observations..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                ></textarea>
                
                <div className="action-bar">
                  <button 
                    className="btn-magic"
                    onClick={() => handleGenerate('summary')}
                    disabled={loading}
                  >
                    {loading && activeMode === 'summary' ? <span className="spinner-border spinner-border-sm"/> : <FaMagic />}
                    Summary
                  </button>
                  
                  <button 
                    className={`btn-pill ${activeMode === 'soap' ? 'active' : ''}`}
                    onClick={() => handleGenerate('soap')}
                  >
                    SOAP
                  </button>
                  <button 
                    className={`btn-pill ${activeMode === 'checklist' ? 'active' : ''}`}
                    onClick={() => handleGenerate('checklist')}
                  >
                    Checklist
                  </button>
                  <button 
                    className={`btn-pill ${activeMode === 'patient' ? 'active' : ''}`}
                    onClick={() => handleGenerate('patient')}
                  >
                    Patient
                  </button>
                </div>
              </div>
            </div>

            {/* Output Card */}
            <div className="col-lg-6 h-100">
              <div className="floating-card" style={{background: 'rgba(15, 15, 15, 0.8)'}}>
                <div className="card-top">
                  <span className="card-label">02 // AI Analysis</span>
                  <div className="d-flex gap-2">
                    {output && (
                      <>
                        <button 
                          className={`btn-circle ${isSpeaking ? 'active' : ''}`}
                          onClick={isSpeaking ? handleStopSpeak : handleSpeak}
                          title="Read Aloud"
                        >
                          {isSpeaking ? <FaStop size={14}/> : <FaVolumeUp size={14}/>}
                        </button>
                        <button 
                          className="btn-circle"
                          onClick={copyToClipboard}
                          title="Copy to Clipboard"
                        >
                          {copied ? <FaCheck size={14}/> : <FaCopy size={14}/>}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="output-content h-100">
                  {error && (
                    <div className="alert alert-danger bg-transparent border-danger text-danger">
                       <FaExclamationTriangle className="me-2" /> {error}
                    </div>
                  )}

                  {!output && !error && !loading && (
                    <div className="h-100 d-flex flex-column align-items-center justify-content-center opacity-25">
                      <FaMagic size={48} className="mb-4"/>
                      <p className="text-uppercase tracking-widest text-small">Waiting for Data</p>
                    </div>
                  )}

                  {loading && (
                     <div className="h-100 d-flex flex-column align-items-center justify-content-center">
                       <div className="spinner-border text-white mb-4" style={{width: '3rem', height: '3rem'}} role="status"></div>
                       <p className="text-secondary tracking-widest">PROCESSING...</p>
                     </div>
                  )}

                  {output && !loading && (
                    <div className="markdown-body">
                      <ReactMarkdown
                         components={{
                           ul: ({node, ...props}) => <ul className="list-unstyled" {...props} />,
                           li: ({node, ...props}) => <li className="mb-3">{props.children}</li>,
                           h3: ({node, ...props}) => <h3 className="mb-3 mt-4">{props.children}</h3>,
                         }}
                      >
                        {output}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
