import { cloneSiteData, type SiteData } from "../site-data";

async function requestSiteData() {
  const response = await fetch("/api/site-data", {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to load site data.");
  }

  const body = (await response.json()) as { data?: SiteData };
  if (!body.data) {
    throw new Error("Site data response was empty.");
  }

  return cloneSiteData(body.data);
}

export async function getSiteData() {
  return await requestSiteData();
}

export async function persistSiteData(data: SiteData) {
  const response = await fetch("/api/site-data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ data: cloneSiteData(data) }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to persist site data.");
  }

  return { ok: true as const };
}
