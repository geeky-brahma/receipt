import { ReceiptRecord } from '../types/receipt';

const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL ||
  'https://script.google.com/macros/s/AKfycbxcuJwbW0tYVUMt6on90oaQbU3KBKfqnnBkGraZkrndotHSxMQq0pVEdwwCkgVwHqHe/exec';

interface GoogleSheetsResponse {
  records?: ReceiptRecord[];
  message?: string;
}

const request = async (payload?: object): Promise<GoogleSheetsResponse> => {
  const response = await fetch(GOOGLE_SHEETS_URL, {
    method: payload ? 'POST' : 'GET',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: payload ? JSON.stringify(payload) : undefined
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error(
      'Google Apps Script denied access. Deploy the web app with "Who has access" set to "Anyone".'
    );
  }
  if (!response.ok) {
    throw new Error(`Google Sheets request failed (${response.status})`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      'Google Apps Script returned a non-JSON response. Check that the URL ends with /exec and the deployment is public.'
    );
  }

  const result = (await response.json()) as GoogleSheetsResponse;
  if (result.message && !result.records && result.message !== 'OK') {
    throw new Error(result.message);
  }
  return result;
};

export const receiptApi = {
  isConfigured: Boolean(GOOGLE_SHEETS_URL),
  list: async () => (await request()).records || [],
  save: async (record: ReceiptRecord) => {
    await request({ action: 'save', record });
  },
  remove: async (id: string) => {
    await request({ action: 'delete', id });
  },
  clear: async () => {
    await request({ action: 'clear' });
  }
};
