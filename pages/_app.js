// pages/_app.js
import '../styles/globals.css';
import Header from '../components/Header';
import WhatsAppWidget from '../components/WhatsAppWidget';

export default function MyApp({ Component, pageProps }) {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Component {...pageProps} />
        <WhatsAppWidget />
      </main>
      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} HireFrontier - Your Gateway to Canadian Opportunities</p>
        </div>
      </footer>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .main-content {
          flex: 1;
          width: 100%;
        }

        .footer {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          color: white;
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
        }

        .footer p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}