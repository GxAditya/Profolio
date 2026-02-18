import type { TemplateName } from "@/components/TemplateSelector";
import type { LinkedInProfile } from "@/types/linkedin";

export interface PublishedPortfolioRecord {
  id: string;
  data: LinkedInProfile;
  template_id: TemplateName | string;
}

interface PublishPayload {
  data: LinkedInProfile;
  templateId: TemplateName;
}

const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  return { url: url.replace(/\/+$/, ""), anonKey };
};

const getRequestErrorMessage = async (response: Response): Promise<string> => {
  try {
    const body = await response.json();
    if (body && typeof body === "object" && "message" in body) {
      const message = String(body.message ?? "").trim();
      if (message) return message;
    }
  } catch {
    // Ignore JSON parse failures.
  }

  return `Request failed (${response.status})`;
};

export const publishPortfolio = async (
  payload: PublishPayload
): Promise<PublishedPortfolioRecord> => {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/portfolios`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      data: payload.data,
      template_id: payload.templateId,
    }),
  });

  if (!response.ok) {
    throw new Error(await getRequestErrorMessage(response));
  }

  const rows = (await response.json()) as PublishedPortfolioRecord[];
  const created = rows?.[0];
  if (!created?.id) {
    throw new Error("Portfolio was saved but no ID was returned.");
  }

  return created;
};

export const fetchPublishedPortfolio = async (
  id: string
): Promise<PublishedPortfolioRecord | null> => {
  const { url, anonKey } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/portfolios?select=id,data,template_id&id=eq.${encodeURIComponent(
      id
    )}&limit=1`,
    {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(await getRequestErrorMessage(response));
  }

  const rows = (await response.json()) as PublishedPortfolioRecord[];
  return rows?.[0] ?? null;
};
