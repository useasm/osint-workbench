// ──────────────────────────────────────────────────────────────────────────
// Mock data for OSINT Workbench (frontend-only, no backend).
// Everything here is static and safe to render. No API calls anywhere.
// ──────────────────────────────────────────────────────────────────────────

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
export type CaseStatus = 'Active' | 'In Review' | 'Closed' | 'Archived'
export type FindingStatus = 'Open' | 'In Progress' | 'Resolved' | 'Triaged'
export type EntityType =
  | 'email'
  | 'phone'
  | 'domain'
  | 'ip'
  | 'person'
  | 'username'
  | 'organization'
  | 'wallet'

export interface Case {
  id: number
  name: string
  description: string
  entities: number
  findings: number
  severity: Severity
  status: CaseStatus
  date: string
}

export interface Finding {
  id: number
  title: string
  severity: Severity
  status: FindingStatus
  case: string
  date: string
}

export interface Entity {
  id: number
  name: string
  type: EntityType
  confidence: number
  source: string
  date: string
}

export interface Relation {
  id: number
  from: string
  to: string
  label: string
  confidence: number
}

export interface DashboardStat {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'flat'
  accent: 'green' | 'red' | 'cyan' | 'orange'
}

// ── Cases ───────────────────────────────────────────────────────────────────
export const mockCases: Case[] = [
  {
    id: 1,
    name: 'APT-2024-001',
    description: 'Tracking infrastructure of a suspected state-sponsored threat actor.',
    entities: 12,
    findings: 8,
    severity: 'Critical',
    status: 'Active',
    date: '2 hours ago',
  },
  {
    id: 2,
    name: 'TargetCorp-Pentest',
    description: 'External attack-surface mapping for an authorized red-team engagement.',
    entities: 23,
    findings: 15,
    severity: 'High',
    status: 'Active',
    date: '1 day ago',
  },
  {
    id: 3,
    name: 'PhishKit-Takedown',
    description: 'Phishing kit attribution and hosting-provider abuse reporting.',
    entities: 9,
    findings: 4,
    severity: 'Medium',
    status: 'In Review',
    date: '3 days ago',
  },
  {
    id: 4,
    name: 'Insider-Leak-77',
    description: 'Investigation into leaked internal credentials surfaced on paste sites.',
    entities: 17,
    findings: 11,
    severity: 'High',
    status: 'Active',
    date: '5 days ago',
  },
  {
    id: 5,
    name: 'CryptoScam-Recon',
    description: 'Wallet clustering and social-graph analysis of a rug-pull operation.',
    entities: 31,
    findings: 6,
    severity: 'Medium',
    status: 'In Review',
    date: '1 week ago',
  },
  {
    id: 6,
    name: 'Vendor-Due-Diligence',
    description: 'Pre-acquisition footprint review of a third-party SaaS supplier.',
    entities: 14,
    findings: 2,
    severity: 'Low',
    status: 'Closed',
    date: '2 weeks ago',
  },
  {
    id: 7,
    name: 'Brand-Impersonation-Q2',
    description: 'Lookalike-domain monitoring and social impersonation sweep.',
    entities: 20,
    findings: 9,
    severity: 'High',
    status: 'Active',
    date: '3 weeks ago',
  },
  {
    id: 8,
    name: 'Legacy-Audit-2023',
    description: 'Archived footprint audit retained for compliance reference.',
    entities: 8,
    findings: 1,
    severity: 'Info',
    status: 'Archived',
    date: 'Mar 14',
  },
]

// ── Findings ──────────────────────────────────────────────────────────────
export const mockFindings: Finding[] = [
  {
    id: 1,
    title: 'SQL Injection in Login',
    severity: 'Critical',
    status: 'In Progress',
    case: 'APT-2024-001',
    date: '1 hour ago',
  },
  {
    id: 2,
    title: 'Exposed .env with live API keys',
    severity: 'Critical',
    status: 'Open',
    case: 'TargetCorp-Pentest',
    date: '4 hours ago',
  },
  {
    id: 3,
    title: 'Subdomain takeover on assets.target',
    severity: 'High',
    status: 'Triaged',
    case: 'TargetCorp-Pentest',
    date: '6 hours ago',
  },
  {
    id: 4,
    title: 'Reused credentials in breach dump',
    severity: 'High',
    status: 'In Progress',
    case: 'Insider-Leak-77',
    date: '1 day ago',
  },
  {
    id: 5,
    title: 'Open S3 bucket with PII export',
    severity: 'Critical',
    status: 'Open',
    case: 'Insider-Leak-77',
    date: '1 day ago',
  },
  {
    id: 6,
    title: 'Wildcard certificate near expiry',
    severity: 'Medium',
    status: 'Resolved',
    case: 'Vendor-Due-Diligence',
    date: '2 days ago',
  },
  {
    id: 7,
    title: 'Lookalike domain registered',
    severity: 'Medium',
    status: 'Open',
    case: 'Brand-Impersonation-Q2',
    date: '2 days ago',
  },
  {
    id: 8,
    title: 'Phishing kit hosted on shared IP',
    severity: 'High',
    status: 'Triaged',
    case: 'PhishKit-Takedown',
    date: '3 days ago',
  },
  {
    id: 9,
    title: 'Outdated jQuery with known XSS',
    severity: 'Low',
    status: 'Resolved',
    case: 'TargetCorp-Pentest',
    date: '4 days ago',
  },
  {
    id: 10,
    title: 'Metadata leak in published PDF',
    severity: 'Info',
    status: 'Resolved',
    case: 'Legacy-Audit-2023',
    date: '1 week ago',
  },
]

