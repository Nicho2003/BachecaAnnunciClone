/**
 * @file JobCard.jsx
 * @description Component to display a single job announcement in a card format.
 * Uses Bootstrap card styling and provides an area for action buttons.
 */
import React from 'react'; // Imported React for clarity, though not strictly necessary for simple functional components

/**
 * Displays a single job announcement card.
 *
 * @param {object} props - The component's props.
 * @param {object} props.annuncio - The job announcement object.
 * @param {string} [props.annuncio.titolo] - The title of the job.
 * @param {object|string} [props.annuncio.azienda] - The company offering the job. Can be an object with a 'nome' property or a string.
 * @param {string} [props.annuncio.descrizione] - The description of the job.
 * @param {string} [props.annuncio.localita] - The location of the job.
 * @param {string} [props.annuncio.retribuzione] - The salary or compensation.
 * @param {string} [props.annuncio.tipoContratto] - The type of contract (e.g., full-time).
 * @param {React.ReactNode} [props.actions] - Optional React node(s) to be rendered as action buttons or links in the card footer.
 * @returns {JSX.Element|null} The JobCard component, or null if no announcement data is provided.
 */
export default function JobCard({ annuncio, actions }) {
  if (!annuncio) return null;

  // Destructure expected properties from annuncio for clarity
  const {
    titolo,
    azienda,
    descrizione,
    retribuzione,
    tipoContratto,
    localita
  } = annuncio;

  /**
   * Truncates the description if it's longer than 150 characters, adding an ellipsis.
   * @type {string}
   */
  const displayDescrizione = descrizione
    ? (descrizione.length > 150 ? descrizione.substring(0, 150) + '...' : descrizione)
    : 'Nessuna descrizione.';

  /**
   * Determines the company name to display. Handles cases where 'azienda' might be an object or a string.
   * @type {string}
   */
  const displayAzienda = azienda
    ? (typeof azienda === 'string' ? azienda : (azienda.nome || 'Azienda non specificata'))
    : 'Azienda non specificata';

  return (
    <div className="card mb-3 h-100"> {/* h-100 for consistent card height in a row */}
      <div className="card-body d-flex flex-column"> {/* flex-column for footer alignment */}
        <h5 className="card-title">{titolo || 'Titolo non disponibile'}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{displayAzienda}</h6>
        <p className="card-text flex-grow-1">{displayDescrizione}</p> {/* flex-grow-1 allows description to expand */}

        {/* Secondary information, displayed if available */}
        {localita && <p className="card-text"><small className="text-muted">Località: {localita}</small></p>}
        {retribuzione && <p className="card-text"><small className="text-muted">Retribuzione: {retribuzione}</small></p>}
        {tipoContratto && <p className="card-text"><small className="text-muted">Contratto: {tipoContratto}</small></p>}

        {/* Action buttons area */}
        {actions && (
          <div className="mt-auto pt-2"> {/* mt-auto pushes this to the bottom, pt-2 for spacing */}
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
