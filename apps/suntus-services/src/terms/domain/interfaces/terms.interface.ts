export interface TermsAcceptanceStatus {
  hasAccepted: boolean;
  currentVersion: string | null;
  acceptedVersion?: string;
  needsAcceptance: boolean;
}

export interface AcceptTermsDto {
  termsId: string;
}

