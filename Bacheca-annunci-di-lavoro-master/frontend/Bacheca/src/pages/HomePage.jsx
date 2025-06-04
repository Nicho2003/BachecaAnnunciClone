/**
 * @file HomePage.jsx
 * @description The main landing page of the application.
 * Displays a list of all available job announcements.
 * This page is publicly accessible.
 */
import { useState, useEffect } from 'react';
import { getAnnunci } from '../services/annunciService';
import JobCard from '../components/JobCard';
import LoadingIndicator from '../components/LoadingIndicator'; // Import LoadingIndicator
import AlertMessage from '../components/AlertMessage'; // Import AlertMessage for error handling

/**
 * Renders the Home Page.
 * Fetches and displays all job announcements.
 * Handles loading and error states for the announcement fetching process.
 * @returns {JSX.Element} The HomePage component.
 */
export default function HomePage() {
  /** @state {Array<object>} annunci - List of job announcements to display. */
  const [annunci, setAnnunci] = useState([]);
  /** @state {boolean} loading - True if announcements are currently being fetched. */
  const [loading, setLoading] = useState(true);
  /** @state {null|string} error - Error message if fetching announcements fails. */
  const [error, setError] = useState(null);

  /**
   * Fetches job announcements when the component mounts.
   */
  useEffect(() => {
    const fetchAnnunci = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Replace with actual API call (currently uses mock in service if backend not running)
        const data = await getAnnunci();
        setAnnunci(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("HomePage fetch error:", err);
        setError(err.message || 'Failed to fetch job announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnunci();
  }, []);

  // Display loading message
  if (loading) {
    return <LoadingIndicator text="Caricamento annunci..." />;
  }

  // Display error message if fetching failed
  if (error) {
    // Using AlertMessage component here
    return <div className="container py-4"><AlertMessage type="danger" message={`Errore nel caricamento degli annunci: ${error}`} /></div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Job Announcements</h1>
      {annunci.length === 0 && !error ? ( // Show message if no announcements and no error
        <p className="text-center">No job announcements found at the moment.</p>
      ) : (
        <div className="row">
          {annunci.map(annuncio => (
            // Ensure annuncio has a unique key, typically from database (_id or id)
            // Fallback to Math.random() is not ideal for production but can prevent errors during dev with mock data
            <div className="col-md-6 col-lg-4 mb-4" key={annuncio._id || annuncio.id || Math.random()}>
              <JobCard annuncio={annuncio} />
              {/* Actions prop is not passed here, so JobCard will not render an action section */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
