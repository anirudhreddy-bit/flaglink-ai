-- Run once against Turso (or any existing SQLite DB) if `user` already exists without billing columns.
-- Ignore errors if a column already exists.

ALTER TABLE user ADD COLUMN plan TEXT NOT NULL DEFAULT 'free';
ALTER TABLE user ADD COLUMN stripeCustomerId TEXT;
ALTER TABLE user ADD COLUMN stripeSubscriptionId TEXT;
