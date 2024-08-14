const PROXYCURL_API_KEY = process.env.PROXYCURL_API_KEY;
export interface LinkedInProfile {
  accomplishment_projects: {
    description: string;
    ends_at: null;
    starts_at: {
      day: number;
      month: number;
      year: number;
    } | null;
    title: string;
    url: string;
  }[];
  activities: {
    activity_status: string;
    link: string;
    title: string;
  }[];
  background_cover_image_url: string;
  certifications: {
    authority: string;
    display_source: null;
    ends_at: null;
    license_number: null;
    name: string;
    starts_at: {
      day: number;
      month: number;
      year: number;
    } | null;
    url: null;
  }[];
  city: string;
  connections: number;
  country: string;
  country_full_name: string;
  education: {
    activities_and_societies: null;
    degree_name: string;
    description: null;
    ends_at: {
      day: number;
      month: number;
      year: number;
    } | null;
    field_of_study: string;
    grade: null;
    logo_url: string;
    school: string;
    school_linkedin_profile_url: string;
    starts_at: {
      day: number;
      month: number;
      year: number;
    } | null;
  }[];
  experiences: {
    company: string;
    company_linkedin_profile_url: string;
    description: string;
    ends_at: {
      day: number;
      month: number;
      year: number;
    } | null;
    location: null;
    logo_url: string;
    starts_at: {
      day: number;
      month: number;
      year: number;
    } | null;
    title: string;
  }[];
  first_name: string;
  follower_count: null;
  full_name: string;
  headline: string;
  languages: string[];
  last_name: string;
  occupation: string;
  profile_pic_url: string;
  public_identifier: string;
  recommendations: string[];
  similarly_named_profiles: {
    link: string;
    location: string;
    name: string;
    summary: string;
  }[];
  state: string;
  summary: string;
}

export async function fetchLinkedInProfile(
  linkedinUrl: string,
): Promise<LinkedInProfile> {
  const params: Record<string, string> = {
    linkedin_profile_url: linkedinUrl,
    extra: "include",
    inferred_salary: "include",
    skills: "include",
    use_cache: "if-recent",
    fallback_to_cache: "on-error",
  };

  const url = new URL("https://nubela.co/proxycurl/api/v2/linkedin");
  Object.keys(params).forEach((key) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    url.searchParams.append(key, params[key]!),
  );

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PROXYCURL_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = (await response.json()) as LinkedInProfile;

  return data;
}
