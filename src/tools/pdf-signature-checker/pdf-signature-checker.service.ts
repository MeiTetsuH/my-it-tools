import { getCertificatesInfoFromPDF } from 'pdf-signature-reader';
import type { SignatureInfo } from './pdf-signature-checker.types';

// Do not call the vulnerable verifier until GHSA-86w9-cpqp-85rv is fixed.
export function readSignatureCertificates(pdf: ArrayBuffer): SignatureInfo[] {
  return getCertificatesInfoFromPDF(pdf).map(certs => ({
    verification: 'unverified',
    meta: { certs },
  }));
}
