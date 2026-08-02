-- Blog posts for the Learn page.
--
-- The existing `learn` table holds short course/resource entries and is not
-- shaped for articles (no slug, no excerpt, no publish state), so posts get
-- their own table rather than overloading it.
--
-- slug is the URL segment under /learn/, so it must be unique.

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(191) NOT NULL UNIQUE,
    title TEXT,
    excerpt TEXT,
    content MEDIUMTEXT,
    image TEXT,
    author TEXT,
    read_time TEXT,
    tag TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_published (status, published_at)
);
