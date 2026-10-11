import { AITrainingJob, CandidateProfile, NigeriaSiteFilterAudit } from '../src/types/index.js';

export const AI_TRAINING_JOBS: AITrainingJob[] = [
  {
    id: 'ai-train-1',
    title: 'AI Coding Evaluator & Model Trainer (Python / TypeScript / Algorithms)',
    platform: 'Outlier',
    hourly_rate_usd: 35,
    hourly_rate_display: '$30 - $45 USD / hr',
    domain: 'Coding RLHF',
    description:
      'Train frontier LLMs by evaluating AI code generation, writing adversarial unit tests, debugging model hallucinations, and authoring reference code solutions in Python and TypeScript.',
    requirements: [
      'Strong proficiency in Python, TypeScript, or JavaScript',
      'Solid algorithmic reasoning and clean coding standards',
      'Ability to articulate step-by-step reasoning (Chain-of-Thought) in evaluation rubrics',
      'Dedicated computer with stable power and internet connection in Nigeria',
    ],
    skills: ['Python', 'TypeScript', 'JavaScript', 'Algorithms', 'Debugging', 'Code Review', 'Unit Testing'],
    screening_type: 'Coding Assessment',
    payout_frequency: 'Weekly',
    payout_methods: ['Geegpay', 'PayPal', 'Airtm', 'Bank Wire'],
    application_url: 'https://outlier.ai',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Payouts hit weekly every Tuesday/Wednesday. Connect your Geegpay USD Virtual Account to receive funds directly in USD.',
      'During the 40-minute initial screening, never use an AI tool to generate answers (instant automated disqualification).',
      'Explain your thought process extensively in the justifications—Outlier heavily weights depth of reasoning.',
    ],
    flexibility: '15 - 40 hrs/week (Set your own schedule)',
    estimated_weekly_ngn: '₦525,000 - ₦1,250,000 / week',
    filter_audit: {
      geo_status: 'VERIFIED_DIRECT_ACCESS',
      geo_status_label: '🟢 100% Direct Nigeria Signup (No Geo-Block)',
      direct_ip_allowed: true,
      geo_block_risk: 'None',
      vpn_advisory: 'STRICT PROHIBITION: Outlier/Scale AI fraud algorithms flag VPNs or residential proxies immediately, triggering permanent account deactivation. Always browse and test on your native Nigerian ISP (Starlink, MTN, Airtel, Spectranet).',
      id_verification: 'Persona IDV: Nigerian International Passport and NIN Slip (Digital QR) are accepted.',
      phone_sms_verified: true,
      payout_readiness: 'Geegpay USD Virtual Account ACH routing or PayPal. Payouts arrive weekly every Tuesday without withholding.',
      filter_bypass_strategy: 'Never use AI during initial screening—keystroke biometric tools flag copy-pasting. Ensure your registration legal name matches your NIN or Passport exactly.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-2',
    title: 'Core AI Coding Specialist & Model Evaluator',
    platform: 'DataAnnotation',
    hourly_rate_usd: 40,
    hourly_rate_display: '$25 - $40 USD / hr',
    domain: 'Software Engineering',
    description:
      'Compare competing model generations for complex engineering tasks. Write custom prompts that stress-test code logic, asynchronous patterns, and SQL queries.',
    requirements: [
      'Experience in software development (web, backend, or data engineering)',
      'Sharp eye for syntax flaws, performance bottlenecks, and security vulnerabilities',
      'High attention to detail when scoring against multi-page rubrics',
    ],
    skills: ['Python', 'SQL', 'React', 'Node.js', 'Git', 'Data Structures'],
    screening_type: 'Automated Benchmark',
    payout_frequency: 'Weekly',
    payout_methods: ['PayPal', 'Geegpay', 'Airtm'],
    application_url: 'https://www.dataannotation.tech',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Pass the Starter Assessment by writing meticulous feedback on which AI response is more accurate, harmless, and helpful.',
      'Payout is available to withdraw every 3 days once approved.',
      'Link your Nigerian PayPal account (or Geegpay Virtual USD Card) to receive USD payouts.',
    ],
    flexibility: 'Fully Flexible (No minimum hourly commitments)',
    estimated_weekly_ngn: '₦600,000 - ₦1,400,000 / week',
    filter_audit: {
      geo_status: 'GEO_FILTER_ALERT',
      geo_status_label: '⚠️ Geo-Filter Alert (Requires Direct Track / Project Link)',
      direct_ip_allowed: false,
      geo_block_risk: 'High',
      vpn_advisory: 'DO NOT USE VPN TO BYPASS: DataAnnotation shadowbans accounts if IP does not match identity registration. Use a clean Nigerian browser profile.',
      id_verification: 'SMS phone verification + PayPal account matching candidate legal name.',
      phone_sms_verified: false,
      payout_readiness: 'PayPal account (requires verified receiving privileges or linked Geegpay virtual card).',
      filter_bypass_strategy: 'DataAnnotation generic landing pages occasionally display "No open projects" to West African IPs. Apply when global coding open calls are announced or navigate via specific developer evaluation sub-paths. Ensure your PayPal name matches your signup email.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-3',
    title: 'Software Engineer LLM Evaluator (RLHF / Code Generation)',
    platform: 'Alignerr',
    hourly_rate_usd: 45,
    hourly_rate_display: '$35 - $60 USD / hr',
    domain: 'Coding RLHF',
    description:
      'Labelbox Alignerr network pairs high-caliber developers with leading AI research labs. Solve algorithmic challenges and evaluate frontier model outputs on complex logic.',
    requirements: [
      'Demonstrated expertise in at least two languages (Python, Go, Java, TypeScript, C++)',
      'Ability to pass TestGorilla algorithmic and technical benchmarks with score > 80%',
      'Strong analytical and critical evaluation skills',
    ],
    skills: ['Python', 'Go', 'TypeScript', 'Docker', 'System Design', 'Algorithms'],
    screening_type: 'Coding Assessment',
    payout_frequency: 'Bi-weekly',
    payout_methods: ['Geegpay', 'Deel', 'Direct USD Transfer'],
    application_url: 'https://www.alignerr.com',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Alignerr pays through Deel contractor platform, which supports direct bank deposits in Nigeria or USD contractor payout to Geegpay.',
      'Prepare for the TestGorilla coding test by reviewing core data structures and edge case analysis.',
      'High benchmark scores unlock access to $50+/hr specialized engineering projects.',
    ],
    flexibility: '10 - 30 hrs/week (Project-based)',
    estimated_weekly_ngn: '₦675,000 - ₦1,600,000 / week',
    filter_audit: {
      geo_status: 'STRICT_VERIFICATION_REQUIRED',
      geo_status_label: '🟡 Strict Benchmark (Pass TestGorilla > 80%)',
      direct_ip_allowed: true,
      geo_block_risk: 'Low',
      vpn_advisory: 'Strict anti-spoofing during TestGorilla test. Disable all VPNs, proxies, and browser extensions before beginning.',
      id_verification: 'Deel Contractor Verification: Nigerian International Passport and verified NIN are fully supported.',
      phone_sms_verified: true,
      payout_readiness: 'Deel Contractor Platform: Instant bank transfer directly to Nigerian GTBank, Zenith, Access, or Geegpay USD account.',
      filter_bypass_strategy: 'Alignerr operates strictly merit-based. Scoring above 80% on the TestGorilla algorithmic benchmark completely bypasses any geographic filtering. Keep your webcam active and avoid switching browser tabs.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-4',
    title: 'Advanced AI Training Operator & Workflow Specialist',
    platform: 'Invisible Tech',
    hourly_rate_usd: 22,
    hourly_rate_display: '$18 - $28 USD / hr',
    domain: 'Prompt Engineering',
    description:
      'Invisible Tech trains models for top AI labs including OpenAI and Anthropic. Work on structured prompts, agentic workflows, multi-step tool calls, and high-precision data synthesis.',
    requirements: [
      'High degree of technological literacy and fast typing speed',
      'Experience in technical writing, workflow automation, or programming',
      'Strong attention to nuance, prompt constraints, and safety guidelines',
      'High reliability in meeting weekly project milestones',
    ],
    skills: ['Prompt Engineering', 'Workflows', 'Technical Writing', 'Data Synthesis', 'Tool Use', 'Quality Assurance'],
    screening_type: 'Writing Sample',
    payout_frequency: 'Bi-weekly',
    payout_methods: ['Deel', 'Geegpay', 'Payoneer'],
    application_url: 'https://www.invisible.co/careers',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Invisible Tech has a large active contractor community across Nigeria.',
      'Highlight any past experience with LLMs, Airtable, Notion, or automation tools like Zapier or Python scripts.',
      'Payments processed reliably via Deel directly into your Nigerian bank account or USD wallet.',
    ],
    flexibility: '20 - 40 hrs/week (Consistent ongoing work)',
    estimated_weekly_ngn: '₦360,000 - ₦750,000 / week',
    filter_audit: {
      geo_status: 'VERIFIED_DIRECT_ACCESS',
      geo_status_label: '🟢 100% Direct Nigeria Signup (Open Applications)',
      direct_ip_allowed: true,
      geo_block_risk: 'None',
      vpn_advisory: 'No VPN needed. Site and career application portal are 100% accessible from Nigerian IPs.',
      id_verification: 'Standard contractor onboarding via Deel / BambooHR with Nigerian National ID or Passport.',
      phone_sms_verified: true,
      payout_readiness: 'Deel or Payoneer with direct Nigerian bank NGN or USD withdrawal.',
      filter_bypass_strategy: 'Highlight asynchronous communication and prompt engineering experience. Invisible Tech hires extensively in Nigeria and Africa.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-5',
    title: 'AI Reasoning & STEM Tutor / Model Evaluator',
    platform: 'Mindrift',
    hourly_rate_usd: 30,
    hourly_rate_display: '$25 - $38 USD / hr',
    domain: 'STEM & Math',
    description:
      'Review and critique complex reasoning trajectories in science, mathematics, and programming. Identify subtle logical fallacies in reasoning models and write golden reference solutions.',
    requirements: [
      'Degree or solid background in STEM (Computer Science, Math, Engineering, Physics)',
      'Impeccable analytical writing and clarity in step-by-step proofs',
      'Ability to follow intricate guidelines on model helpfulness and factuality',
    ],
    skills: ['Mathematics', 'Logic', 'Analytical Writing', 'Python', 'STEM', 'Critical Thinking'],
    screening_type: 'Reasoning Test',
    payout_frequency: 'Monthly',
    payout_methods: ['Bank Wire', 'Geegpay', 'Wise'],
    application_url: 'https://mindrift.ai',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Mindrift actively recruits freelance AI Writers and Tutors across Africa and EMEA.',
      'Take your time during the test tasks: thoroughness and citing sources are rewarded higher than raw speed.',
    ],
    flexibility: '15 - 30 hrs/week (Flexible pacing)',
    estimated_weekly_ngn: '₦450,000 - ₦950,000 / week',
    filter_audit: {
      geo_status: 'VERIFIED_DIRECT_ACCESS',
      geo_status_label: '🟢 Verified Direct Access for African Talent',
      direct_ip_allowed: true,
      geo_block_risk: 'None',
      vpn_advisory: 'Do not use VPN. Native connection required during interactive trial tasks.',
      id_verification: 'Veriff IDV: Accepts Nigerian Passport, Driver\'s License, and NIN.',
      phone_sms_verified: true,
      payout_readiness: 'Direct contractor bank wire and Geegpay supported.',
      filter_bypass_strategy: 'Ensure your writing samples adhere strictly to factuality rubrics. Mindrift specifically recruits African AI Writers and QA editors.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-6',
    title: 'Multimodal AI Evaluation & Localization Specialist',
    platform: 'OneForma',
    hourly_rate_usd: 24,
    hourly_rate_display: '$18 - $30 USD / hr',
    domain: 'Multimodal & Reasoning',
    description:
      'Evaluate frontier vision-language models on image understanding, chart interpretation, visual question answering, and audio/speech transcription.',
    requirements: [
      'Keen visual perception and ability to spot subtle image artifacts or OCR errors',
      'Flawless command of English and ability to review localized content',
      'Completion of OneForma onboarding certifications',
    ],
    skills: ['Vision AI', 'OCR', 'Audio Evaluation', 'Data Annotation', 'English Fluency', 'Quality Review'],
    screening_type: 'Automated Benchmark',
    payout_frequency: 'Monthly',
    payout_methods: ['Payoneer', 'Bank Wire', 'Geegpay'],
    application_url: 'https://www.oneforma.com',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Certifications on OneForma unlock higher-tier AI projects—complete the free certs in your dashboard first.',
      'Link your Payoneer account early to ensure immediate payment processing on monthly cycle.',
    ],
    flexibility: '10 - 25 hrs/week',
    estimated_weekly_ngn: '₦300,000 - ₦600,000 / week',
    filter_audit: {
      geo_status: 'STRICT_VERIFICATION_REQUIRED',
      geo_status_label: '🟡 Project Certifications Required',
      direct_ip_allowed: true,
      geo_block_risk: 'Low',
      vpn_advisory: 'Strictly prohibited. OneForma tracks IP location history; VPN leads to immediate project removal.',
      id_verification: 'Payoneer account verification + government ID.',
      phone_sms_verified: true,
      payout_readiness: 'Payoneer (direct link to Nigerian bank account) or Wire.',
      filter_bypass_strategy: 'Do not apply to US/EU exclusive tagged projects. Filter OneForma job board by "Worldwide" or "Africa" and pass the requisite language/AI test.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-7',
    title: 'Full-Stack Software AI Benchmarking Engineer',
    platform: 'Mercor',
    hourly_rate_usd: 50,
    hourly_rate_display: '$40 - $75 USD / hr',
    domain: 'Software Engineering',
    description:
      'Mercor connects vetted engineers with AI companies for high-touch model benchmarking, synthetic data generation, and specialized technical problem authoring.',
    requirements: [
      'Strong portfolio in full-stack web, distributed systems, or ML engineering',
      'Solid GitHub track record or competitive programming background',
      'Completion of Mercor 20-minute AI technical video interview',
    ],
    skills: ['React', 'Node.js', 'Python', 'Fullstack', 'System Design', 'Git', 'APIs'],
    screening_type: 'Coding Assessment',
    payout_frequency: 'Bi-weekly',
    payout_methods: ['Deel', 'Direct USD Transfer', 'Geegpay'],
    application_url: 'https://mercor.com',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Mercor utilizes an AI interviewer to assess candidate capabilities—practice speaking through code design clearly.',
      'Make sure your GitHub and LinkedIn profiles are updated with your best projects before taking the interview.',
    ],
    flexibility: '15 - 40 hrs/week',
    estimated_weekly_ngn: '₦750,000 - ₦1,900,000 / week',
    filter_audit: {
      geo_status: 'VERIFIED_DIRECT_ACCESS',
      geo_status_label: '🟢 Global Meritocratic Platform (No Location Bias)',
      direct_ip_allowed: true,
      geo_block_risk: 'None',
      vpn_advisory: 'No VPN needed. Native Nigerian IP is welcomed.',
      id_verification: 'AI Video interview + GitHub profile verification.',
      phone_sms_verified: true,
      payout_readiness: 'Direct USD wire, Stripe Connect, and Deel contractor payouts.',
      filter_bypass_strategy: 'Mercor is specifically built to bypass location discrimination. Complete their 20-min AI video interview in a quiet room with good microphone.',
      last_verified: 'Verified October 2026',
    },
  },
  {
    id: 'ai-train-8',
    title: 'STEM & Mathematical Reasoning Model Trainer',
    platform: 'Remotasks',
    hourly_rate_usd: 28,
    hourly_rate_display: '$20 - $35 USD / hr',
    domain: 'STEM & Math',
    description:
      'Train mathematical reasoning models by writing complex multi-step solutions in calculus, statistics, discrete math, and algorithms with step-by-step LaTeX formatting.',
    requirements: [
      'Strong background in Mathematics, Physics, Statistics, or Engineering',
      'Ability to write LaTeX code for mathematical equations',
      'Meticulous error-checking and edge-case verification',
    ],
    skills: ['Mathematics', 'LaTeX', 'Algorithms', 'Logic', 'Python', 'Statistics'],
    screening_type: 'Reasoning Test',
    payout_frequency: 'Weekly',
    payout_methods: ['PayPal', 'Airtm', 'Geegpay'],
    application_url: 'https://remotasks.com',
    is_nigeria_eligible: true,
    nigeria_applicant_tips: [
      'Scale AI / Remotasks projects pay weekly on Tuesdays.',
      'Ensure all mathematical proofs are clearly formatted with zero unstated assumptions.',
    ],
    flexibility: '15 - 35 hrs/week',
    estimated_weekly_ngn: '₦400,000 - ₦800,000 / week',
    filter_audit: {
      geo_status: 'VERIFIED_DIRECT_ACCESS',
      geo_status_label: '🟢 Direct Scale AI Portal',
      direct_ip_allowed: true,
      geo_block_risk: 'None',
      vpn_advisory: 'Strict Anti-VPN policy. Accounts detected behind proxies are permanently suspended.',
      id_verification: 'Persona ID check with NIN or Passport.',
      phone_sms_verified: true,
      payout_readiness: 'Airtm or PayPal. Airtm allows instant peer-to-peer withdrawal to Nigerian bank accounts via NGN transfers.',
      filter_bypass_strategy: 'Submit mathematical reasoning proofs with zero shortcuts. High initial accuracy score prevents the task throttle filter from kicking in.',
      last_verified: 'Verified October 2026',
    },
  },
];

