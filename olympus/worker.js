/**
 * Olympus AI - Cloudflare Worker Version
 * GitHub webhook handler with Claude AI integration
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        platform: 'Cloudflare Workers'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Status endpoint
    if (url.pathname === '/api/status') {
      return new Response(JSON.stringify({
        api_version: '1.0.0',
        platform: 'Cloudflare Workers',
        endpoints: {
          webhook: '/webhook/github',
          health: '/health',
          status: '/api/status'
        },
        configuration: {
          github_integration: !!env.GITHUB_TOKEN,
          ai_enabled: !!env.ANTHROPIC_API_KEY,
          target_repo: env.GITHUB_REPO || 'not configured'
        },
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // GitHub webhook endpoint
    if (url.pathname === '/webhook/github' && request.method === 'POST') {
      try {
        const payload = await request.json();
        
        // Only process issue events
        const eventType = request.headers.get('X-GitHub-Event');
        if (eventType !== 'issues') {
          return new Response(JSON.stringify({
            status: 'ignored',
            message: `Event type '${eventType}' not processed`
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const action = payload.action;
        if (action !== 'opened' && action !== 'reopened') {
          return new Response(JSON.stringify({
            status: 'ignored',
            message: `Action '${action}' not processed`
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        // Process issue in background
        const issue = payload.issue;
        const repo = payload.repository.full_name;
        
        console.log(`Processing issue #${issue.number} from ${repo}`);
        
        // Analyze with Claude AI
        const analysis = await analyzeIssueWithClaude(
          issue.title,
          issue.body || '',
          env.ANTHROPIC_API_KEY
        );

        // Add labels and comment to GitHub
        await updateGitHubIssue(
          repo,
          issue.number,
          analysis,
          env.GITHUB_TOKEN
        );

        return new Response(JSON.stringify({
          status: 'success',
          message: `Issue #${issue.number} analyzed and labeled`,
          timestamp: new Date().toISOString()
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        console.error('Webhook processing error:', error);
        return new Response(JSON.stringify({
          status: 'error',
          message: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Root endpoint
    if (url.pathname === '/') {
      return new Response(JSON.stringify({
        service: 'Olympus AI Webhook Server',
        platform: 'Cloudflare Workers',
        status: 'operational',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};

/**
 * Analyze issue with Claude AI
 */
async function analyzeIssueWithClaude(title, body, apiKey) {
  const prompt = `Analyze this GitHub issue and provide:
1. Priority level (critical/high/medium/low)
2. Category (bug/feature/enhancement/documentation/question/infrastructure)
3. Effort estimate (quick/medium/large/epic)
4. Risk level (high/medium/low)
5. Brief analysis summary
6. Recommended team (frontend/backend/devops/design/qa)

Issue Title: ${title}
Issue Description: ${body || 'No description provided'}

Respond in JSON format:
{
  "priority": "high",
  "category": "bug",
  "effort": "medium",
  "risk": "medium",
  "summary": "Brief analysis here",
  "team": "backend"
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content[0].text;
  
  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  
  // Fallback if JSON parsing fails
  return {
    priority: 'medium',
    category: 'question',
    effort: 'medium',
    risk: 'low',
    summary: 'AI analysis completed',
    team: 'backend'
  };
}

/**
 * Update GitHub issue with labels and comment
 */
async function updateGitHubIssue(repo, issueNumber, analysis, token) {
  const baseUrl = `https://api.github.com/repos/${repo}/issues/${issueNumber}`;
  
  // Add labels
  const labels = [
    `priority:${analysis.priority}`,
    `type:${analysis.category}`,
    `effort:${analysis.effort}`
  ];

  await fetch(`${baseUrl}/labels`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Olympus-AI-Worker'
    },
    body: JSON.stringify({ labels })
  });

  // Add comment
  const comment = `## 🤖 Olympus AI Analysis

**Priority:** ${analysis.priority.toUpperCase()}
**Category:** ${analysis.category}
**Effort Estimate:** ${analysis.effort}
**Risk Level:** ${analysis.risk}

### Analysis
${analysis.summary}

**Recommended Team:** ${analysis.team}

---
*Analyzed by Olympus AI on Cloudflare Workers*`;

  await fetch(`${baseUrl}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Olympus-AI-Worker'
    },
    body: JSON.stringify({ body: comment })
  });
}
