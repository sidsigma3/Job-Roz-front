import React, { useState, useEffect } from 'react';

const App = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: 'developer',
    location: 'bangalore'
  });

  const fetchJobs = async (query, location) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(
      // `http://localhost:4000/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
      `https://job-roz-back.vercel.app/api/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`
    );

    if (!response.ok) throw new Error("Failed to fetch jobs");

    const data = await response.json();

    // ✅ FIX IS HERE
    setJobs(Array.isArray(data.jobs) ? data.jobs : []);

  } catch (err) {
    setError("Could not connect to the job server. Please try again later.");
    setJobs([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchJobs(searchParams.query, searchParams.location);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchParams.query, searchParams.location);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.maxContainer}>
          <h1 style={styles.title}>India Job Search</h1>
          <p style={styles.subtitle}>Find your next career move across India</p>
        </div>
      </header>

      <div style={styles.maxContainer}>
        {/* Search Section */}
        <section style={styles.searchCard}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Job Title</label>
              <input
                type="text"
                placeholder="e.g. React Developer"
                value={searchParams.query}
                onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                placeholder="e.g. Bangalore"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.searchButton}>Search Jobs</button>
          </form>
        </section>

        {/* Listings Section */}
        <main>
          {loading && <div style={styles.loader}>Searching current openings...</div>}
          
          {error && <div style={styles.errorMessage}>{error}</div>}

          {!loading && !error && jobs.length === 0 && (
            <div style={styles.emptyState}>No jobs found. Try broadening your search terms.</div>
          )}

          <div style={styles.jobGrid}>
            {jobs.map((job, index) => (
              <div key={job.id || index} style={styles.jobCard}>
                <div style={styles.cardTop}>
                  <h2 style={styles.jobTitleHighlight}>{job.title}</h2>
                  <span style={styles.typeBadge}>{job.jobType || 'Full-time'}</span>
                </div>
                
                <div style={styles.metaInfo}>
                  <div style={styles.metaItem}>
                    <span style={styles.icon}>🏢</span> <strong>{job.company}</strong>
                  </div>
                  <div style={styles.metaItem}>
                    <span style={styles.icon}>📍</span> {job.location}
                  </div>
                  <div>
                    <span style={styles.icon}>📝</span> {job.description}
                  </div>

                </div>

                <div style={styles.cardAction}>
                  <span style={styles.sourceText}>via {job.source}</span>
                  <a 
                    href={job.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.vibrantApplyBtn}
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

// Enhanced Styles
const styles = {
  container: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    paddingBottom: '50px',
    color: '#1e293b',
    lineHeight: '1.5',
  },
  maxContainer: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '0 20px',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '40px 0',
    borderBottom: '1px solid #e2e8f0',
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '2.2rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    margin: '8px 0 0 0',
    color: '#64748b',
    fontSize: '1.1rem',
  },
  searchCard: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    marginBottom: '40px',
  },
  searchForm: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  inputGroup: {
    flex: '1',
    minWidth: '250px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  searchButton: {
    padding: '12px 28px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    height: '48px',
    transition: 'background 0.2s',
    width: 'auto',
  },
  jobGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.2s ease',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    gap: '12px',
  },
  jobTitleHighlight: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: '700',
    color: '#1e40af',
    lineHeight: '1.2',
  },
  typeBadge: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '6px 12px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
  },
  metaInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '24px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '1rem',
    color: '#475569',
  },
  icon: {
    marginRight: '10px',
    fontSize: '1.1rem',
  },
  cardAction: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #f1f5f9',
  },
  sourceText: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontWeight: '500',
  },
  vibrantApplyBtn: {
    textDecoration: 'none',
    backgroundColor: '#059669',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '700',
    boxShadow: '0 4px 14px 0 rgba(5, 150, 105, 0.39)',
    transition: 'all 0.2s ease',
  },
  loader: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '1.1rem',
    color: '#2563eb',
    fontWeight: '500',
  },
  errorMessage: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '16px',
    borderRadius: '8px',
    textAlign: 'center',
    border: '1px solid #fee2e2',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
    fontSize: '1.1rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
  }
};

export default App;