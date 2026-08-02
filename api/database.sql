-- Database structure for ElevAIte Labs

-- Services Table
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT,
    description TEXT,
    eyebrow TEXT,
    features TEXT, -- Stored as JSON string
    image TEXT
);

-- Work Table

CREATE TABLE IF NOT EXISTS work (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT,
    description TEXT,
    industry TEXT,
    category TEXT,
    image TEXT,
    arkin_image TEXT,
    url TEXT
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    description TEXT,
    price TEXT,
    features TEXT, -- Stored as JSON string
    image TEXT
);

-- Learn Table
CREATE TABLE IF NOT EXISTS learn (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title TEXT,
    content TEXT,
    author TEXT,
    date TEXT
);

-- Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    company TEXT,
    text TEXT
);

-- Contact Table
CREATE TABLE IF NOT EXISTS contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email TEXT,
    phone TEXT,
    address TEXT
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_login DATETIME DEFAULT NULL
);

-- Default Admin (password is 'admin123')
INSERT INTO admins (username, password) 
VALUES ('admin', '$2y$10$8W3bFvKk6yM2zV.zL4lY.O0X3bFvKk6yM2zV.zL4lY.O0X3bFvK')
ON DUPLICATE KEY UPDATE username=username;

-- Default Contact Info
INSERT INTO contact (id, email, phone, address) 
VALUES (1, 'hello@elevaite.com', '+1 234 567 890', '123 AI Street, Tech City')
ON DUPLICATE KEY UPDATE email=VALUES(email);

-- Default Services
INSERT INTO services (eyebrow, title, description, features, image) VALUES 
('01 / Automation', 'AI Automation & Workflows', 'We replace the repetitive parts of your operation with agents that read, decide, and act — across email, CRM, calendars, and the rest of your stack.', '["Lead enrichment, scoring, and routing", "Email triage and response drafting", "CRM hygiene + automated data entry", "Approval workflows and ops dashboards"]', 'animations-arkin.png'),
('02 / Engineering', 'Web & Mobile App Development', 'Production apps for iOS, Android, and the web. Built with React, React Native, and Next.js — designed in-house, AI-native by default.', '["Consumer mobile apps", "SaaS dashboards and admin tools", "Marketing sites and e-commerce", "Internal tools that don\'t feel internal"]', 'Mobile-arkin.png'),
('03 / Conversational AI', 'Custom AI Agents', 'Domain-trained assistants that live where your customers already are: WhatsApp, your website, or your team\'s Slack.', '["WhatsApp Business API agents", "Site-embedded RAG Agents", "Internal Q&A bots over your docs", "Voice agents for inbound calls"]', 'Agent-arkin.png'),
('04 / Growth', 'Lead Generation Systems', 'End-to-end pipelines that source qualified leads, warm them up, and book the meeting — without burning out your sales team.', '["Outbound prospecting agents", "AI-personalized cold email and LinkedIn", "Inbound qualification + auto-booking", "Pipeline analytics and attribution"]', 'rightside-pointing-arkin.png'),
('05 / Content', 'AI Content Creation', 'Brand-trained content engines that draft, design, and ship — calibrated to your voice, not generic AI sludge.', '["Blog and SEO content systems", "Social-first short-form video pipelines", "Ad creative variants at scale", "Newsletter and email sequences"]', 'Arkin-Leftside-Pointing-Grey.png'),
('06 / Strategy', 'AI Strategy Consulting', 'A diagnostic, a roadmap, and a 90-day plan — so you stop guessing where AI fits in your business.', '["Operations audit and opportunity mapping", "Vendor/build/buy decision support", "Team training and enablement", "Quarterly review and re-prioritization"]', 'rightside-pointing-arkin.png');
