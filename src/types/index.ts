export interface Job {
  id: string;
  title: string;
  company: string;
  company_logo?: string;
  description: string;
  source_url: string;
  source_platform: 'Remotive' | 'Jobicy' | 'Arbeitnow' | 'Direct';
  location_tag: 'Worldwide' | 'EMEA' | 'Africa' | 'Global' | 'Anywhere';
  is_nigeria_eligible: boolean;
  hiring_email?: string;
  application_type: 'email' | 'url';
  salary_range: string;
  company_base_country?: string;
  company_timezone?: string;
  posted_at: string;
  tags: string[];
  embedding?: number[];
}

export interface CandidateProfile {
  id: string;
  email: string;
  full_name: string;
  current_title?: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  resume_filename?: string;
  resume_text: string;
  parsed_skills: string[];
  years_of_experience: number;
  seniority_level: 'junior' | 'mid' | 'senior' | 'lead';
  desired_roles: string[];
  summary: string;
  achievements: string[];
  health_score: number;
  health_feedback: string[];
  gmail_connected?: boolean;
  embedding?: number[];
  updated_at: string;
}

export interface ApplicationGuide {
  timezone_analysis: {
    company_timezone: string;
    wat_difference_hours: number;
    overlap_window: string;
    async_recommendation: string;
  };
  contractor_financial_setup: {
    w8ben_guidance: string;
    payment_options: Array<{
      provider: string;
      description: string;
      recommended_for: string;
    }>;
    invoicing_tip: string;
  };
  application_checklist: string[];
}

export interface JobMatch {
  id: string;
  job_id: string;
  job: Job;
  similarity_score: number; // 0 to 100
  match_reasoning: string;
  generated_cover_letter?: string;
  application_guide?: ApplicationGuide;
  status: 'new' | 'reviewed' | 'authorized_sent' | 'applied_manually' | 'archived';
  sent_at?: string;
  created_at: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  sentAt?: string;
}

export interface NigeriaSiteFilterAudit {
  geo_status: 'VERIFIED_DIRECT_ACCESS' | 'STRICT_VERIFICATION_REQUIRED' | 'GEO_FILTER_ALERT' | 'INVITE_OR_PROJECT_ONLY';
  geo_status_label: string;
  direct_ip_allowed: boolean;
  geo_block_risk: 'None' | 'Low' | 'Medium' | 'High';
  vpn_advisory: string;
  id_verification: string;
  phone_sms_verified: boolean;
  payout_readiness: string;
  filter_bypass_strategy: string;
  last_verified: string;
}

export interface AITrainingJob {
  id: string;
  title: string;
  platform: 'Outlier' | 'Alignerr' | 'Invisible Tech' | 'DataAnnotation' | 'Mindrift' | 'OneForma' | 'Mercor' | 'Remotasks';
  hourly_rate_usd: number;
  hourly_rate_display: string;
  domain: 'Coding RLHF' | 'Software Engineering' | 'LLM Evaluation' | 'Prompt Engineering' | 'STEM & Math' | 'Multimodal & Reasoning';
  description: string;
  requirements: string[];
  skills: string[];
  screening_type: 'Coding Assessment' | 'Reasoning Test' | 'Writing Sample' | 'Automated Benchmark';
  payout_frequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Instant';
  payout_methods: string[];
  application_url: string;
  is_nigeria_eligible: boolean;
  nigeria_applicant_tips: string[];
  flexibility: string;
  estimated_weekly_ngn: string;
  match_score?: number;
  filter_audit: NigeriaSiteFilterAudit;
}
