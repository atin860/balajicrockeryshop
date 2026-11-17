import { createContext, useCallback, useMemo, useState } from 'react';
import EnquiryModal from '../components/enquiry/EnquiryModal';

/**
 * EnquiryContext — every WhatsApp button on the site opens the same enquiry form.
 *
 *   const { openEnquiry } = useEnquiry();
 *   openEnquiry();                                              // general enquiry
 *   openEnquiry({ subject: 'Silver Pattal 12 inch – Golden Border design',
 *                 message: 'Please share the rate and availability…' });
 *
 * The form collects name, mobile and message, then opens WhatsApp with a
 * formatted message (see buildContactMessage in utils/whatsapp.js).
 */
export const EnquiryContext = createContext(null);

export function EnquiryProvider({ children }) {
  const [state, setState] = useState({ open: false, subject: '', message: '' });

  const openEnquiry = useCallback(({ subject = '', message = '' } = {}) => setState({ open: true, subject, message }), []);
  const closeEnquiry = useCallback(() => setState((s) => ({ ...s, open: false })), []);

  const value = useMemo(() => ({ openEnquiry, closeEnquiry }), [openEnquiry, closeEnquiry]);

  return (
    <EnquiryContext.Provider value={value}>
      {children}
      <EnquiryModal open={state.open} subject={state.subject} initialMessage={state.message} onClose={closeEnquiry} />
    </EnquiryContext.Provider>
  );
}
