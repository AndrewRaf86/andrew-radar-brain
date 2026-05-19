-- Starter YouTube channels for Andrew Radar Brain.
-- Fill in real yt_channel_id values manually before running ingestion.
-- rss_url can be left null; the app builds it from yt_channel_id when present.
-- Do not use fake channel IDs.

insert into youtube_channels (name, yt_channel_id, rss_url, url, category, priority, is_active)
values
  ('The AI Advantage', null, null, 'https://www.youtube.com/@TheAIAdvantage', 'AI Brain', 2, true),
  ('Nate Herk | AI Automation', null, null, 'https://www.youtube.com/@nateherk', 'AI Brain', 2, true),
  ('Matt Wolfe', null, null, 'https://www.youtube.com/@mreflow', 'AI Brain', 3, true),
  ('Skill Leap AI', null, null, 'https://www.youtube.com/@SkillLeapAI', 'AI Brain', 3, true),
  ('Todd V Dating', null, null, 'https://www.youtube.com/@ToddVDating', 'Dating Brain', 2, true),
  ('TextGod', null, null, 'https://www.youtube.com/@TextGod', 'Dating Brain', 3, true),
  ('Nick Notas', null, null, 'https://www.youtube.com/@NickNotas', 'Dating Brain', 3, true),
  ('Renaissance Periodization', null, null, 'https://www.youtube.com/@RenaissancePeriodization', 'Fitness/Food Brain', 2, true),
  ('Jeff Nippard', null, null, 'https://www.youtube.com/@JeffNippard', 'Fitness/Food Brain', 2, true),
  ('The Protein Chef', null, null, 'https://www.youtube.com/@TheProteinChef', 'Fitness/Food Brain', 3, true);
