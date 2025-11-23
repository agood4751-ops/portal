// components/WhatsAppWidget.js
import React, { useState } from 'react';

export default function WhatsAppWidget() {
  // REPLACE THIS WITH YOUR ACTUAL PHONE NUMBER (Format: CountryCode + Number, no + sign)
  // Example: 15551234567
  const phoneNumber = "12893028009"; 
  const defaultMessage = "Hi, I need help finding a job in Canada.";
  const [isVisible, setIsVisible] = useState(true);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  if (!isVisible) return null;

  return (
    <div className="wa-widget-container">
      {/* Notification Bubble */}
      <div className="wa-notification">
        <span className="close-btn" onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsVisible(false);
        }}>×</span>
        <p>👋 I'm here to help you get the best job in Canada!</p>
      </div>

      {/* WhatsApp Icon */}
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="wa-button"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          viewBox="0 0 32 32" 
          className="wa-icon" 
          fill="currentColor" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.164.1 1.517.59 2.887 2.908 5.758.4.487.816.93 1.29 1.273 2.662 1.92 4.53 1.56 5.646 1.217a6.55 6.55 0 0 0 1.39-.76c.286-.214.516-.53.645-.788.273-.515.273-1.332.273-1.332-.028-.1-.157-.186-.272-.244-.688-.344-1.762-.874-1.92-1.032-.128-.1-.27-.17-.4-.17-.344 0-.573.128-.66.243z"/>
          <path d="M16.024 3C8.84 3 3 8.84 3 16.024c0 2.33.613 4.613 1.78 6.63l-1.275 4.656 4.773-1.25a12.96 12.96 0 0 0 6.24 1.963c7.184 0 13.024-5.84 13.024-13.024C27.542 8.34 23.208 3 16.024 3zm0 23.85c-2.03 0-4.015-.53-5.75-1.56l-.414-.245-3.028.794.808-2.953-.27-.43a10.832 10.832 0 0 1-1.66-5.88c0-5.97 4.856-10.826 10.826-10.826 5.97 0 10.826 4.856 10.826 10.826 0 5.97-4.856 10.826-10.826 10.826z"/>
        </svg>
      </a>

      <style jsx>{`
        .wa-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          font-family: sans-serif;
        }

        /* Notification Bubble */
        .wa-notification {
          background: white;
          padding: 12px 16px;
          border-radius: 12px 12px 0 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          max-width: 200px;
          position: relative;
          animation: slideIn 0.5s ease-out;
          border: 1px solid #e5e7eb;
        }

        .wa-notification p {
          margin: 0;
          font-size: 0.9rem;
          color: #1f2937;
          line-height: 1.4;
        }

        .close-btn {
          position: absolute;
          top: 4px;
          right: 8px;
          font-size: 16px;
          color: #9ca3af;
          cursor: pointer;
          line-height: 1;
        }
        .close-btn:hover { color: #ef4444; }

        /* Button */
        .wa-button {
          width: 60px;
          height: 60px;
          background: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
          color: white;
          position: relative;
        }

        .wa-button:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.6);
        }

        .wa-icon {
          width: 36px;
          height: 36px;
        }

        /* Pulse Animation to grab attention */
        .wa-button::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #25D366;
          opacity: 0.5;
          animation: pulse 2s infinite;
          z-index: -1;
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          70% { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }

        @media (max-width: 480px) {
          .wa-widget-container {
            bottom: 16px;
            right: 16px;
          }
          .wa-button {
            width: 50px;
            height: 50px;
          }
          .wa-icon {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </div>
  );
}