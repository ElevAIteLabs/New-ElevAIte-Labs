-- Arkin, the site chat assistant.
--
-- Three tables: the conversation, its messages, and a running spend total.
-- All additive; nothing here touches an existing table.

-- One row per visitor conversation. `token` is a random id the browser
-- holds in sessionStorage - it is the only thing tying a follow-up message
-- to its history, so it is indexed and unguessable rather than sequential.
--
-- `ip_hash` rather than the address itself: the rate limiter and the abuse
-- trail need to tell visitors apart, not to identify them, and a hash does
-- that without storing a personal identifier next to a transcript.
CREATE TABLE IF NOT EXISTS chat_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token CHAR(32) NOT NULL UNIQUE,
    ip_hash CHAR(64),
    user_agent VARCHAR(255),
    -- Which page the visitor opened the chat on. Worth more than it looks:
    -- it says which pages raise questions the page itself should answer.
    entry_path VARCHAR(255),
    turns INT NOT NULL DEFAULT 0,
    -- Set when Arkin captures a lead, so a transcript can be read next to
    -- the enquiry it produced.
    lead_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_chat_created (created_at),
    INDEX idx_chat_lead (lead_id)
);

-- The transcript. Stored in full because what visitors actually ask is the
-- best content research available, and because a lead with no context is
-- half a lead.
CREATE TABLE IF NOT EXISTS chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    role VARCHAR(16) NOT NULL,
    content MEDIUMTEXT,
    prompt_tokens INT NOT NULL DEFAULT 0,
    completion_tokens INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_msg_conversation (conversation_id, id)
);

-- Running spend, one row per calendar month.
--
-- A public endpoint pointed at a paid API is a money tap if it is abused,
-- and a cap that lives only in application memory is not a cap. This is
-- read before every request and written after, so the ceiling survives a
-- restart, a deploy, and concurrent requests.
CREATE TABLE IF NOT EXISTS chat_usage (
    ym CHAR(7) PRIMARY KEY,
    requests INT NOT NULL DEFAULT 0,
    prompt_tokens BIGINT NOT NULL DEFAULT 0,
    completion_tokens BIGINT NOT NULL DEFAULT 0,
    usd DECIMAL(10, 4) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
