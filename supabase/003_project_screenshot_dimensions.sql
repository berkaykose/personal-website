-- Paste this once into the Supabase project's SQL Editor (after 002_projects.sql).
-- Screenshot's real pixel dimensions are needed to render it without distortion at
-- its natural aspect ratio inside the "visual stage" (see ProjectScreenshot.tsx) —
-- an object-fit: contain box can't have a border/shadow that hugs the actual photo,
-- only sized width/height can.
alter table projects add column screenshot_width integer;
alter table projects add column screenshot_height integer;
