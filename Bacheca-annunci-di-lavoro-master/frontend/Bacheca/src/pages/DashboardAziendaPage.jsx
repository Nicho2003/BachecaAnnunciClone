/**
 * @file DashboardAziendaPage.jsx
 * @description Page for company users to view and manage their job announcements.
 * Displays a list of announcements published by the company, allows deleting them,
 * and viewing applications received for each announcement in a modal.
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getAnnunci, deleteAnnuncio } from '../services/annunciService';
import { getCandidatureForAnnuncio } from '../services/candidatureService';
import JobCard from '../components/JobCard';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../components/LoadingIndicator'; // Import LoadingIndicator
import AlertMessage from '../components/AlertMessage'; // Import AlertMessage

/**
 * Renders the company dashboard.
 * Fetches and displays announcements created by the logged-in company user.
 * Provides actions to view applications and delete announcements.
 * @returns {JSX.Element} The DashboardAziendaPage component.
 */
export default function DashboardAziendaPage() {
  const { user, token, loading: authLoading } = useAuth();

  /** @state {Array<object>} myAnnunci - List of announcements published by the company. */
  const [myAnnunci, setMyAnnunci] = useState([]);
  /** @state {boolean} loading - True if company's announcements are being fetched. */
  const [loading, setLoading] = useState(true);
  /** @state {null|string} error - Error message if fetching company's announcements fails. */
  const [error, setError] = useState(null);

  // State for Candidature Modal
  /** @state {null|object} selectedAnnuncioForCandidature - The announcement whose applications are being viewed. */
  const [selectedAnnuncioForCandidature, setSelectedAnnuncioForCandidature] = useState(null);
  /** @state {Array<object>} candidature - List of applications for the selected announcement. */
  const [candidature, setCandidature] = useState([]);
  /** @state {boolean} loadingCandidature - True if applications are being fetched for the selected announcement. */
  const [loadingCandidature, setLoadingCandidature] = useState(false);
  /** @state {null|string} errorCandidature - Error message if fetching applications fails. */
  const [errorCandidature, setErrorCandidature] = useState(null);
  /** @state {boolean} showCandidatureModal - Controls the visibility of the applications modal. */
  const [showCandidatureModal, setShowCandidatureModal] = useState(false);

  /**
   * Fetches announcements potentially created by the current company user.
   * This effect runs when the user, token, or authLoading state changes.
   * // TODO: Replace client-side filtering with a dedicated API endpoint like getMyAnnunci(userId, token).
   * Current filtering logic is a placeholder and depends on specific structures of user and annuncio objects.
   */
  useEffect(() => {
    if (authLoading) {
      return; // Wait for authentication context to be ready
    }
    if (!user || !token) {
      setError("Devi essere loggato come azienda per visualizzare questa pagina.");
      setLoading(false);
      return;
    }

    const fetchMyAnnunci = async () => {
      setLoading(true);
      setError(null);
      try {
        const allAnnunci = await getAnnunci(); // Fetches all announcements

        // Placeholder filtering logic:
        const filteredAnnunci = allAnnunci.filter(ann => {
            if (!ann || !user || !user._id) return false;
            if (ann.userId === user._id) return true; // Matches if annuncio has a direct userId field
            if (ann.azienda && typeof ann.azienda === 'object' && ann.azienda._id === user._id) return true; // Matches if azienda object's _id matches
            if (typeof ann.azienda === 'string' && ann.azienda.toLowerCase() === (user.name || '').toLowerCase()) return true; // Fallback by name
            if (user.companyId && ann.companyId === user.companyId) return true; // If user object has a specific companyId
            return false;
        });
        setMyAnnunci(filteredAnnunci);
      } catch (err) {
        console.error("DashboardAziendaPage fetch error:", err);
        setError(err.message || 'Failed to fetch your announcements.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyAnnunci();
  }, [user, token, authLoading]);

  /**
   * Handles viewing applications for a specific announcement.
   * Sets state to display the modal and fetches applications.
   * @param {object} annuncio - The announcement object for which to view applications.
   * @async
   */
  const handleViewCandidature = async (annuncio) => {
    setSelectedAnnuncioForCandidature(annuncio);
    setShowCandidatureModal(true);
    setLoadingCandidature(true);
    setErrorCandidature(null);
    setCandidature([]);

    try {
      // TODO: Replace with actual API call (currently uses mock in service)
      const data = await getCandidatureForAnnuncio(annuncio._id, token);
      setCandidature(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching candidatures for annuncio:", annuncio._id, err);
      setErrorCandidature(err.message || 'Failed to load candidatures.');
    } finally {
      setLoadingCandidature(false);
    }
  };

  /**
   * Handles the removal of a job announcement.
   * Prompts for confirmation, calls the delete service, and updates the local state.
   * @param {string} annuncioId - The ID of the announcement to remove.
   * @async
   */
  const handleRemoveAnnuncio = async (annuncioId) => {
    if (!window.confirm("Sei sicuro di voler rimuovere questo annuncio?")) return;
    setError(null);
    try {
      // TODO: Replace with actual API call (currently uses mock in service)
      await deleteAnnuncio(annuncioId, token);
      setMyAnnunci(prevAnnunci => prevAnnunci.filter(a => a._id !== annuncioId));
      alert("Annuncio rimosso con successo (mock)!"); // User feedback
    } catch (err) {
      console.error("Failed to delete annuncio:", err);
      setError(err.message || "Errore durante la rimozione dell'annuncio.");
    }
  };

  // Display loading message if main page data or auth state is loading
  if (loading || authLoading) {
    return <LoadingIndicator text="Caricamento dashboard..." />;
  }

  // Display warning if user is not available after loading attempt (e.g. not logged in, direct navigation)
  if (!user) {
    return <div className="container py-4"><AlertMessage type="warning" message="Effettua il login per visualizzare la tua dashboard." className="mx-auto" style={{ maxWidth: '600px' }} /></div>;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard Azienda</h1>
        <Link to="/annunci/nuovo" className="btn btn-primary">Pubblica Nuovo Annuncio</Link>
      </div>

      <h2 className="mb-3">I Tuoi Annunci Pubblicati</h2>
      {error && <AlertMessage type="danger" message={`Errore nel caricamento degli annunci: ${error}`} />}

      {!error && myAnnunci.length === 0 && (
        <p className="text-center">Non hai ancora pubblicato annunci.</p>
      )}

      <div className="row">
        {myAnnunci.map(annuncio => (
          <div className="col-md-6 col-lg-4 mb-4" key={annuncio._id || annuncio.id}>
            <JobCard
              annuncio={annuncio}
              actions={
                <div className="d-flex justify-content-between"> {/* Using flex for button alignment */}
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => handleViewCandidature(annuncio)}
                  >
                    Candidature
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemoveAnnuncio(annuncio._id)}
                  >
                    Rimuovi
                  </button>
                </div>
              }
            />
          </div>
        ))}
      </div>

      {/* Modal for Candidature */}
      {showCandidatureModal && selectedAnnuncioForCandidature && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Candidature per: {selectedAnnuncioForCandidature.titolo}</h5>
                <button type="button" className="btn-close" onClick={() => setShowCandidatureModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {loadingCandidature && <LoadingIndicator text="Caricamento candidature..." />}
                {errorCandidature && <AlertMessage type="danger" message={errorCandidature} />}
                {!loadingCandidature && !errorCandidature && candidature.length === 0 && (
                  <p>Nessuna candidatura ricevuta per questo annuncio.</p>
                )}
                {!loadingCandidature && !errorCandidature && candidature.length > 0 && (
                  <ul className="list-group">
                    {candidature.map(cand => (
                      <li className="list-group-item" key={cand._id}>
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{cand.candidato?.nome || 'Nome non disponibile'}</h6>
                          <small>{new Date(cand.dataCandidatura).toLocaleDateString()}</small>
                        </div>
                        <p className="mb-1"><small>Email: {cand.candidato?.email || 'Email non disponibile'}</small></p>
                        {cand.messaggio && <p className="mb-0"><em>"{cand.messaggio}"</em></p>}
                        {/* TODO: Add link to CV if available */}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCandidatureModal(false)}>Chiudi</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
