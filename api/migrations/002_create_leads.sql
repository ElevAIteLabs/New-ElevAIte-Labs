-- Contact form submissions.
--
-- Every submission is written here before anything is emailed or forwarded,
-- so a lead is never lost when an external service is down. Previously the
-- form posted straight to EmailJS and the Kredoo webhook from the browser
-- and stored nothing, and the success screen showed regardless of failure.
--
-- delivery_* columns record what happened after the save, so failures are
-- visible in the admin panel instead of silent.

CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    phone VARCHAR(64),
    company VARCHAR(191),
    role VARCHAR(191),
    service VARCHAR(191),
    budget VARCHAR(64),
    message TEXT,
    source VARCHAR(64) NOT NULL DEFAULT 'Website Contact Form',
    ip VARCHAR(45),
    user_agent VARCHAR(255),
    mail_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    mail_error TEXT,
    webhook_status VARCHAR(20) NOT NULL DEFAULT 'pending',
    webhook_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created (created_at),
    INDEX idx_mail_status (mail_status)
);
