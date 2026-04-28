// frontend/src/components/QRCodeGenerator.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const QRCodeGenerator = ({ emergency }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (emergency && isModalOpen) {
      generateQRCode();
    }
  }, [emergency, isModalOpen]);

  const generateQRCode = () => {
    const baseUrl = window.location.origin;
    const trackingUrl = `${baseUrl}/track/${emergency.id}`;
    setShareUrl(trackingUrl);

    // Using free QR API - no installation needed!
    const qrData = encodeURIComponent(trackingUrl);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrData}`;
    setQrCodeUrl(qrApiUrl);
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `Emergency-${emergency.id}-QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('✅ QR Code downloaded!');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('✅ Tracking URL copied!');
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `🚑 Emergency Tracking\n\nPatient: ${emergency.patient_name}\nEmergency ID: #${emergency.id}\n\nTrack live: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const handlePrintQR = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Emergency QR - #${emergency.id}</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 40px; }
            .container { border: 3px solid #667eea; padding: 30px; display: inline-block; border-radius: 15px; }
            h1 { color: #667eea; }
            .details { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; text-align: left; }
            .details p { margin: 8px 0; }
            img { border: 2px solid #ddd; padding: 10px; margin: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚑 Smart Ambulance System</h1>
            <h2>Emergency Tracking QR Code</h2>
            <img src="${qrCodeUrl}" width="300" />
            <div class="details">
              <p><strong>Emergency ID:</strong> #${emergency.id}</p>
              <p><strong>Patient:</strong> ${emergency.patient_name}</p>
              <p><strong>Type:</strong> ${emergency.emergency_type}</p>
              <p><strong>Severity:</strong> ${emergency.severity?.toUpperCase()}</p>
              <p><strong>Status:</strong> ${emergency.status?.toUpperCase()}</p>
            </div>
            <p><strong>📱 Scan to track ambulance in real-time</strong></p>
            <p style="font-size: 10px;">${shareUrl}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  if (!emergency) return null;

  return (
    <>
      <button className="btn-qr-code" onClick={() => setIsModalOpen(true)}>
        📱 QR Code
      </button>

      {isModalOpen && (
        <div className="qr-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="qr-modal-header">
              <h2>📱 Emergency QR Code</h2>
              <button className="qr-modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <div className="qr-modal-content">
              <div className="qr-emergency-info">
                <div className="qr-info-card">
                  <span className="qr-info-label">ID</span>
                  <span className="qr-info-value">#{emergency.id}</span>
                </div>
                <div className="qr-info-card">
                  <span className="qr-info-label">Patient</span>
                  <span className="qr-info-value">{emergency.patient_name}</span>
                </div>
                <div className="qr-info-card">
                  <span className="qr-info-label">Status</span>
                  <span className={`qr-status-pill status-${emergency.status}`}>
                    {emergency.status?.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="qr-code-container">
                {qrCodeUrl ? (
                  <>
                    <div className="qr-code-wrapper">
                      <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
                    </div>
                    <p className="qr-scan-text">📱 Scan to track in real-time</p>
                  </>
                ) : (
                  <div className="qr-loading">Generating...</div>
                )}
              </div>

              <div className="qr-url-section">
                <label className="qr-url-label">📍 Tracking URL:</label>
                <div className="qr-url-container">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="qr-url-input"
                    onClick={(e) => e.target.select()}
                  />
                  <button className="qr-url-copy-btn" onClick={handleCopyUrl}>
                    📋 Copy
                  </button>
                </div>
              </div>

              <div className="qr-features">
                <h3>🎯 Features:</h3>
                <ul className="qr-features-list">
                  <li>📍 Track ambulance live location</li>
                  <li>📊 View real-time status updates</li>
                  <li>🏥 See hospital details</li>
                  <li>⏱️ Check ETA</li>
                  <li>👨‍👩‍👧 Share with family</li>
                </ul>
              </div>

              <div className="qr-actions">
                <button className="qr-btn qr-btn-download" onClick={handleDownloadQR}>
                  ⬇️ Download
                </button>
                <button className="qr-btn qr-btn-print" onClick={handlePrintQR}>
                  🖨️ Print
                </button>
                <button className="qr-btn qr-btn-whatsapp" onClick={handleShareWhatsApp}>
                  💬 WhatsApp
                </button>
                <button className="qr-btn qr-btn-copy" onClick={handleCopyUrl}>
                  📋 Copy Link
                </button>
              </div>

              <div className="qr-how-to">
                <h4>📖 How to use:</h4>
                <ol className="qr-steps">
                  <li>Scan QR with smartphone camera</li>
                  <li>Click the link that appears</li>
                  <li>View live ambulance location</li>
                  <li>Share with family members</li>
                </ol>
              </div>
            </div>

            <div className="qr-modal-footer">
              <button className="qr-btn-close" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QRCodeGenerator;
