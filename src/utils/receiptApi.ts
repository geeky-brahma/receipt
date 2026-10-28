import { ReceiptRecord } from '../types/receipt';

export const RECEIPT_OUTBOX_STORAGE_KEY = 'sansad_receipt_outbox';

const GOOGLE_SHEETS_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL ||
  'https://script.google.com/macros/s/AKfycbw7isDVvUjFbD59LB6BqdoVgmgjIsoGKrWsWdn0yzWLDBpLFZfFEMhWtQqXfCr45dIZ/exec';

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

const readOutbox = (): ReceiptRecord[] => {
  try {
    const saved = localStorage.getItem(RECEIPT_OUTBOX_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const writeOutbox = (records: ReceiptRecord[]) => {
  if (records.length === 0) {
    localStorage.removeItem(RECEIPT_OUTBOX_STORAGE_KEY);
  } else {
    localStorage.setItem(RECEIPT_OUTBOX_STORAGE_KEY, JSON.stringify(records));
  }
};

export const receiptApi = {
  isConfigured: Boolean(GOOGLE_SHEETS_URL),
  getPending: readOutbox,
  queueSave: (record: ReceiptRecord) => {
    const pending = readOutbox().filter((item) => item.id !== record.id);
    writeOutbox([record, ...pending]);
  },
  syncPending: async () => {
    const pending = readOutbox();
    for (const record of pending) {
      await request({ action: 'save', record });
      writeOutbox(readOutbox().filter((item) => item.id !== record.id));
    }
    return readOutbox().length;
  },
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
