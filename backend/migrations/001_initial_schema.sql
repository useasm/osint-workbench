-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash BYTEA NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create index on email and username
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    permissions TEXT[] ARRAY,
    is_system BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO roles (name, description, is_system, permissions) VALUES
('admin', 'Administrator with full access', true, ARRAY['*']),
('analyst', 'Security analyst with case management access', true, ARRAY['case.create', 'case.read', 'case.update', 'case.delete', 'entity.create', 'entity.read', 'entity.update', 'entity.delete', 'tool.execute', 'finding.read']),
('viewer', 'Read-only access to cases and findings', true, ARRAY['case.read', 'entity.read', 'finding.read']),
('guest', 'Limited guest access', true, ARRAY['case.read:limited', 'entity.read:limited'])
ON CONFLICT DO NOTHING;

-- User roles junction table
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);

-- Cases table (investigations/projects)
CREATE TABLE cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    severity VARCHAR(50) DEFAULT 'medium',
    classification VARCHAR(50) DEFAULT 'internal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(user_id, name)
);

CREATE INDEX idx_cases_user_id ON cases(user_id);
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_created_at ON cases(created_at DESC);

-- Case members (collaboration)
CREATE TABLE case_members (
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'analyst', -- owner, analyst, viewer
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by UUID REFERENCES users(id),
    PRIMARY KEY (case_id, user_id)
);

CREATE INDEX idx_case_members_case_id ON case_members(case_id);
CREATE INDEX idx_case_members_user_id ON case_members(user_id);

-- Entities table (persons, companies, domains, IPs, etc)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- person, company, domain, ip, email, phone, username, social_account
    name VARCHAR(255) NOT NULL,
    description TEXT,
    tags TEXT[] ARRAY DEFAULT '{}',
    attributes JSONB DEFAULT '{}',
    confidence FLOAT DEFAULT 0.5,
    source VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(case_id, type, name)
);

CREATE INDEX idx_entities_case_id ON entities(case_id);
CREATE INDEX idx_entities_type ON entities(type);
CREATE INDEX idx_entities_name ON entities(name);
CREATE INDEX idx_entities_created_at ON entities(created_at DESC);

-- Entity aliases
CREATE TABLE entity_aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    alias_name VARCHAR(255),
    alias_type VARCHAR(50), -- alternate_name, username, email, phone
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entity_aliases_entity_id ON entity_aliases(entity_id);
CREATE INDEX idx_entity_aliases_alias_name ON entity_aliases(alias_name);

-- Relations between entities
CREATE TABLE relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    source_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    target_entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL, -- knows, works_at, owns_domain, same_ip, etc
    strength FLOAT DEFAULT 0.5, -- confidence 0.0-1.0
    evidence TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_relations_case_id ON relations(case_id);
CREATE INDEX idx_relations_source_entity_id ON relations(source_entity_id);
CREATE INDEX idx_relations_target_entity_id ON relations(target_entity_id);
CREATE INDEX idx_relations_type ON relations(relation_type);

-- Tool runs / OSINT execution
CREATE TABLE tool_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL, -- person_osint, email_osint, domain_osint, etc
    input_data JSONB,
    output_data JSONB,
    status VARCHAR(50) DEFAULT 'queued', -- queued, running, completed, failed
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tool_runs_case_id ON tool_runs(case_id);
CREATE INDEX idx_tool_runs_status ON tool_runs(status);
CREATE INDEX idx_tool_runs_tool_name ON tool_runs(tool_name);
CREATE INDEX idx_tool_runs_created_at ON tool_runs(created_at DESC);

-- Findings from analysis
CREATE TABLE findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tool_run_id UUID REFERENCES tool_runs(id),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- breach, weak_password, exposed_api, etc
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50) DEFAULT 'medium', -- critical, high, medium, low, info
    status VARCHAR(50) DEFAULT 'open', -- open, investigating, resolved, false_positive
    evidence JSONB,
    recommendation TEXT,
    tags TEXT[] ARRAY DEFAULT '{}',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE INDEX idx_findings_case_id ON findings(case_id);
CREATE INDEX idx_findings_severity ON findings(severity);
CREATE INDEX idx_findings_status ON findings(status);
CREATE INDEX idx_findings_type ON findings(type);
CREATE INDEX idx_findings_created_at ON findings(created_at DESC);

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL, -- create, read, update, delete, login, logout
    resource_type VARCHAR(50), -- case, entity, finding, report
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'success', -- success, failure, unauthorized
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Sessions
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    access_token_hash VARCHAR(64),
    refresh_token_hash VARCHAR(64),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(64) NOT NULL,
    name VARCHAR(255),
    scopes TEXT[] ARRAY DEFAULT '{}',
    rate_limit INT DEFAULT 1000,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, key_hash)
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);

-- Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
    title VARCHAR(255),
    format VARCHAR(50) DEFAULT 'pdf', -- pdf, html, json, csv
    content_type VARCHAR(100),
    file_size BIGINT,
    file_path TEXT,
    file_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    expires_at TIMESTAMP
);

CREATE INDEX idx_reports_case_id ON reports(case_id);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Update timestamps with trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cases_updated_at BEFORE UPDATE ON cases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON entities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
