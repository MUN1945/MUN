---
Task ID: 1
Agent: Main Agent
Task: Comprehensive platform improvements - Chat UI fix, Code of Conduct system, Footer cleanup

Work Log:
- Analyzed uploaded screenshot showing chat UI with overlapping elements and broken layout
- Explored full codebase structure: ChatView.tsx (1070+ lines), CodeOfConduct.tsx, Footer.tsx, AppShell.tsx, Sidebar.tsx, Prisma schema
- Identified three major issues: chat layout overflow, CoC only using localStorage, footer with broken links
- Delegated Chat UI fix to subagent: removed border/rounded/shadow from root, replaced ScrollArea with native div, simplified members sidebar animation, fixed three-column flex layout
- Delegated CoC system to subagent: added DB fields (conductAcknowledged, conductAcknowledgedAt, conductVersion), created API endpoints, built ConductAcknowledgementModal, added dashboard cards, integrated in AppShell, added admin tracking in FounderDashboard
- Delegated Footer cleanup to subagent: fixed all broken links, created 6 new pages (About, Privacy, Terms, CoC, MUN Guide, Help Center)
- Verified build succeeds (npx next build)
- Committed all changes (19 files, 2250 insertions)
- Pushed to GitHub (commit 2c93f02)
- Verified all new pages return 200 on production

Stage Summary:
- Chat UI fixed: proper flex layout, no overflow, responsive three-column design
- CoC system: full DB persistence, first-time modal, dashboard integration, admin tracking
- Footer: all links now point to real pages, 6 new pages created
- Production site live at https://mun-diplomatiq.vercel.app
- All changes auto-deployed via GitHub push
