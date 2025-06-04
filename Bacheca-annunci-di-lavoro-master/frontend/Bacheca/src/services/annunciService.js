/**
 * @file annunciService.js
 * @description Service functions for managing job announcements (annunci).
 * Interacts with the backend API for fetching, creating, and deleting announcements.
 */
import axios from 'axios';

const API_BASE_URL = '/api'; // Using Vite proxy for /api calls

/**
 * Fetches all job announcements.
 * @async
 * @returns {Promise<Array<object>>} A promise that resolves to an array of announcement objects.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const getAnnunci = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/annunci`);
    return response.data; // Assuming backend returns an array of announcements
  } catch (error) {
    console.error('Error fetching announcements:', error.response?.data || error.message);
    // Rethrow a more specific error or the error data from backend if available
    throw error.response?.data || new Error('Failed to fetch announcements');
  }
};

/**
 * Creates a new job announcement.
 * @async
 * @param {object} annuncioData - The data for the new announcement.
 * @param {string} token - The JWT token for authorization.
 * @returns {Promise<object>} A promise that resolves to the created announcement object (or a success message).
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const createAnnuncio = async (annuncioData, token) => {
  console.log('Attempting to create annuncio:', annuncioData, 'with token:', token ? 'Present' : 'Absent');
  // TODO: Replace placeholder with actual API call
  try {
    // Example of actual implementation (when uncommented, this try/catch is useful):
    // const response = await axios.post(`${API_BASE_URL}/annunci`, annuncioData, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // return response.data;

    // Placeholder implementation with potential failure:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (annuncioData.titolo && annuncioData.titolo.toLowerCase().includes('fail')) {
          console.warn('Mock createAnnuncio forcing failure for:', annuncioData.titolo);
          reject({ message: 'Mock server error: Failed to create announcement due to "fail" in title.' });
        } else {
          console.log('Mock createAnnuncio success');
          resolve({
            message: 'Announcement created successfully (mock)',
            data: { ...annuncioData, _id: `mock-${Date.now()}`, createdAt: new Date().toISOString() }
          });
        }
      }, 500);
    });
  } catch (error) { // This catch is more for network errors if axios call was direct
    console.error('Network or setup error creating announcement:', error.message);
    throw new Error('Network or setup error: Failed to create announcement');
  }
};

/**
 * Deletes a job announcement by its ID.
 * @async
 * @param {string} annuncioId - The ID of the announcement to delete.
 * @param {string} token - The JWT token for authorization.
 * @returns {Promise<object>} A promise that resolves to a success message or relevant data from backend.
 * @throws {Error} If the request fails or the backend returns an error.
 */
export const deleteAnnuncio = async (annuncioId, token) => {
  console.log('Attempting to delete annuncio:', annuncioId, 'with token:', token ? 'Present' : 'Absent');
  // TODO: Replace placeholder with actual API call
  try {
    // Example of actual implementation (when uncommented, this try/catch is useful):
    // const response = await axios.delete(`${API_BASE_URL}/annunci/${annuncioId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    // return response.data;

    // Placeholder implementation with potential failure:
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (annuncioId === 'failDelete') {
          console.warn('Mock deleteAnnuncio forcing failure for ID:', annuncioId);
          reject({ message: 'Mock server error: This announcement cannot be deleted.' });
        } else {
          console.log('Mock deleteAnnuncio success for ID:', annuncioId);
          resolve({ message: 'Announcement deleted successfully (mock)' });
        }
      }, 500);
    });
  } catch (error) { // This catch is more for network errors if axios call was direct
    console.error('Network or setup error deleting announcement:', error.message);
    throw new Error('Network or setup error: Failed to delete announcement');
  }
};
