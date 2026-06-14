/** Row shape for public.profiles (email/password customers) */
export type Profile = {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  default_address: string | null;
  has_password: boolean;
  created_at: string;
  updated_at: string;
};
