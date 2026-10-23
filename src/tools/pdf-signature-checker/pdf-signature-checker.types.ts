export interface SignatureInfo {
  verification: 'unverified'
  meta: {
    certs: {
      clientCertificate?: boolean
      issuedBy: {
        commonName: string
        organizationalUnitName?: string
        organizationName: string
        countryName?: string
        localityName?: string
        stateOrProvinceName?: string
      }
      issuedTo: {
        commonName: string
        serialNumber?: string
        organizationalUnitName?: string
        organizationName: string
        countryName?: string
        localityName?: string
        stateOrProvinceName?: string
      }
      validityPeriod: {
        notBefore: string
        notAfter: string
      }
      pemCertificate: string
    }[]
  }
}
