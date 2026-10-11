import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { store } from './server/store.js';
import { parseResumeWithGemini } from './server/gemini.js';
import { searchAITrainingJobs, AI_TRAINING_JOBS } from './server/aiTrainingData.js';
import { ENV_CONFIG, validateEnvironmentSecurity } from './server/env.js';

// Perform startup environment validation & logging without secret leaks
validateEnvironmentSecurity();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = ENV_CONFIG.PORT;

app.use(express.json({ limit: '25mb' }));

// 1. Get all jobs
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = store.getJobs();
    res.json({
      success: true,
      total: jobs.length,
      nigeria_eligible_count: jobs.filter((j) => j.is_nigeria_eligible).length,
      jobs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Trigger job ingestion & Nigeria eligibility filter
app.post('/api/jobs/refresh', async (req, res) => {
  try {
    const result = await store.refreshJobsFromLiveFeeds();
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Get candidate profile
app.get('/api/profile', (req, res) => {
  try {
    const profile = store.getProfile();
    res.json({ success: true, profile });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Upload & parse resume (PDF, DOCX, text)
app.post('/api/resume/upload', async (req, res) => {
  try {
    const { text, base64Data, mimeType, filename } = req.body;

    if (!text && !base64Data) {
      return res.status(400).json({ success: false, error: 'No resume content provided' });
    }

    // Parse with Gemini
    const parsedData = await parseResumeWithGemini({
      text,
      base64Data,
      mimeType: mimeType || 'application/pdf',
    });

    const updatedProfile = await store.updateProfile({
      ...parsedData,
      resume_text: text || `[Document parsed: ${filename || 'Uploaded Resume'}]`,
      resume_filename: filename || 'resume.pdf',
    });

    const matches = store.getMatches();

    res.json({
      success: true,
      profile: updatedProfile,
      matches,
    });
  } catch (err: any) {
    console.error('Error parsing resume:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Save/Update Profile from Quick Resume Builder
app.post('/api/profile/save', async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      current_title,
      location,
      seniority_level,
      years_of_experience,
      parsed_skills,
      summary,
      achievements,
    } = req.body;

    const skillsArray = Array.isArray(parsed_skills)
      ? parsed_skills
      : typeof parsed_skills === 'string'
      ? parsed_skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : ['TypeScript', 'React', 'Node.js'];

    const achievementsArray = Array.isArray(achievements)
      ? achievements
      : typeof achievements === 'string'
      ? achievements.split('\n').map((a: string) => a.trim()).filter(Boolean)
      : [];

    // Calculate ATS Health Score
    let healthScore = 70;
    const healthFeedback: string[] = [];

    if (skillsArray.length >= 6) {
      healthScore += 10;
    } else {
      healthFeedback.push('Add at least 6 core technical tools to improve automated ATS keyword indexing.');
    }

    const hasMetrics = achievementsArray.some((a: string) => /\d+|%|\$|reduction|scale|latency/i.test(a));
    if (hasMetrics) {
      healthScore += 15;
    } else {
      healthFeedback.push('Include metric-driven outcomes (e.g. latency reductions, active users, revenue processed).');
    }

    if (summary && summary.length > 50) {
      healthScore += 5;
    }

    healthScore = Math.min(98, Math.max(65, healthScore));

    const resumeRepresentation = `
${full_name || 'Candidate'} — ${current_title || 'Software Engineer'} (${location || 'Nigeria'})
Email: ${email || ''} | Phone: ${phone || ''}
Timezone: West Africa Time (WAT / UTC+1) | Full Remote Setup
Experience: ${years_of_experience || 4} years (${seniority_level || 'senior'})

PROFESSIONAL SUMMARY
${summary || ''}

TECHNICAL SKILLS
${skillsArray.join(', ')}

KEY ACHIEVEMENTS
${achievementsArray.map((a: string) => `- ${a}`).join('\n')}
    `.trim();

    const updated = await store.updateProfile({
      full_name: full_name || 'Nigerian Professional',
      email: email || '',
      phone: phone || '',
      current_title: current_title || 'Software Engineer',
      location: location || 'Lagos, Nigeria (WAT / UTC+1)',
      seniority_level: seniority_level || 'senior',
      years_of_experience: Number(years_of_experience) || 4,
      parsed_skills: skillsArray,
      summary: summary || '',
      achievements: achievementsArray,
      resume_text: resumeRepresentation,
      resume_filename: `${(full_name || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`,
      health_score: healthScore,
      health_feedback: healthFeedback.length > 0 ? healthFeedback : [
        'Resume layout is clear and optimized for international ATS algorithms.',
        'West Africa Time (WAT) alignment prominently noted for remote hiring teams.',
      ],
    });

    const matches = store.getMatches();
    res.json({ success: true, profile: updated, matches });
  } catch (err: any) {
    console.error('Error saving profile:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Backward-compatibility alias
app.post('/api/profile/load-sample', async (req, res) => {
  try {
    const profile = store.getProfile();
    const matches = store.getMatches();
    res.json({ success: true, profile, matches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Get matches
app.get('/api/matches', (req, res) => {
  try {
    const matches = store.getMatches();
    res.json({ success: true, matches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Generate Guide & Cover Letter for a specific match
app.post('/api/jobs/generate-guide', async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ success: false, error: 'Job ID required' });
    }

    const match = await store.ensureGuideAndLetter(jobId);
    if (!match) {
      return res.status(404).json({ success: false, error: 'Job match not found' });
    }

    res.json({
      success: true,
      match,
    });
  } catch (err: any) {
    console.error('Error generating guide:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Update Match Status (reviewed, authorized_sent, applied_manually, archived)
app.post('/api/matches/status', (req, res) => {
  try {
    const { jobId, status, sentAt } = req.body;
    if (!jobId || !status) {
      return res.status(400).json({ success: false, error: 'jobId and status are required' });
    }

    const updated = store.updateMatchStatus(jobId, status, sentAt);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }

    res.json({ success: true, match: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Generate Daily Digest Email Preview
app.post('/api/digest/generate', (req, res) => {
  try {
    const profile = store.getProfile();
    const topMatches = store.getMatches().slice(0, 3);

    const digest = {
      subject: `🎯 AfroRemote Daily Digest: ${topMatches.length} Verified Worldwide Roles Open to Nigeria`,
      recipient_email: profile.email,
      recipient_name: profile.full_name,
      generated_at: new Date().toISOString(),
      top_matches: topMatches.map((m) => ({
        title: m.job.title,
        company: m.job.company,
        match_score: `${m.similarity_score}%`,
        salary: m.job.salary_range,
        location: m.job.location_tag,
        wat_overlap: '1:00 PM – 6:00 PM WAT (5+ hrs sync)',
        apply_type: m.job.application_type,
        url: m.job.source_url,
      })),
      contractor_advice: 'Reminder: When applying, ensure you attach your updated resume and mention your remote infrastructure setup (fiber + power inverter).',
    };

    res.json({ success: true, digest });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Get AI Training & RLHF jobs with search & matching
app.get('/api/ai-training-jobs', (req, res) => {
  try {
    const { q, domain, platform, minRate, geoFilterStatus } = req.query;
    const profile = store.getProfile();
    const jobs = searchAITrainingJobs(
      typeof q === 'string' ? q : undefined,
      typeof domain === 'string' ? domain : undefined,
      typeof platform === 'string' ? platform : undefined,
      minRate ? Number(minRate) : undefined,
      typeof geoFilterStatus === 'string' ? geoFilterStatus : undefined,
      profile
    );

    res.json({
      success: true,
      total: jobs.length,
      nigeria_eligible_count: jobs.length,
      jobs,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Run Nigerian Site Filter & Availability Diagnostics
app.get('/api/check-nigeria-availability', (req, res) => {
  try {
    const profile = store.getProfile();
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const platformAudits = AI_TRAINING_JOBS.map((j) => ({
      platform: j.platform,
      title: j.title,
      rate: j.hourly_rate_display,
      status: j.filter_audit.geo_status,
      statusLabel: j.filter_audit.geo_status_label,
      directIpAllowed: j.filter_audit.direct_ip_allowed,
      geoBlockRisk: j.filter_audit.geo_block_risk,
      vpnWarning: j.filter_audit.vpn_advisory,
      idVerification: j.filter_audit.id_verification,
      payoutReadiness: j.filter_audit.payout_readiness,
      bypassStrategy: j.filter_audit.filter_bypass_strategy,
    }));

    const recommendations = [
      {
        category: 'Network & IP Filter Safety',
        status: 'CRITICAL',
        advice: 'Never use a VPN (ExpressVPN, NordVPN, etc.) when applying to Outlier, Alignerr, or Remotasks. Their Cloudflare/Datadog security permanently shadowbans accounts within minutes of detecting a VPN. Apply from a clean Starlink, MTN 5G, or Airtel fiber connection.',
      },
      {
        category: 'Identity Verification (IDV)',
        status: 'HIGH_PRIORITY',
        advice: 'Ensure you have either a Nigerian International Passport or a clear, high-resolution National Identification Number (NIN) slip with a scannable QR code. Persona and Veriff reject photos with glare or cropped edges.',
      },
      {
        category: 'USD Payout Infrastructure',
        status: 'RECOMMENDED',
        advice: 'Open a Geegpay or Grey USD Virtual Account before applying. This provides US routing and account numbers for ACH direct deposits (e.g., from Outlier and Invisible Tech). Deel allows direct transfers to Nigerian commercial bank accounts in NGN or USD.',
      },
      {
        category: 'Keystroke & Anti-AI Fraud Systems',
        status: 'CRITICAL',
        advice: 'During the 40-minute initial screenings, do not copy-paste code from ChatGPT or Claude. Modern evaluation platforms record keystroke rhythm and will automatically disqualify candidates with synthetic typing profiles.',
      },
    ];

    res.json({
      success: true,
      diagnosticTime: new Date().toISOString(),
      clientIp,
      overallNigeriaReadiness: '94/100',
      totalVettedPlatforms: platformAudits.length,
      platformAudits,
      recommendations,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Get specific AI Training Job details
app.get('/api/ai-training-jobs/:id', (req, res) => {
  try {
    const job = AI_TRAINING_JOBS.find((j) => j.id === req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'AI training job not found' });
    }
    res.json({ success: true, job });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express server with Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AfroRemote server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
