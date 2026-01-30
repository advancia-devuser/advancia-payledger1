"""
Olympus - AI-Powered GitHub Webhook Server
Production-ready FastAPI server for GitHub issue analysis
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
import httpx
from pydantic import BaseModel
import anthropic

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/app/logs/olympus.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="Olympus AI Webhook Server",
    description="AI-powered GitHub issue analysis and auto-triage",
    version="1.0.0"
)

# Environment variables
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GITHUB_REPO = os.getenv("GITHUB_REPO", "")  # Format: owner/repo

# Initialize Anthropic client
if ANTHROPIC_API_KEY:
    claude_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
else:
    logger.warning("ANTHROPIC_API_KEY not set - AI features disabled")
    claude_client = None



class WebhookPayload(BaseModel):
    action: str
    issue: Optional[Dict[str, Any]] = None
    repository: Optional[Dict[str, Any]] = None


def analyze_issue_with_ai(issue_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze GitHub issue using Claude AI"""
    if not claude_client:
        return {
            "priority": "medium",
            "analysis": "AI analysis unavailable",
            "category": "general",
            "estimated_effort": "unknown"
        }
    
    title = issue_data.get("title", "")
    body = issue_data.get("body", "")
    labels = [label["name"] for label in issue_data.get("labels", [])]
    
    prompt = f"""Analyze this GitHub issue and provide a structured assessment:

Title: {title}
Description: {body}
Current Labels: {', '.join(labels) if labels else 'None'}

Provide analysis in JSON format with:
1. priority: "critical", "high", "medium", or "low"
2. category: "bug", "feature", "enhancement", "documentation", "question", or "infrastructure"
3. estimated_effort: "quick" (< 2h), "medium" (2-8h), "large" (1-3 days), or "epic" (> 3 days)
4. analysis: 2-3 sentence summary of the issue and recommended approach
5. suggested_assignee_type: "backend", "frontend", "devops", "data", or "general"
6. risk_level: "low", "medium", or "high" based on potential impact

Be concise and actionable."""

    try:
        message = claude_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        
        response_text = message.content[0].text
        
        # Try to extract JSON from response
        if "```json" in response_text:
            json_str = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_str = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_str = response_text.strip()
        
        analysis = json.loads(json_str)
        logger.info(f"AI analysis completed for issue: {title}")
        return analysis
        
    except Exception as e:
        logger.error(f"AI analysis failed: {str(e)}")
        return {
            "priority": "medium",
            "analysis": f"Analysis error: {str(e)}",
            "category": "general",
            "estimated_effort": "medium"
        }


async def update_github_issue(issue_number: int, repo: str, analysis: Dict[str, Any]):
    """Update GitHub issue with AI analysis"""
    if not GITHUB_TOKEN:
        logger.warning("GITHUB_TOKEN not set - cannot update issues")
        return
    
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Olympus-AI-Bot"
    }
    
    # Add labels
    priority_label = f"priority:{analysis.get('priority', 'medium')}"
    category_label = f"type:{analysis.get('category', 'general')}"
    effort_label = f"effort:{analysis.get('estimated_effort', 'medium')}"
    
    labels_url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/labels"
    
    async with httpx.AsyncClient() as client:
        try:
            # Add labels
            await client.post(
                labels_url,
                headers=headers,
                json={"labels": [priority_label, category_label, effort_label]},
                timeout=10.0
            )
            logger.info(f"Labels added to issue #{issue_number}")
            
            # Post analysis comment
            comment_text = f"""## 🤖 Olympus AI Analysis

**Priority:** `{analysis.get('priority', 'medium').upper()}` 
**Category:** `{analysis.get('category', 'general')}` 
**Estimated Effort:** `{analysis.get('estimated_effort', 'medium')}` 
**Risk Level:** `{analysis.get('risk_level', 'medium')}` 

### Analysis
{analysis.get('analysis', 'No analysis available')}

### Recommendation
**Suggested Team:** {analysis.get('suggested_assignee_type', 'general')}

---
*Analyzed by Olympus AI at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC*
"""
            
            comments_url = f"https://api.github.com/repos/{repo}/issues/{issue_number}/comments"
            await client.post(
                comments_url,
                headers=headers,
                json={"body": comment_text},
                timeout=10.0
            )
            logger.info(f"Analysis comment posted to issue #{issue_number}")
            
        except Exception as e:
            logger.error(f"Failed to update GitHub issue: {str(e)}")


async def process_webhook(payload: Dict[str, Any]):
    """Process GitHub webhook in background"""
    try:
        action = payload.get("action")
        issue = payload.get("issue")
        repository = payload.get("repository")
        
        if not issue or not repository:
            logger.warning("Invalid webhook payload - missing issue or repository")
            return
        
        repo_full_name = repository.get("full_name")
        issue_number = issue.get("number")
        
        logger.info(f"Processing {action} for issue #{issue_number} in {repo_full_name}")
        
        # Analyze with AI
        analysis = analyze_issue_with_ai(issue)
        
        # Update GitHub issue
        await update_github_issue(issue_number, repo_full_name, analysis)
        
        logger.info(f"Successfully processed issue #{issue_number}")
        
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Olympus AI Webhook Server",
        "status": "operational",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat()
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "api": "operational",
            "github_token": "configured" if GITHUB_TOKEN else "missing",
            "anthropic_api": "configured" if ANTHROPIC_API_KEY else "missing"
        }
    }
    return health_status


@app.get("/api/status")
async def api_status():
    """Get API status and statistics"""
    return {
        "api_version": "1.0.0",
        "endpoints": {
            "webhook": "/webhook/github",
            "health": "/health",
            "status": "/api/status"
        },
        "configuration": {
            "github_integration": GITHUB_TOKEN is not None,
            "ai_enabled": ANTHROPIC_API_KEY is not None,
            "target_repo": GITHUB_REPO or "not configured"
        },
        "timestamp": datetime.utcnow().isoformat()
    }


@app.post("/webhook/github")
async def github_webhook(request: Request, background_tasks: BackgroundTasks):
    """Handle GitHub webhook events"""
    try:
        # Get payload
        payload = await request.json()
        
        # Log event
        action = payload.get("action", "unknown")
        event_type = request.headers.get("X-GitHub-Event", "unknown")
        
        logger.info(f"Received GitHub event: {event_type} - {action}")
        
        # Only process issue events
        if event_type == "issues" and action in ["opened", "reopened"]:
            # Process in background
            background_tasks.add_task(process_webhook, payload)
            
            return JSONResponse(
                status_code=202,
                content={
                    "status": "accepted",
                    "message": f"Issue {action} - processing with AI",
                    "timestamp": datetime.utcnow().isoformat()
                }
            )
        
        return JSONResponse(
            status_code=200,
            content={
                "status": "acknowledged",
                "message": f"Event {event_type} received but not processed",
                "timestamp": datetime.utcnow().isoformat()
            }
        )
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON payload")
        raise HTTPException(status_code=400, detail="Invalid JSON payload")
    except Exception as e:
        logger.error(f"Webhook processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "webhook_server:app",
        host="0.0.0.0",
        port=8000,
        workers=2,
        log_level="info"
    )
