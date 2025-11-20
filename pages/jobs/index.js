// pages/jobs/index.js
import { useRouter } from 'next/router';
import useSWR from 'swr';
import JobCard from '../../components/JobCard';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function JobsList() {
  const router = useRouter();
  const { title: qTitle = '', location: qLocation = '' } = router.query;
  
  const [title, setTitle] = useState(qTitle || '');
  const [location, setLocation] = useState(qLocation || '');
  const [filters, setFilters] = useState({
    field: '',
    type: '',
    featured: false
  });

  // Suggestion states
  const [titleSuggestions, setTitleSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  
  // IMPROVEMENT: Interaction flags to prevent API calls when clicking
  const [isTypingTitle, setIsTypingTitle] = useState(false);
  const [isTypingLocation, setIsTypingLocation] = useState(false);

  // Keyboard nav indices
  const [titleIndex, setTitleIndex] = useState(-1);
  const [locationIndex, setLocationIndex] = useState(-1);

  // Refs
  const titleRef = useRef(null);
  const locationRef = useRef(null);
  const titleAbortRef = useRef(null);
  const locationAbortRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      setTitle(qTitle || '');
      setLocation(qLocation || '');
    }
  }, [router.isReady, qTitle, qLocation]);

  const query = new URLSearchParams();
  if (qTitle) query.set('title', qTitle);
  if (qLocation) query.set('location', qLocation);
  if (filters.field) query.set('field', filters.field);
  if (filters.type) query.set('type', filters.type);
  if (filters.featured) query.set('featured', 'true');

  const { data, error } = useSWR(`/api/jobs?${query.toString()}`, fetcher, {
    fallbackData: { jobs: [] },
  });

  const jobs = data?.jobs || [];
  const totalJobs = jobs.length;

  function onSearch(e) {
    e?.preventDefault();
    // Close suggestions on search
    setShowTitleSuggestions(false);
    setShowLocationSuggestions(false);

    const params = new URLSearchParams();
    if (title) params.set('title', title);
    if (location) params.set('location', location);
    if (filters.field) params.set('field', filters.field);
    if (filters.type) params.set('type', filters.type);
    if (filters.featured) params.set('featured', 'true');
    router.push(`/jobs?${params.toString()}`);
  }

  function clearFilters() {
    setTitle('');
    setLocation('');
    setFilters({ field: '', type: '', featured: false });
    router.push('/jobs');
  }

  const hasActiveFilters = title || location || filters.field || filters.type || filters.featured;

  // --- Title Suggestion Logic ---
  useEffect(() => {
    // IMPROVEMENT: Don't fetch if we just clicked a suggestion
    if (!isTypingTitle) return;

    if (titleAbortRef.current) titleAbortRef.current.abort();
    const q = String(title || '').trim();
    
    if (q.length < 2) {
      setTitleSuggestions([]);
      setTitleIndex(-1);
      setShowTitleSuggestions(false);
      return;
    }

    const controller = new AbortController();
    titleAbortRef.current = controller;
    
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?type=title&q=${encodeURIComponent(q)}&limit=12`, { signal: controller.signal });
        if (!res.ok) return;
        const body = await res.json();
        setTitleSuggestions(body.suggestions || []);
        setShowTitleSuggestions(true);
        setTitleIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Title suggest error', err);
      }
    }, 300); // Increased debounce to 300ms for performance
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [title, isTypingTitle]);

  // --- Location Suggestion Logic ---
  useEffect(() => {
    if (!isTypingLocation) return;

    if (locationAbortRef.current) locationAbortRef.current.abort();
    const q = String(location || '').trim();
    
    if (q.length < 2) {
      setLocationSuggestions([]);
      setLocationIndex(-1);
      setShowLocationSuggestions(false);
      return;
    }

    const controller = new AbortController();
    locationAbortRef.current = controller;
    
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/suggest?type=location&q=${encodeURIComponent(q)}&limit=12`, { signal: controller.signal });
        if (!res.ok) return;
        const body = await res.json();
        setLocationSuggestions(body.suggestions || []);
        setShowLocationSuggestions(true);
        setLocationIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') console.error('Location suggest error', err);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [location, isTypingLocation]);

  // Click outside handler
  useEffect(() => {
    function onDocClick(e) {
      if (titleRef.current && !titleRef.current.contains(e.target)) {
        setShowTitleSuggestions(false);
      }
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        setShowLocationSuggestions(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // --- Robust Selection Handlers ---
  const pickTitleSuggestion = useCallback((s) => {
    setIsTypingTitle(false); // Stop fetching
    setTitle(s);
    setShowTitleSuggestions(false);
    setTitleIndex(-1);
  }, []);

  const pickLocationSuggestion = useCallback((s) => {
    setIsTypingLocation(false); // Stop fetching
    setLocation(s);
    setShowLocationSuggestions(false);
    setLocationIndex(-1);
  }, []);

  function onTitleKeyDown(e) {
    if (!showTitleSuggestions || titleSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setTitleIndex(i => Math.min(i + 1, titleSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setTitleIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (titleIndex >= 0 && titleIndex < titleSuggestions.length) {
        e.preventDefault(); // Stop form submit
        pickTitleSuggestion(titleSuggestions[titleIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowTitleSuggestions(false);
    }
  }

  function onLocationKeyDown(e) {
    if (!showLocationSuggestions || locationSuggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setLocationIndex(i => Math.min(i + 1, locationSuggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setLocationIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (locationIndex >= 0 && locationIndex < locationSuggestions.length) {
        e.preventDefault(); // Stop form submit
        pickLocationSuggestion(locationSuggestions[locationIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowLocationSuggestions(false);
    }
  }

  return (
    <div className="jobs-container">
      {/* Hero Section (Unchanged) */}
      <section className="jobs-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Find Your Dream Job in <span className="gradient-text">Canada</span>
              </h1>
              <p className="hero-description">
                Discover thousands of opportunities from top Canadian employers. 
                Filter by location, field, and job type to find your perfect match.
              </p>
            </div>
            <div className="hero-visual">
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80"
                alt="Professionals working"
                width={400}
                height={300}
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <form onSubmit={onSearch} className="search-form" autoComplete="off">
              <div className="search-inputs">
                
                {/* Title Input */}
                <div className="input-group" ref={titleRef}>
                  <span className="input-icon">🔍</span>
                  <input
                    className="search-input"
                    placeholder="Job title, keywords, or company"
                    value={title}
                    onChange={e => { 
                      setIsTypingTitle(true); 
                      setTitle(e.target.value); 
                    }}
                    onFocus={() => { if (titleSuggestions.length) setShowTitleSuggestions(true); }}
                    onKeyDown={onTitleKeyDown}
                    aria-autocomplete="list"
                    aria-haspopup="true"
                    aria-expanded={showTitleSuggestions}
                  />
                  {showTitleSuggestions && titleSuggestions.length > 0 && (
                    <ul className="suggestions-list" role="listbox">
                      {titleSuggestions.map((s, i) => (
                        <li
                          key={s + '-' + i}
                          role="option"
                          aria-selected={i === titleIndex}
                          className={`suggestion-item ${i === titleIndex ? 'selected' : ''}`}
                          onMouseDown={(ev) => ev.preventDefault()} /* Prevents input blur */
                          onClick={() => pickTitleSuggestion(s)}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Location Input */}
                <div className="input-group" ref={locationRef}>
                  <span className="input-icon">📍</span>
                  <input
                    className="search-input"
                    placeholder="City, province, or postal code"
                    value={location}
                    onChange={e => { 
                      setIsTypingLocation(true); 
                      setLocation(e.target.value); 
                    }}
                    onFocus={() => { if (locationSuggestions.length) setShowLocationSuggestions(true); }}
                    onKeyDown={onLocationKeyDown}
                    aria-autocomplete="list"
                    aria-haspopup="true"
                    aria-expanded={showLocationSuggestions}
                  />
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <ul className="suggestions-list" role="listbox">
                      {locationSuggestions.map((s, i) => (
                        <li
                          key={s + '-' + i}
                          role="option"
                          aria-selected={i === locationIndex}
                          className={`suggestion-item ${i === locationIndex ? 'selected' : ''}`}
                          onMouseDown={(ev) => ev.preventDefault()}
                          onClick={() => pickLocationSuggestion(s)}
                        >
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <button type="submit" className="search-button">
                  Search Jobs
                </button>
              </div>

              {/* Filters (Unchanged) */}
              <div className="filters-section">
                <div className="filters-header">
                  <span className="filters-label">Filters</span>
                  {hasActiveFilters && (
                    <button type="button" onClick={clearFilters} className="clear-filters">
                      Clear all
                    </button>
                  )}
                </div>
                
                <div className="filters-grid">
                  <select
                    value={filters.field}
                    onChange={e => setFilters({...filters, field: e.target.value})}
                    className="filter-select"
                  >
                    <option value="">All Fields</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Construction">Construction</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Finance">Finance</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                  </select>

                  <select
                    value={filters.type}
                    onChange={e => setFilters({...filters, type: e.target.value})}
                    className="filter-select"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.featured}
                      onChange={e => setFilters({...filters, featured: e.target.checked})}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Featured Jobs Only
                  </label>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results Section (Unchanged) */}
      <section className="results-section">
        <div className="container">
          <div className="results-header">
            <h2 className="results-title">
              Available Jobs 
            </h2>
            {hasActiveFilters && (
              <div className="active-filters">
                {title && <span className="active-filter">Title: {title}</span>}
                {location && <span className="active-filter">Location: {location}</span>}
                {filters.field && <span className="active-filter">Field: {filters.field}</span>}
                {filters.type && <span className="active-filter">Type: {filters.type}</span>}
                {filters.featured && <span className="active-filter">Featured</span>}
              </div>
            )}
          </div>

          {error ? (
            <div className="error-state">
              <div className="error-icon">⚠️</div>
              <h3>Unable to load jobs</h3>
              <p>Please check your connection and try again.</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-grid">
              {jobs.map(job => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or filters</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .jobs-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Hero Section */
        .jobs-hero {
          padding: 4rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffd700, #ff6b6b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .hero-visual {
          position: relative;
        }

        .hero-img {
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        /* Search Section */
        .search-section {
          padding: 2rem 0;
          margin-top: -4rem;
          position: relative;
          z-index: 2;
        }

        .search-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          /* IMPORTANT: Allow suggestion dropdown to flow outside */
          overflow: visible; 
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .search-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          align-items: start;
        }

        /* IMPORTANT: Styles for Suggestion UI */
        .input-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          position: relative; /* Needed for absolute positioning of suggestions */
        }

        .input-group:focus-within {
          border-color: #dc2626;
          background: white;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .suggestions-list {
          position: absolute;
          top: 100%; /* Push directly below input */
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 0 0 12px 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          margin-top: 4px;
          max-height: 300px;
          overflow-y: auto;
          list-style: none;
          padding: 0;
          z-index: 100; /* Ensure it sits on top of other content */
        }

        .suggestion-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          color: #1e293b;
          font-size: 0.95rem;
          border-bottom: 1px solid #f1f5f9;
          background: white;
        }

        .suggestion-item:last-child {
          border-bottom: none;
        }

        .suggestion-item:hover, .suggestion-item.selected {
          background-color: #fef2f2;
          color: #dc2626;
          font-weight: 500;
        }
        /* End Suggestion Styles */

        .input-icon {
          font-size: 1.25rem;
          opacity: 0.7;
        }

        .search-input {
          border: none;
          background: none;
          outline: none;
          font-size: 1rem;
          width: 100%;
          color: #1e293b;
        }

        .search-input::placeholder {
          color: #64748b;
        }

        .search-button {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          height: fit-content;
        }

        .search-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }

        /* Filters Section */
        .filters-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 1.5rem;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .filters-label {
          font-weight: 600;
          color: #374151;
        }

        .clear-filters {
          background: none;
          border: none;
          color: #dc2626;
          cursor: pointer;
          font-weight: 500;
          text-decoration: underline;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          align-items: center;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          font-size: 0.95rem;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: #dc2626;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 500;
          color: #374151;
        }

        .checkbox-input {
          display: none;
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          position: relative;
          transition: all 0.3s ease;
        }

        .checkbox-input:checked + .checkbox-custom {
          background: #dc2626;
          border-color: #dc2626;
        }

        .checkbox-input:checked + .checkbox-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        /* Results Section */
        .results-section {
          padding: 3rem 0;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1rem;
        }

        .results-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .active-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .active-filter {
          background: #fef2f2;
          color: #dc2626;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          border: 1px solid #fecaca;
        }

        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        /* States */
        .error-state, .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }

        .error-icon, .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-state h3, .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .error-state p, .empty-state p {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          border: 1px solid #dc2626;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .search-inputs {
            grid-template-columns: 1fr;
          }

          .jobs-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .jobs-hero {
            padding: 2rem 0;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1.125rem;
          }

          .search-card {
            padding: 1.5rem;
          }

          .results-header {
            flex-direction: column;
            align-items: stretch;
          }

          .jobs-grid {
            grid-template-columns: 1fr;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 0.5rem;
          }

          .search-card {
            padding: 1rem;
          }

          .hero-title {
            font-size: 1.75rem;
          }

          .results-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}