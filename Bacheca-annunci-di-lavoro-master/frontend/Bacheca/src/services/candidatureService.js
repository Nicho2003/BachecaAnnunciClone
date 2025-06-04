/**
 * @file candidatureService.js
 * @description Service functions for managing job applications (candidature).
 * Interacts with the backend API for fetching and submitting applications.
 */
import axios from 'axios';

const API_BASE_URL = '/api'; // Using Vite proxy for /api calls

/**
 * Fetches all job applications for a specific announcement.
 * @async
 * @param {string} annuncioId - The ID of the announcement for which to fetch applications.
 * @param {string} token - The JWT token for authorization (company user).
 * @returns {Promise<Array<object>>} A promise that resolves to an array of application objects.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getCandidatureForAnnuncio = async (annuncioId, token) => {
  console.log(`Fetching candidatures for annuncioId: ${annuncioId}`, 'Token present:', !!token);
  // TODO: Replace placeholder with actual API call
  try {
    // Example of actual implementation (when uncommented, this try/catch is useful):
    // const response = await axios.get(`${API_BASE_URL}/candidature?annuncioId=${annuncioId}`, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // return response.data;

    // Placeholder implementation with potential failure:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (annuncioId === 'failCandidatureFetch') {
          console.warn('Mock getCandidatureForAnnuncio forcing failure for ID:', annuncioId);
          reject({ message: 'Mock server error: Failed to fetch candidatures for this announcement.' });
        } else if (annuncioId === 'mockId1' || annuncioId.startsWith('mock-')) {
          resolve([
            { _id: 'cand1', candidato: { nome: 'Mario Rossi', email: 'mario@email.com' }, messaggio: 'Sono interessato.', dataCandidatura: new Date().toISOString() },
            { _id: 'cand2', candidato: { nome: 'Luisa Verdi', email: 'luisa@email.com' }, messaggio: 'Ottimo annuncio!', dataCandidatura: new Date().toISOString() },
          ]);
        } else if (annuncioId === 'noAppsAnnc') {
            resolve([]);
        } else {
          resolve([
            { _id: 'candGen1', candidato: { nome: 'Utente Generico Debug', email: 'genDebugger@example.com' }, messaggio: 'Messaggio generico per test.', dataCandidatura: new Date().toISOString() }
          ]);
        }
      }, 500);
    });
  } catch (error) { // This catch is more for network errors if axios call was direct
    console.error('Network or setup error fetching candidatures:', error.message);
    throw new Error('Network or setup error: Failed to fetch candidatures');
  }
};

/**
 * Submits a new job application for an announcement.
 * @async
 * @param {object} candidaturaData - The data for the new application.
 * @param {string} candidaturaData.annuncioId - The ID of the announcement to apply for.
 * @param {string} [candidaturaData.userId] - The ID of the user applying (may be inferred from token by backend).
 * @param {string} [candidaturaData.messaggio] - An optional cover letter message.
 * @param {string} token - The JWT token for authorization (candidate user).
 * @returns {Promise<object>} A promise that resolves to a success message or the created application object.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const submitCandidatura = async (candidaturaData, token) => {
  console.log('Submitting candidatura:', candidaturaData, 'Token present:', !!token);
  // TODO: Replace placeholder with actual API call
  try {
    // Example of actual implementation (when uncommented, this try/catch is useful):
    // const response = await axios.post(`${API_BASE_URL}/candidature`, candidaturaData, {
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // return response.data;

    // Placeholder implementation with potential failure:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!candidaturaData.annuncioId) {
          console.error('Mock submitCandidatura failed: annuncioId missing');
          reject({ message: 'Errore: annuncioId mancante nella richiesta. (mock)' });
        } else if (candidaturaData.annuncioId === 'failSubmit') {
            console.warn('Mock submitCandidatura forcing failure for annuncioId:', candidaturaData.annuncioId);
            reject({ message: 'Mock server error: Impossibile inviare la candidatura per questo annuncio.'});
        }else {
          console.log('Mock submitCandidatura success for annuncioId:', candidaturaData.annuncioId);
          resolve({ message: 'Candidatura inviata con successo! (mock)' });
        }
      }, 500);
    });
  } catch (error) { // This catch is more for network errors if axios call was direct
    console.error('Network or setup error submitting candidatura:', error.message);
    throw new Error('Network or setup error: Failed to submit candidatura');
  }
};
