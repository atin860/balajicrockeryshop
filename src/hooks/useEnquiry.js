import { useContext } from 'react';
import { EnquiryContext } from '../context/EnquiryContext';

/** Open the WhatsApp enquiry form: const { openEnquiry } = useEnquiry(); */
export default function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry() must be used inside <EnquiryProvider>.');
  return ctx;
}
