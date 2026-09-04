export interface Environment {
  baseUrl: string;
  apiUrl: string;
  testEmail?: string;
  testPassword?: string;
}

function required(name: 'BASE_URL' | 'API_URL'): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value.replace(/\/$/, '');
}

export function environment(): Environment {
  return {
    baseUrl: required('BASE_URL'),
    apiUrl: required('API_URL'),
    testEmail: process.env.TEST_EMAIL,
    testPassword: process.env.TEST_PASSWORD,
  };
}
