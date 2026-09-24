-- Publishing portal: writer accounts, post templates, keyword links.
--
-- Everything here is additive. The columns are nullable or defaulted so the
-- 16 posts that already exist keep working untouched, and so a half-applied
-- migration cannot break the live site.

-- Writers get their own login rather than sharing one. `role` decides what
-- the admin panel offers them: a writer sees Posts and nothing else, so an
-- employee publishing a blog cannot reach Leads, Services or Testimonials.
ALTER TABLE admins
    ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'admin' AFTER password;

-- Existing logins stay full admins; only new rows default to writer.
UPDATE admins SET role = 'admin' WHERE role = '' OR role IS NULL;

ALTER TABLE posts
    -- The <title> tag, when it should differ from the on-page headline.
    -- Falls back to `title` when blank, so it is safe to leave empty.
    ADD COLUMN meta_title TEXT NULL AFTER title,

    -- Which starter layout the writer chose. Recorded so we can tell later
    -- which shapes of article actually earn impressions.
    ADD COLUMN template VARCHAR(40) NULL AFTER content,

    -- JSON array of { keyword, url, rel, all }. Occurrences of `keyword` in
    -- the body become links to `url` when the article renders. Stored as TEXT
    -- rather than JSON so the column works on older MySQL on shared hosting.
    ADD COLUMN keywords TEXT NULL AFTER template,

    -- Which login wrote it. `author` stays free text because it is the byline
    -- shown to readers and is not always the account that typed it.
    ADD COLUMN author_id INT NULL AFTER author,

    ADD COLUMN views INT NOT NULL DEFAULT 0,
    ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- The article renderer looks posts up by slug on every uncached request.
CREATE INDEX idx_posts_slug_status ON posts (slug, status);
