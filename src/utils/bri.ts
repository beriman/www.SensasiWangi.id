export interface VirtualAccount {
  virtualAccount: string;
  expiredDate: string;
  raw: any;
}

export interface QrisResponse {
  qrString: string;
  raw: any;
}

const BASE_URL = process.env.BRI_BASE_URL || "https://sandbox.partner.api.bri.co.id";
const CLIENT_ID = process.env.BRI_CLIENT_ID || "";
const CLIENT_SECRET = process.env.BRI_CLIENT_SECRET || "";
const INSTITUTION_CODE = process.env.BRI_INSTITUTION_CODE || "";
const BRIVA_NO = process.env.BRI_BRIVA_NO || "";

let cachedToken: { token: string; expiry: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiry > Date.now()) return cachedToken.token;

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);

  const res = await fetch(`${BASE_URL}/oauth/client_credential`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch BRI token: ${res.status} ${text}`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: string };
  const expiry = Date.now() + parseInt(data.expires_in) * 1000 - 60 * 1000;
  cachedToken = { token: data.access_token, expiry };
  return data.access_token;
}

export async function createVirtualAccount(
  orderId: string,
  amount: number,
  name: string,
): Promise<VirtualAccount> {
  const token = await getAccessToken();
  const expiredDate = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const body = {
    institutionCode: INSTITUTION_CODE,
    brivaNo: BRIVA_NO,
    custCode: orderId,
    nama: name.substring(0, 20),
    amount: amount.toString(),
    keterangan: `Order ${orderId}`,
    expiredDate,
  };

  const res = await fetch(`${BASE_URL}/v1/briva`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.json();
  if (!res.ok) {
    throw new Error(`BRI VA error: ${res.status} ${JSON.stringify(raw)}`);
  }

  return {
    virtualAccount: `${BRIVA_NO}${orderId}`,
    expiredDate,
    raw,
  };
}

export async function createQris(
  orderId: string,
  amount: number,
): Promise<QrisResponse> {
  const token = await getAccessToken();
  const body = {
    institutionCode: INSTITUTION_CODE,
    brivaNo: BRIVA_NO,
    trxId: orderId,
    amount: amount.toString(),
    additionalInfo: `Order ${orderId}`,
  };

  const res = await fetch(`${BASE_URL}/v1/brimo/qris`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const raw = await res.json();
  if (!res.ok) {
    throw new Error(`BRI QRIS error: ${res.status} ${JSON.stringify(raw)}`);
  }

  return { qrString: raw?.data?.qrisContent ?? "", raw };
}
