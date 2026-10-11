import { CandidateProfile, Job, JobMatch } from '../src/types/index.js';
import {
  calculateCosineSimilarity,
  generateCandidateGuideAndCoverLetter,
  generateEmbeddingVector,
} from './gemini.js';
import { SEED_JOBS, fetchLiveJobsFromExternalFeeds } from './jobsData.js';

class AfroRemoteStore {
  private jobs: Job[] = [...SEED_JOBS];
  private profile: CandidateProfile = {
    id: 'user-default',
    email: 'chidi.okafor@example.com',
    full_name: 'Chidi Okafor',
    current_title: 'Senior Fullstack & Cloud Engineer',
    phone: '+234 803 123 4567',
    location: 'Lagos, Nigeria (WAT / UTC+1)',
    resume_filename: 'Chidi_Okafor_Senior_Software_Engineer.pdf',
    resume_text: `Chidi Okafor — Senior Fullstack & Cloud Engineer (Lagos, Nigeria)
Email: chidi.okafor@example.com | GitHub: github.com/chidi-dev | LinkedIn: linkedin.com/in/chidi-okafor
Timezone: West Africa Time (WAT / UTC+1) | Full Remote Setup (Dual Fiber ISPs + 5kVA Solar Inverter)

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience engineering high-scale distributed web applications, event-driven microservices, and modern frontend platforms. Proven track record leading cross-border teams across EMEA and the US, with a deep focus on TypeScript, React, Next.js, Node.js, Go, PostgreSQL, Docker, and AWS.

TECHNICAL SKILLS
- Languages: TypeScript, JavaScript, Go (Golang), Python, SQL
- Frontend: React 19, Next.js, Tailwind CSS, Vite, Redux Toolkit, WebSockets
- Backend & Cloud: Node.js, Express, NestJS, PostgreSQL, Redis, Docker, Kubernetes, AWS (ECS, S3, RDS, Lambda)
- Practices: CI/CD (GitHub Actions), Asynchronous Team Collaboration, RESTful & GraphQL APIs, System Design

KEY ACHIEVEMENTS & EXPERIENCE
- Lead Software Engineer @ PayFlow Africa (2023 - Present)
  * Architected payment settlement pipeline processing over $4.2M monthly transactions across Nigeria, Ghana, and Kenya with 99.99% uptime.
  * Migrated monolithic architecture to event-driven Go microservices and Redis queues, decreasing API p99 latency from 450ms to 65ms.
  * Established asynchronous RFC documentation standards, reducing sprint planning cycle time by 40%.
- Senior Fullstack Engineer @ RemoteScale Inc. (2021 - 2023)
  * Built responsive SaaS customer portals using React, TypeScript, and Tailwind CSS serving 120,000 active users.
  * Managed AWS Terraform infrastructure and automated zero-downtime rolling deployments via GitHub Actions.
  * Mentored 5 mid-level engineers across Nigeria and the UK in test-driven development and clean architecture.`,
    parsed_skills: [
      'TypeScript',
      'React',
      'Next.js',
      'Node.js',
      'Go',
      'PostgreSQL',
      'AWS',
      'Docker',
      'Kubernetes',
      'Tailwind CSS',
      'Redis',
      'Microservices',
      'Asynchronous Work',
    ],
    years_of_experience: 6,
    seniority_level: 'senior',
    desired_roles: ['Senior Fullstack Engineer', 'Senior Backend Engineer', 'Staff Engineer'],
    summary:
      'Senior Software Engineer with 6+ years building distributed cloud backends and responsive React applications. Expert in asynchronous remote workflows with a dedicated home lab setup in Lagos, Nigeria.',
    achievements: [
      'Architected payment settlement microservices processing $4.2M+ monthly volume with 99.99% uptime and 65ms p99 latency.',
      'Transitioned core platform to event-driven Go and Redis, reducing cloud infrastructure spend by 28%.',
      'Spearheaded async engineering practices and RFC documentation across multinational teams.',
    ],
    health_score: 94,
    health_feedback: [
      'Outstanding quantifiable business metrics ($4.2M volume, 65ms latency reduction).',
      'Clear West Africa Time (WAT) availability and infrastructure redundancy noted.',
      'Strong international stack (TypeScript, Go, React, AWS).',
    ],
    gmail_connected: false,
    updated_at: new Date().toISOString(),
  };

  private matches: Map<string, JobMatch> = new Map();
  private isIngesting = false;

  constructor() {
    this.initializeEmbeddingsAndMatches();
  }

