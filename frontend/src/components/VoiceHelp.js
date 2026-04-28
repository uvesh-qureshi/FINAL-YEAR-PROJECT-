// frontend/src/components/VoiceHelp.js
import React, { useState } from 'react';

const VoiceHelp = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    console.log('Voice Help button clicked!');
    setIsOpen(true);
    console.log('Modal should open now, isOpen:', true);
  };

  const handleClose = () => {
    console.log('Closing modal');
    setIsOpen(false);
  };

  const commands = [
    {
      category: '🏠 Navigation',
      items: [
        { command: 'Create emergency', description: 'Opens emergency request form' },
        { command: 'Show dashboard', description: 'Opens live tracking dashboard' },
        { command: 'Go home', description: 'Returns to home page' }
      ]
    },
    {
      category: '🚑 Emergency Management',
      items: [
        { command: 'List ambulances', description: 'Shows all available ambulances' },
        { command: 'Check status', description: 'Shows emergency status' }
      ]
    },
    {
      category: 'ℹ️ Help',
      items: [
        { command: 'Help', description: 'Shows available commands' },
        { command: 'What can you do', description: 'Lists all capabilities' }
      ]
    }
  ];

  return (
    <>
      <button 
        className="voice-help-btn"
        onClick={handleOpen}
        title="Voice Commands Help"
      >
        ❓ Voice Help
      </button>

      {isOpen && (
        <div className="voice-help-modal-overlay" onClick={handleClose} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="voice-help-modal" onClick={(e) => e.stopPropagation()} style={{
            background: 'white',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <div className="voice-help-header">
              <h2>🎙️ Voice Command Guide</h2>
              <button className="voice-help-close" onClick={handleClose}>✕</button>
            </div>

            <div className="voice-help-content">
              <div className="voice-help-intro">
                <p>
                  <strong>How to use:</strong> Click the <span className="highlight">🎙️ Voice Command</span> button 
                  and speak clearly. The system will recognize your command and perform the action.
                </p>
              </div>

              {commands.map((section, idx) => (
                <div key={idx} className="voice-help-section">
                  <h3>{section.category}</h3>
                  <div className="voice-help-commands">
                    {section.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="voice-help-command">
                        <div className="voice-help-command-text">
                          <span className="voice-command-name">"{item.command}"</span>
                        </div>
                        <div className="voice-help-command-desc">
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="voice-help-tips">
                <h3>💡 Tips for Best Results:</h3>
                <ul>
                  <li>Speak clearly and at a normal pace</li>
                  <li>Minimize background noise</li>
                  <li>Use exact command phrases for best accuracy</li>
                  <li>Allow microphone access when prompted</li>
                  <li>Wait for "Listening..." indicator before speaking</li>
                </ul>
              </div>

              <div className="voice-help-troubleshooting">
                <h3>🔧 Troubleshooting:</h3>
                <p><strong>Microphone not working?</strong> Check browser permissions in settings</p>
                <p><strong>Commands not recognized?</strong> Try speaking more clearly or using exact phrases</p>
                <p><strong>Browser not supported?</strong> Try Chrome, Edge, or Safari</p>
              </div>
            </div>

            <div className="voice-help-footer">
              <button className="voice-help-got-it" onClick={handleClose}>
                Got it! 👍
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceHelp;
