export type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string | null;
  phone: string;
  confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  identities: Array<{
    id: string;
    user_id: string;
    identity_data: Record<string, unknown>;
    provider: string;
    last_sign_in_at: string | null;
    created_at: string;
    updated_at: string;
  }>;
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
};
