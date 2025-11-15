// pages/404.js
import Link from 'next/link';
import Image from 'next/image';

export default function Custom404() {
  return (
    <div className="error-container">
      <div className="error-content">
        <div className="error-visual">
          <div className="error-illustration">
            <div className="error-icon">🔍</div>
            <div className="error-number">404</div>
          </div>
        </div>

        <div className="error-text">
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-description">
            Oops! The page you're looking for seems to have wandered off into the Canadian wilderness. 
            Don't worry - we'll help you find your way back to civilization.
          </p>

          <div className="error-actions">
            {/* Removed <a> tags inside <Link> */}
            <Link href="/">
              <span className="btn btn-primary">
                <span className="btn-icon">🏠</span>
                Back to Homepage
              </span>
            </Link>
            <Link href="/jobs">
              <span className="btn btn-secondary">
                <span className="btn-icon">💼</span>
                Browse Jobs
              </span>
            </Link>
            <Link href="/contact">
              <span className="btn btn-outline">
                <span className="btn-icon">📞</span>
                Get Help
              </span>
            </Link>
          </div>

          <div className="error-tips">
            <h3 className="tips-title">Quick Links</h3>
            <div className="tips-grid">
              <Link href="/jobs">
                <span className="tip-link">
                  <span className="tip-icon">💼</span>
                  Find Jobs
                </span>
              </Link>
              <Link href="/about">
                <span className="tip-link">
                  <span className="tip-icon">ℹ️</span>
                  About Us
                </span>
              </Link>
              <Link href="/contact">
                <span className="tip-link">
                  <span className="tip-icon">📞</span>
                  Contact
                </span>
              </Link>
              <Link href="/login">
                <span className="tip-link">
                  <span className="tip-icon">🔑</span>
                  Login
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .error-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: white;
        }

        .error-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          max-width: 1200px;
          width: 100%;
        }

        .error-visual {
          display: flex;
          justify-content: center;
        }

        .error-illustration {
          text-align: center;
          position: relative;
        }

        .error-icon {
          font-size: 8rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        .error-number {
          font-size: 6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .error-text {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .error-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          margin: 0;
        }

        .error-description {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
          margin: 0;
        }

        .error-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          min-width: 160px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ffd700, #ffa500);
          color: #1e293b;
          border: none;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.15);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.25);
          transform: translateY(-2px);
        }

        .btn-outline {
          background: transparent;
          color: white;
          border: 1px solid rgba(255,255,255,0.4);
        }

        .btn-outline:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .btn-icon {
          font-size: 1.25rem;
        }

        .error-tips {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .tips-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          text-align: center;
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .tip-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .tip-link:hover {
          background: rgba(255,255,255,0.2);
          transform: translateX(4px);
        }

        .tip-icon {
          font-size: 1.25rem;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .error-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .error-title {
            font-size: 2.5rem;
          }

          .error-icon {
            font-size: 6rem;
          }

          .error-number {
            font-size: 4rem;
          }

          .error-actions {
            justify-content: center;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .error-container {
            padding: 1rem;
          }

          .error-title {
            font-size: 2rem;
          }

          .error-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
