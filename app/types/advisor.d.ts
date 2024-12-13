export interface Advisor {
  id: string;
  name: string;
  identification: string;
  income: number;
  company: string;
  education: string;
  degree: string;
  level: string;
  years: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
}

export interface AdvisorFormValues {
  name: string;
  identification: string;
  income: string; // Keep as string for form input
  company: string;
  education: string;
  degree: string;
  level: string;
  years: string;
  email: string;
  phone: string;
  address: string;
}
