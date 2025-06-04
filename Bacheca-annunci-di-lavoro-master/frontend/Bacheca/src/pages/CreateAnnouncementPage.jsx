/**
 * @file CreateAnnouncementPage.jsx
 * @description Page for company users to create new job announcements.
 * Contains a form to input announcement details and submit them.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createAnnuncio } from '../services/annunciService';
import LoadingIndicator from '../components/LoadingIndicator'; // Import LoadingIndicator
import AlertMessage from '../components/AlertMessage'; // Import AlertMessage

/**
 * Renders a form for creating new job announcements.
 * Handles form input, submission, loading states, and error display.
 * Navigates to the company dashboard on successful submission.
 * @returns {JSX.Element} The CreateAnnouncementPage component.
 */
export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const { token, user, loading: authLoading } = useAuth();

  /** @state {object} formData - Stores the current values of the form fields. */
  const [formData, setFormData] = useState({
    titolo: '',
    descrizione: '',
    localita: '',
    retribuzione: '',
    tipoContratto: 'full-time', // Default value
    // TODO: Add other fields as necessary, e.g., requisiti, benefits etc.
  });
  /** @state {boolean} loading - True if the form submission is in progress. */
  const [loading, setLoading] = useState(false);
  /** @state {null|string} error - Stores error messages related to form submission. */
  const [error, setError] = useState(null);

  /**
   * Handles changes to form input fields.
   * Updates the corresponding field in the `formData` state.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e - The change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the form submission for creating a new announcement.
   * Gathers form data, calls the `createAnnuncio` service, and handles success or error.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @async
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication token not found. Please login again.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const payload = { ...formData };
      // Add user/company information to the payload if required by the backend
      if (user && user._id) {
        payload.userId = user._id; // ID of the user posting (company representative)
      }
      if (user && user.name && user._id) {
         // Assuming 'azienda' on an announcement should be an object with name and ID
         payload.azienda = { nome: user.name, _id: user._id };
      } else if (user && user.name) {
         payload.azienda = { nome: user.name }; // Fallback if user._id is not available on user object
      }

      // TODO: Replace with actual API call (currently uses mock in service)
      await createAnnuncio(payload, token);
      alert('Annuncio pubblicato con successo! (Mock response)'); // User feedback
      navigate('/dashboard-azienda'); // Redirect after successful creation
    } catch (err) {
      console.error("Create announcement error:", err);
      setError(err.message || 'Failed to publish announcement.');
    } finally {
      setLoading(false);
    }
  };

  // Display loading message if AuthContext is still verifying user
  if (authLoading) {
    return <div className="container py-4"><LoadingIndicator text="Caricamento informazioni utente..." /></div>;
  }

  // Prevent access if user is not authenticated (e.g., directly navigated to page)
  if (!user) {
      return <div className="container py-4"><AlertMessage type="warning" message="Devi essere loggato come azienda per pubblicare un annuncio." /></div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">Pubblica Nuovo Annuncio</h2>
      {error && <AlertMessage type="danger" message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="titolo" className="form-label">Titolo Annuncio</label>
          <input type="text" className="form-control" id="titolo" name="titolo" value={formData.titolo} onChange={handleChange} required disabled={loading}/>
        </div>
        <div className="mb-3">
          <label htmlFor="descrizione" className="form-label">Descrizione</label>
          <textarea className="form-control" id="descrizione" name="descrizione" rows="5" value={formData.descrizione} onChange={handleChange} required disabled={loading}></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="localita" className="form-label">Località</label>
          <input type="text" className="form-control" id="localita" name="localita" value={formData.localita} onChange={handleChange} required disabled={loading}/>
        </div>
        <div className="mb-3">
          <label htmlFor="retribuzione" className="form-label">Retribuzione (es. RAL, range, N.A.)</label>
          <input type="text" className="form-control" id="retribuzione" name="retribuzione" value={formData.retribuzione} onChange={handleChange} disabled={loading}/>
        </div>
        <div className="mb-3">
          <label htmlFor="tipoContratto" className="form-label">Tipo di Contratto</label>
          <select className="form-select" id="tipoContratto" name="tipoContratto" value={formData.tipoContratto} onChange={handleChange} disabled={loading}>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="determinato">Tempo Determinato</option>
            <option value="indeterminato">Tempo Indeterminato</option>
            <option value="stage">Stage</option>
            <option value="collaborazione">Collaborazione (P.IVA)</option>
            <option value="da definire">Da Definire</option>
          </select>
        </div>
        {/* TODO: Add more fields as needed: requisiti, benefits etc. */}
        <button type="submit" className="btn btn-primary" disabled={loading || authLoading}>
          {loading ? 'Pubblicazione in corso...' : 'Pubblica Annuncio'}
        </button>
      </form>
    </div>
  );
}