/**
 * Searches and scores AI training jobs based on query, domain, platform, geo-filter status, and candidate profile
 */
export function searchAITrainingJobs(
  queryStr?: string,
  domain?: string,
  platform?: string,
  minRate?: number,
  geoFilterStatus?: string,
  candidateProfile?: CandidateProfile | null
): AITrainingJob[] {
  let list = [...AI_TRAINING_JOBS];

  if (queryStr && queryStr.trim()) {
    const q = queryStr.toLowerCase().trim();
    list = list.filter((job) => {
      const matchInTitle = job.title.toLowerCase().includes(q);
      const matchInPlatform = job.platform.toLowerCase().includes(q);
      const matchInDomain = job.domain.toLowerCase().includes(q);
      const matchInDesc = job.description.toLowerCase().includes(q);
      const matchInSkills = job.skills.some((s) => s.toLowerCase().includes(q));
      const matchInPayout = job.payout_methods.some((p) => p.toLowerCase().includes(q));
      const matchInAudit =
        job.filter_audit.geo_status_label.toLowerCase().includes(q) ||
        job.filter_audit.vpn_advisory.toLowerCase().includes(q) ||
        job.filter_audit.filter_bypass_strategy.toLowerCase().includes(q);
      return matchInTitle || matchInPlatform || matchInDomain || matchInDesc || matchInSkills || matchInPayout || matchInAudit;
    });
  }

  if (domain && domain !== 'all') {
    list = list.filter((job) => job.domain.toLowerCase() === domain.toLowerCase());
  }

  if (platform && platform !== 'all') {
    list = list.filter((job) => job.platform.toLowerCase() === platform.toLowerCase());
  }

  if (minRate && minRate > 0) {
    list = list.filter((job) => job.hourly_rate_usd >= minRate);
  }

  if (geoFilterStatus && geoFilterStatus !== 'all') {
    list = list.filter((job) => job.filter_audit.geo_status === geoFilterStatus);
  }

  // Calculate dynamic candidate match score if profile exists
  return list.map((job) => {
    let score = 75; // baseline high score since all are vetted for Nigeria

    if (candidateProfile) {
      const candidateSkills = (candidateProfile.parsed_skills || []).map((s) => s.toLowerCase());
      const overlapping = job.skills.filter((s) => candidateSkills.some((cs) => cs.includes(s.toLowerCase()) || s.toLowerCase().includes(cs)));

      if (overlapping.length > 0) {
        score += Math.min(20, overlapping.length * 6);
      }

      if (candidateProfile.seniority_level === 'senior' || candidateProfile.seniority_level === 'lead') {
        score += 4;
      }
    }

    return {
      ...job,
      match_score: Math.min(98, score),
    };
  }).sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
}