  private async initializeEmbeddingsAndMatches() {
    // Generate profile embedding
    const profileVector = await generateEmbeddingVector(
      `${this.profile.summary} ${this.profile.parsed_skills.join(' ')} ${this.profile.achievements.join(' ')}`
    );
    this.profile.embedding = profileVector;

    // Generate embeddings for seed jobs and match
    for (const job of this.jobs) {
      if (!job.embedding) {
        job.embedding = await generateEmbeddingVector(`${job.title} ${job.description} ${job.tags.join(' ')}`);
      }
      const similarity = calculateCosineSimilarity(profileVector, job.embedding);
      this.matches.set(job.id, {
        id: `match-${job.id}`,
        job_id: job.id,
        job,
        similarity_score: similarity,
        match_reasoning: this.generateReasoning(this.profile, job, similarity),
        status: 'new',
        created_at: new Date().toISOString(),
      });
    }
  }

  private generateReasoning(profile: CandidateProfile, job: Job, score: number): string {
    const matchingSkills = profile.parsed_skills.filter((skill) =>
      job.description.toLowerCase().includes(skill.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase() === skill.toLowerCase())
    );

    const skillsStr = matchingSkills.length > 0 ? matchingSkills.slice(0, 4).join(', ') : 'core software architecture';
    return `Strong ${score}% alignment. Candidate possesses ${profile.years_of_experience} years of ${profile.seniority_level} experience with direct matches in ${skillsStr}. Timezone compatibility with WAT is excellent for this ${job.location_tag} role.`;
  }

  public getJobs(): Job[] {
    return this.jobs;
  }

  public getProfile(): CandidateProfile {
    return this.profile;
  }

  public async updateProfile(updated: Partial<CandidateProfile>): Promise<CandidateProfile> {
    this.profile = {
      ...this.profile,
      ...updated,
      updated_at: new Date().toISOString(),
    };

    // Recompute embedding and matches
    const textForVector = `${this.profile.summary} ${this.profile.parsed_skills.join(' ')} ${this.profile.achievements.join(' ')}`;
    this.profile.embedding = await generateEmbeddingVector(textForVector);
    await this.recalculateMatches();
    return this.profile;
  }

  public async recalculateMatches(): Promise<JobMatch[]> {
    if (!this.profile.embedding) {
      this.profile.embedding = await generateEmbeddingVector(
        `${this.profile.summary} ${this.profile.parsed_skills.join(' ')}`
      );
    }

    const results: JobMatch[] = [];
    for (const job of this.jobs) {
      if (!job.embedding) {
        job.embedding = await generateEmbeddingVector(`${job.title} ${job.description}`);
      }
      const score = calculateCosineSimilarity(this.profile.embedding, job.embedding);
      const existing = this.matches.get(job.id);

      const matchObj: JobMatch = {
        id: existing?.id || `match-${job.id}`,
        job_id: job.id,
        job,
        similarity_score: score,
        match_reasoning: this.generateReasoning(this.profile, job, score),
        generated_cover_letter: existing?.generated_cover_letter,
        application_guide: existing?.application_guide,
        status: existing?.status || 'new',
        sent_at: existing?.sent_at,
        created_at: existing?.created_at || new Date().toISOString(),
      };

      this.matches.set(job.id, matchObj);
      results.push(matchObj);
    }

    return results.sort((a, b) => b.similarity_score - a.similarity_score);
  }

  public getMatches(): JobMatch[] {
    return Array.from(this.matches.values()).sort((a, b) => b.similarity_score - a.similarity_score);
  }

  public getMatch(jobId: string): JobMatch | undefined {
    return this.matches.get(jobId);
  }

  public updateMatchStatus(
    jobId: string,
    status: JobMatch['status'],
    sentAt?: string
  ): JobMatch | undefined {
    const match = this.matches.get(jobId);
    if (match) {
      match.status = status;
      if (sentAt) match.sent_at = sentAt;
      this.matches.set(jobId, match);
      return match;
    }
    return undefined;
  }

  public async ensureGuideAndLetter(jobId: string): Promise<JobMatch | undefined> {
    const match = this.matches.get(jobId);
    if (!match) return undefined;

    if (!match.generated_cover_letter || !match.application_guide) {
      const generated = await generateCandidateGuideAndCoverLetter(this.profile, match.job);
      match.generated_cover_letter = generated.cover_letter;
      match.application_guide = generated.application_guide;
      this.matches.set(jobId, match);
    }

    return match;
  }

  public async refreshJobsFromLiveFeeds(): Promise<{ added: number; total: number }> {
    if (this.isIngesting) return { added: 0, total: this.jobs.length };
    this.isIngesting = true;
    try {
      const freshJobs = await fetchLiveJobsFromExternalFeeds();
      let added = 0;
      for (const fresh of freshJobs) {
        const exists = this.jobs.some(
          (j) => j.source_url === fresh.source_url || (j.company === fresh.company && j.title === fresh.title)
        );
        if (!exists) {
          fresh.embedding = await generateEmbeddingVector(`${fresh.title} ${fresh.description}`);
          this.jobs.unshift(fresh);
          added++;
        }
      }
      if (added > 0) {
        await this.recalculateMatches();
      }
      return { added, total: this.jobs.length };
    } finally {
      this.isIngesting = false;
    }
  }
}

export const store = new AfroRemoteStore();
