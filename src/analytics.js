/**
 * Reports a completed enquiry to GA4 as a conversion.
 *
 * Until this existed, Key events sat at 0: the lead was safely in the
 * database, but nothing connected it back to the channel that produced it,
 * so there was no way to tell whether organic search was worth the effort.
 *
 * The tag is absent in dev, on localhost, and during prerendering, so every
 * call has to tolerate gtag being undefined rather than assume it is there.
 */
export const trackLead = (details = {}) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  // Deliberately no name, email, phone or message: GA4 forbids personal data,
  // and the enquiry itself already lives in the leads table.
  window.gtag('event', 'generate_lead', details);
};
