---
Task ID: 1
Agent: Main Agent
Task: Fix Chat tab crash, activate ChatBot (DiplomatiQ Guru), link Research Lab to ChatBot

Work Log:
- Analyzed screenshot showing "Something went wrong" error on Chat tab
- Investigated ChatView.tsx, AppShell.tsx, Sidebar.tsx, API routes, Prisma schema
- Identified root causes: null category handling, mobile Sheet infinite loop, missing bot user/channels in DB
- Created /api/setup/chat endpoint to seed DiplomatiQ Guru bot user + 8 default channels
- Fixed ChatView.tsx: null-safe category mapping, channel type validation, isCommittee inference, loading state, setup button
- Fixed mobile members Sheet infinite loop with separate mobileMembersOpen state
- Updated /api/ai-assistant to work without channelId (for Research Lab direct chat)
- Added DiplomatiQ Guru branding to ResearchPaperEvaluation component
- Added "Chat with DiplomatiQ Guru" section in Research Lab for follow-up guidance
- Updated research evaluation system prompt to identify as DiplomatiQ Guru
- Seeded production database with bot user and channels
- Committed and pushed to GitHub (ed03c53)
- Verified production deployment is live

Stage Summary:
- Chat tab no longer crashes - has loading state, null-safe data handling, setup button
- DiplomatiQ Guru bot user seeded in production database
- 8 default channels created (4 committee channels with AI, 4 regular channels)
- AI ChatBot works in committee channels via "Ask DiplomatiQ Guru" button
- Research Lab shows "Powered by DiplomatiQ Guru" branding and has chat section
- TrainingHub was NOT modified (verified)
- Build passes, deployment is live at https://mun-diplomatiq.vercel.app
