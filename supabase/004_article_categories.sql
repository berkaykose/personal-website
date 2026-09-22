-- Run this migration for existing databases that were created with schema.sql.
-- It replaces the old frontend/backend-only check with a bounded free-form category.
alter table articles drop constraint if exists articles_category_check;

alter table articles
  add constraint articles_category_check
  check (char_length(btrim(category)) between 1 and 80);
