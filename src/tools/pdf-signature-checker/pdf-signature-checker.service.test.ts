import { describe, expect, it, vi } from 'vitest';
import { getCertificatesInfoFromPDF } from 'pdf-signature-reader';
import { readSignatureCertificates } from './pdf-signature-checker.service';

const { verifier } = vi.hoisted(() => ({ verifier: vi.fn(() => ({ verified: true, authenticity: true })) }));
vi.mock('pdf-signature-reader', () => ({
  default: verifier,
  getCertificatesInfoFromPDF: vi.fn(),
}));

describe('readSignatureCertificates', () => {
  it('preserves certificate information without trusting or calling the vulnerable verifier', () => {
    const pdf = new ArrayBuffer(8);
    const certificates = [{
      issuedBy: { commonName: 'Untrusted issuer', organizationName: 'Example' },
      issuedTo: { commonName: 'Claimed signer', organizationName: 'Example' },
      validityPeriod: { notBefore: '2026-01-01', notAfter: '2027-01-01' },
      pemCertificate: 'CERTIFICATE DATA',
    }];
    vi.mocked(getCertificatesInfoFromPDF).mockReturnValue([certificates]);

    expect(readSignatureCertificates(pdf)).toEqual([{
      verification: 'unverified',
      meta: { certs: certificates },
    }]);
    expect(getCertificatesInfoFromPDF).toHaveBeenCalledWith(pdf);
    expect(verifier).not.toHaveBeenCalled();
  });

  it('does not turn an unreadable PDF into a signature verdict', () => {
    vi.mocked(getCertificatesInfoFromPDF).mockImplementation(() => {
      throw new Error('Invalid PDF');
    });
    expect(() => readSignatureCertificates(new ArrayBuffer(0))).toThrow('Invalid PDF');
    expect(verifier).not.toHaveBeenCalled();
  });
});
