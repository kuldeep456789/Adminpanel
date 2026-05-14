// ============================================================
// DEMO DATA — Isolated from real DB. Never synced to backend.
// ============================================================

export const DEMO_USER = {
  id: "demo-user-001",
  name: "Alex Rivera",
  email: "alex@demo.workspace",
  role: "Admin"
};

export const DEMO_STATS = {
  summary: {
    total_projects: 12,
    active_projects: 8,
    total_tickets: 247,
    total_chats: 183,
    total_calls: 64,
    open_tickets: 42
  },
  monthlyTrend: [
    { month: "Jan", count: 87 },
    { month: "Feb", count: 112 },
    { month: "Mar", count: 98 },
    { month: "Apr", count: 143 },
    { month: "May", count: 129 },
    { month: "Jun", count: 167 }
  ],
  projectActivity: [
    { name: "Project Alpha", tickets: 45, chats: 32 },
    { name: "Global Reach", tickets: 28, chats: 54 },
    { name: "Nexus Core", tickets: 63, chats: 48 },
    { name: "Skyline Pro", tickets: 19, chats: 38 },
    { name: "Innovate X", tickets: 37, chats: 22 }
  ],
  statusBreakdown: [
    { name: "Open", value: 42 },
    { name: "In Progress", value: 58 },
    { name: "Resolved", value: 103 },
    { name: "Closed", value: 44 }
  ],
  recentActivity: [
    {
      _id: "d1",
      title: "Critical Ticket Escalated",
      description: "Payment gateway timeout on Nexus Core production",
      actor: "Sarah Chen",
      createdAt: new Date(Date.now() - 4 * 60000).toISOString()
    },
    {
      _id: "d2",
      title: "Onboarding Call Scheduled",
      description: "New client intake session for Skyline Pro integration",
      actor: "Marcus Webb",
      createdAt: new Date(Date.now() - 18 * 60000).toISOString()
    },
    {
      _id: "d3",
      title: "Deployment Successful",
      description: "v3.1.2 shipped to Global Reach production cluster",
      actor: "CI/CD Bot",
      createdAt: new Date(Date.now() - 35 * 60000).toISOString()
    },
    {
      _id: "d4",
      title: "Chat Volume Spike",
      description: "Unusual activity on Project Alpha — 28 concurrent sessions",
      actor: "Monitor",
      createdAt: new Date(Date.now() - 62 * 60000).toISOString()
    }
  ]
};

export const DEMO_PROJECTS = [
  {
    _id: "demo-p1",
    name: "Nexus Core",
    clientName: "Pinnacle Systems",
    description: "Enterprise-grade support operations for financial infrastructure",
    status: "active" as const,
    modules: { chat: true, call: true, ticket: true },
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    _id: "demo-p2",
    name: "Global Reach",
    clientName: "Acme Corporation",
    description: "Multi-region customer success and onboarding support",
    status: "active" as const,
    modules: { chat: true, call: false, ticket: true },
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    _id: "demo-p3",
    name: "Skyline Pro",
    clientName: "Vertex Technologies",
    description: "Real-time monitoring and incident management platform",
    status: "active" as const,
    modules: { chat: true, call: true, ticket: false },
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    _id: "demo-p4",
    name: "Project Alpha",
    clientName: "Stark Industries",
    description: "Internal ticketing and escalation for R&D division",
    status: "inactive" as const,
    modules: { chat: false, call: true, ticket: true },
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString()
  },
  {
    _id: "demo-p5",
    name: "Innovate X",
    clientName: "Bloom Labs",
    description: "Startup accelerator support hub with SLA tracking",
    status: "active" as const,
    modules: { chat: true, call: true, ticket: true },
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

export const DEMO_ACTIVITY = [
  {
    _id: "da1",
    type: "ticket",
    message: "Ticket #1847 escalated to P1 — Gateway timeout on Nexus Core",
    user: "Sarah Chen",
    project: "Nexus Core",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString()
  },
  {
    _id: "da2",
    type: "chat",
    message: "New chat session opened — Onboarding flow for Global Reach",
    user: "Marcus Webb",
    project: "Global Reach",
    createdAt: new Date(Date.now() - 22 * 60000).toISOString()
  },
  {
    _id: "da3",
    type: "call",
    message: "30-min consultation completed — Skyline Pro integration review",
    user: "Priya Nair",
    project: "Skyline Pro",
    createdAt: new Date(Date.now() - 48 * 60000).toISOString()
  },
  {
    _id: "da4",
    type: "ticket",
    message: "Ticket #1831 resolved — Auth flow bug fix deployed successfully",
    user: "James Carter",
    project: "Project Alpha",
    createdAt: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    _id: "da5",
    type: "chat",
    message: "Chat volume alert — 28 concurrent sessions on Project Alpha",
    user: "System Monitor",
    project: "Project Alpha",
    createdAt: new Date(Date.now() - 130 * 60000).toISOString()
  }
];

export const DEMO_TICKETS = [
  {
    _id: "t1",
    title: "SSL Certificate Expiry Warning",
    description: "The primary SSL certificate for nexus-core.pinnacle.com is set to expire in 48 hours. Needs immediate renewal to avoid service interruption.",
    status: "Open",
    priority: "High",
    assignedTo: "Sarah Chen",
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    comments: [
      { author: "System Bot", content: "Auto-detected expiry date: 2026-05-15", createdAt: new Date(Date.now() - 2 * 3600000).toISOString() }
    ]
  },
  {
    _id: "t2",
    title: "Database Latency Spike",
    description: "Observed 500ms+ latency on read operations for the US-EAST-1 cluster during peak hours.",
    status: "In Progress",
    priority: "Critical",
    assignedTo: "Marcus Webb",
    createdAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    comments: [
      { author: "Marcus Webb", content: "Investigating replication lag in the primary node.", createdAt: new Date(Date.now() - 4 * 3600000).toISOString() }
    ]
  },
  {
    _id: "t3",
    title: "New Feature Request: PDF Export",
    description: "Client requested ability to export monthly usage reports as branded PDF documents.",
    status: "Resolved",
    priority: "Low",
    assignedTo: "Priya Nair",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    comments: []
  }
];

export const DEMO_CHATS = [
  {
    _id: "c1",
    customerName: "David Miller",
    status: "Active",
    lastMessage: "Thank you for the quick response regarding the API keys.",
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
    messages: [
      { sender: "David Miller", content: "Hello, I'm having trouble rotating my API keys.", createdAt: new Date(Date.now() - 15 * 60000).toISOString() },
      { sender: "Support Agent", content: "Hi David! I can help with that. Are you using the dashboard or the CLI?", createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
      { sender: "David Miller", content: "I'm using the dashboard. Found it! Thank you for the quick response regarding the API keys.", createdAt: new Date(Date.now() - 10 * 60000).toISOString() }
    ]
  },
  {
    _id: "c2",
    customerName: "Elena Rodriguez",
    status: "Waiting",
    lastMessage: "Is there an outage in the London region?",
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    messages: [
      { sender: "Elena Rodriguez", content: "Is there an outage in the London region?", createdAt: new Date(Date.now() - 5 * 60000).toISOString() }
    ]
  }
];

export const DEMO_CALLS = [
  {
    _id: "ca1",
    customerName: "James Wilson",
    duration: "12:45",
    type: "Inbound",
    status: "Completed",
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    transcript: "Customer reported intermittent connectivity issues in the mobile app. Guided through cache clearing steps. Issue resolved."
  },
  {
    _id: "ca2",
    customerName: "Sarah Jenkins",
    duration: "05:20",
    type: "Outbound",
    status: "Missed",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    transcript: ""
  }
];

