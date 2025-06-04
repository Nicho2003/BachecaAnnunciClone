/**
 * @file DashboardCandidatoPage.jsx
 * @description Page for candidate users to view available job announcements and apply.
 * Displays a list of all job announcements and provides a button to submit an application.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAnnunci } from '../services/annunciService';
import { submitCandidatura } from '../services/candidatureService';
import JobCard from '../components/JobCard';
import LoadingIndicator from '../components/LoadingIndicator'; // Import LoadingIndicator
import AlertMessage from '../components/AlertMessage'; // Import AlertMessage

/**
 * Renders the candidate dashboard.
 * Fetches and displays all available job announcements.
 * Allows candidates to apply for jobs.
 * @returns {JSX.Element} The DashboardCandidatoPage component.
 */
export default function DashboardCandidatoPage() {
  /** @state {Array<object>} annunci - List of all available job announcements. */
  const [annunci, setAnnunci] = useState([]);
  /** @state {boolean} loading - True if announcements are being fetched. */
  const [loading, setLoading] = useState(true);
  /** @state {null|string} error - Error message if fetching announcements fails. */
  const [error, setError] = useState(null);

  const { user, token, loading: authLoading } = useAuth();

  // State for application submission process
  /** @state {boolean} isApplying - True if an application submission is currently in progress. */
  const [isApplying, setIsApplying] = useState(false);
  /** @state {string} applicationMessage - Success message after submitting an application. */
  const [applicationMessage, setApplicationMessage] = useState('');
  /** @state {string} applicationError - Error message if application submission fails. */
  const [applicationError, setApplicationError] = useState('');
  // const [applyingAnnuncioId, setApplyingAnnuncioId] = useState(null); // Optional: For per-button loading state

  /**
   * Fetches all job announcements when the component mounts or authLoading status changes.
   */
  useEffect(() => {
    if (authLoading) {
      return; // Wait for authentication context to be ready
    }

    const fetchAnnunci = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAnnunci();
        setAnnunci(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("DashboardCandidatoPage fetch error:", err);
        setError(err.message || 'Failed to fetch job announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnunci();
  }, [authLoading]);

  /**
   * Handles the click event for applying to a job.
   * Prompts for confirmation and calls the `submitCandidatura` service.
   * @param {string} annuncioId - The ID of the announcement to apply for.
   * @async
   */
  const handleApplyClick = async (annuncioId) => {
    if (!token || !user) {
      setApplicationError("Devi essere loggato per candidarti.");
      alert("Devi essere loggato per candidarti."); // User feedback
      return;
    }
    if (!window.confirm("Confermi di voler inviare la tua candidatura per questo annuncio?")) return;

    setIsApplying(true);
    setApplicationMessage('');
    setApplicationError('');
    // if (setApplyingAnnuncioId) setApplyingAnnuncioId(annuncioId); // For per-button loading

    try {
      const candidaturaData = {
        annuncioId: annuncioId,
        userId: user._id, // Candidate's user ID
        // TODO: Add a field for a cover letter message if desired, e.g., from a modal form.
      };
      // TODO: Replace with actual API call (currently uses mock in service)
      const response = await submitCandidatura(candidaturaData, token);
      setApplicationMessage(response.message || "Candidatura inviata con successo!");
      alert(response.message || "Candidatura inviata con successo!"); // User feedback
      // TODO: Optionally, disable button for this annuncioId or change its text to "Candidatura Inviata"
    } catch (err) {
      console.error("Application submission error:", err);
      setApplicationError(err.message || "Errore durante l'invio della candidatura.");
      alert(err.message || "Errore durante l'invio della candidatura."); // User feedback
    } finally {
      setIsApplying(false);
      // if (setApplyingAnnuncioId) setApplyingAnnuncioId(null); // For per-button loading
    }
  };

  // Display loading message if either authentication or announcement data is loading
  if (authLoading || loading) {
    return <LoadingIndicator text="Caricamento annunci..." />;
  }

  // Display error message if fetching announcements failed
  if (error) {
    return <div className="container py-4"><AlertMessage type="danger" message={`Errore nel caricamento annunci: ${error}`} className="mx-auto" style={{ maxWidth: '600px' }}/></div>;
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Annunci Disponibili</h1>

      {/* Display messages related to application submission */}
      {applicationMessage && <AlertMessage type="success" message={applicationMessage} />}
      {applicationError && <AlertMessage type="danger" message={applicationError} />}

      {annunci.length === 0 && !error ? ( // Show message if no announcements and no error occurred
        <p className="text-center">Al momento non ci sono annunci disponibili.</p>
      ) : (
        <div className="row">
          {annunci.map(annuncio => (
            <div className="col-md-6 col-lg-4 mb-4" key={annuncio._id || annuncio.id || Math.random()}>
              <JobCard
                annuncio={annuncio}
                actions={
                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => handleApplyClick(annuncio._id || annuncio.id)}
                    disabled={isApplying} // Disable button globally during any application process
                    // Example for per-button state: disabled={applyingAnnuncioId === (annuncio._id || annuncio.id)}
                  >
                    {isApplying ? 'Invio in corso...' : 'Invia Candidatura'}
                    {/* Example for per-button state: {applyingAnnuncioId === (annuncio._id || annuncio.id) ? 'Invio...' : 'Invia Candidatura'} */}
                  </button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