// ── Entities ──────────────────────────────────────────────────────────────
export const mockEntities: Entity[] = [
  { id: 1, name: 'john@example.com', type: 'email', confidence: 95, source: 'Hunter', date: 'May 15' },
  { id: 2, name: '+1 415 555 0142', type: 'phone', confidence: 82, source: 'Truecaller', date: 'May 15' },
  { id: 3, name: 'target-corp.com', type: 'domain', confidence: 99, source: 'WHOIS', date: 'May 14' },
  { id: 4, name: '185.220.101.47', type: 'ip', confidence: 90, source: 'Shodan', date: 'May 14' },
  { id: 5, name: 'Jane A. Doe', type: 'person', confidence: 76, source: 'LinkedIn', date: 'May 13' },
  { id: 6, name: '@gh0st_recon', type: 'username', confidence: 68, source: 'Sherlock', date: 'May 13' },
  { id: 7, name: 'Acme Holdings LLC', type: 'organization', confidence: 88, source: 'OpenCorporates', date: 'May 12' },
  { id: 8, name: 'bc1q…k3f9', type: 'wallet', confidence: 71, source: 'Chainalysis', date: 'May 12' },
  { id: 9, name: 'admin@target-corp.com', type: 'email', confidence: 93, source: 'Hunter', date: 'May 11' },
  { id: 10, name: 'mail.target-corp.com', type: 'domain', confidence: 97, source: 'crt.sh', date: 'May 11' },
  { id: 11, name: '45.83.220.9', type: 'ip', confidence: 84, source: 'Censys', date: 'May 10' },
  { id: 12, name: '@target_official', type: 'username', confidence: 64, source: 'Maigret', date: 'May 10' },
]

// ── Relations (graph edges) ─────────────────────────────────────────────────
export const mockRelations: Relation[] = [
  { id: 1, from: 'john@example.com', to: 'target-corp.com', label: 'registered_with', confidence: 91 },
  { id: 2, from: 'target-corp.com', to: '185.220.101.47', label: 'resolves_to', confidence: 99 },
  { id: 3, from: 'Jane A. Doe', to: '@gh0st_recon', label: 'controls', confidence: 73 },
  { id: 4, from: '@gh0st_recon', to: 'bc1q…k3f9', label: 'linked_to', confidence: 67 },
  { id: 5, from: 'Acme Holdings LLC', to: 'target-corp.com', label: 'owns', confidence: 88 },
  { id: 6, from: 'admin@target-corp.com', to: 'mail.target-corp.com', label: 'hosted_on', confidence: 95 },
]

// ── Dashboard stats ─────────────────────────────────────────────────────────
export const mockStats: DashboardStat[] = [
  { label: 'Active cases', value: '5', delta: '+2 this week', trend: 'up', accent: 'cyan' },
  { label: 'Entities found', value: '134', delta: '+18 today', trend: 'up', accent: 'green' },
  { label: 'Critical findings', value: '4', delta: '+1 today', trend: 'up', accent: 'red' },
]

// ── Case detail (overview tab) ──────────────────────────────────────────────
export interface CaseOverviewStat {
  label: string
  value: string
  accent: 'green' | 'red' | 'cyan' | 'orange'
}

export const mockCaseOverview: CaseOverviewStat[] = [
  { label: 'Entities', value: '12', accent: 'cyan' },
  { label: 'Findings', value: '8', accent: 'orange' },
  { label: 'Relations', value: '6', accent: 'green' },
  { label: 'Critical', value: '3', accent: 'red' },
]

export const mockActivity: { id: number; text: string; time: string; accent: DashboardStat['accent'] }[] = [
  { id: 1, text: 'Entity 185.220.101.47 added from Shodan', time: '12m ago', accent: 'cyan' },
  { id: 2, text: 'Finding “SQL Injection in Login” escalated to Critical', time: '1h ago', accent: 'red' },
  { id: 3, text: 'Relation resolves_to confirmed (99%)', time: '3h ago', accent: 'green' },
  { id: 4, text: 'Report draft v2 generated', time: '5h ago', accent: 'orange' },
  { id: 5, text: 'Case shared with analyst @m.rivera', time: '1d ago', accent: 'cyan' },
]

// Search "scopes" used by the SearchPage.
export const searchScopes: { id: EntityType | 'name'; label: string; placeholder: string }[] = [
  { id: 'phone', label: 'Phone', placeholder: '+1 415 555 0142' },
  { id: 'email', label: 'Email', placeholder: 'target@example.com' },
  { id: 'domain', label: 'Domain', placeholder: 'target-corp.com' },
  { id: 'ip', label: 'IP', placeholder: '185.220.101.47' },
  { id: 'name', label: 'Name', placeholder: 'Jane Doe' },
]

// Mock signed-in user for the profile/header.
export const mockUser = {
  name: 'M. Rivera',
  username: 'm.rivera',
  email: 'm.rivera@example.com',
  role: 'Lead Analyst',
  initials: 'MR',
  joined: 'Jan 2024',
}
