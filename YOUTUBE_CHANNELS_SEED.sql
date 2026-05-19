-- Curated starter YouTube channels for Andrew Radar Brain.
-- Run after PERSONAL_BRAIN_SCHEMA.sql.
-- This seed is idempotent by name and url checks. It does not require a unique constraint.
-- yt_channel_id and rss_url are intentionally null when unknown; /api/youtube/scan resolves @handle URLs where possible.
-- Rows with null url need manual verification before they can be scanned.

with seed (name, yt_channel_id, rss_url, url, category, priority, is_active) as (
  values
    ('The AI Advantage', null, null, 'https://www.youtube.com/@aiadvantage', 'AI Brain', 1, true),
    ('Nate Herk AI Automation', null, null, 'https://www.youtube.com/@nateherk', 'AI Brain', 1, true),
    ('AI Foundations', null, null, null, 'AI Brain', 2, true),
    ('AI LABS', null, null, null, 'AI Brain', 2, true),
    ('AI Search', null, null, null, 'AI Brain', 2, true),
    ('Alex Followell AI Automation', null, null, null, 'AI Brain', 2, true),
    ('Andy Lo', null, null, null, 'AI Brain', 3, true),
    ('AyyazTech', null, null, 'https://www.youtube.com/@AyyazTech', 'AI Brain', 2, true),
    ('Brock Mesarich', null, null, null, 'AI Brain', 2, true),
    ('ByteByteGo', null, null, 'https://www.youtube.com/@ByteByteGo', 'AI Brain', 1, true),
    ('Chase AI', null, null, null, 'AI Brain', 2, true),
    ('CodeSpace', null, null, null, 'AI Brain', 2, true),
    ('Cole Medin', null, null, 'https://www.youtube.com/@ColeMedin', 'AI Brain', 1, true),
    ('Don Woodlock', null, null, null, 'AI Brain', 3, true),
    ('Frontier AI Labs', null, null, null, 'AI Brain', 2, true),
    ('Futurepedia', null, null, 'https://www.youtube.com/@Futurepedia', 'AI Brain', 1, true),
    ('Greg Isenberg', null, null, 'https://www.youtube.com/@GregIsenberg', 'AI Brain', 1, true),
    ('Henrik Kniberg', null, null, 'https://www.youtube.com/@henrikkniberg', 'AI Brain', 2, true),
    ('ICOR with Tom', null, null, null, 'AI Brain', 2, true),
    ('James Maduk AI for Educators', null, null, null, 'AI Brain', 3, true),
    ('Julian Goldie SEO', null, null, 'https://www.youtube.com/@JulianGoldieSEO', 'AI Brain', 2, true),
    ('Krish Naik', null, null, 'https://www.youtube.com/@krishnaik06', 'AI Brain', 1, true),
    ('Liam Ottley', null, null, 'https://www.youtube.com/@LiamOttley', 'AI Brain', 2, true),
    ('Lovable', null, null, 'https://www.youtube.com/@lovable-dev', 'AI Brain', 1, true),
    ('Mark Kashef', null, null, null, 'AI Brain', 2, true),
    ('Matt Penny Applied AI', null, null, null, 'AI Brain', 2, true),
    ('Matt Wolfe', null, null, 'https://www.youtube.com/@mreflow', 'AI Brain', 1, true),
    ('Nick Automates', null, null, null, 'AI Brain', 2, true),
    ('Parker Prompts', null, null, null, 'AI Brain', 2, true),
    ('Riley Brown', null, null, 'https://www.youtube.com/@rileybrownai', 'AI Brain', 2, true),
    ('Skill Leap AI', null, null, 'https://www.youtube.com/@SkillLeapAI', 'AI Brain', 1, true),
    ('Stephen G. Pope', null, null, 'https://www.youtube.com/@StephenGPope', 'AI Brain', 2, true),
    ('Tech With Tim', null, null, 'https://www.youtube.com/@TechWithTim', 'AI Brain', 2, true),
    ('ThePrimeagen', null, null, 'https://www.youtube.com/@ThePrimeagen', 'AI Brain', 2, true),
    ('Wes Roth', null, null, 'https://www.youtube.com/@WesRoth', 'AI Brain', 1, true),

    ('Todd V Dating', null, null, 'https://www.youtube.com/@ToddVDating', 'Dating Brain', 1, true),
    ('TextGod', null, null, 'https://www.youtube.com/@TextGod', 'Dating Brain', 1, true),
    ('Austen Summers', null, null, 'https://www.youtube.com/@AustenSummers', 'Dating Brain', 2, true),
    ('Austin Dunham Dating', null, null, 'https://www.youtube.com/@AustinDunhamDating', 'Dating Brain', 2, true),
    ('Benjamin Seda', null, null, null, 'Dating Brain', 2, true),
    ('Bobby Rio', null, null, 'https://www.youtube.com/@BobbyRio', 'Dating Brain', 2, true),
    ('Casey Zander', null, null, 'https://www.youtube.com/@CaseyZander', 'Dating Brain', 2, true),
    ('Charisma on Command', null, null, 'https://www.youtube.com/@Charismaoncommand', 'Dating Brain', 1, true),
    ('DateOn', null, null, null, 'Dating Brain', 3, true),
    ('Girls Chase', null, null, 'https://www.youtube.com/@GirlsChase', 'Dating Brain', 2, true),
    ('Honest Signalz', null, null, null, 'Dating Brain', 2, true),
    ('Jamie Social', null, null, 'https://www.youtube.com/@JamieSocial', 'Dating Brain', 2, true),
    ('Nick Notas', null, null, 'https://www.youtube.com/@NickNotas', 'Dating Brain', 1, true),
    ('Vanessa Van Edwards', null, null, 'https://www.youtube.com/@VanessaVanEdwardsYT', 'Dating Brain', 1, true),
    ('Heidi Priebe', null, null, 'https://www.youtube.com/@heidipriebe1', 'Dating Brain', 2, true),

    ('Jeff Nippard', null, null, 'https://www.youtube.com/@JeffNippard', 'Health/Fitness/Food Brain', 1, true),
    ('Jeremy Ethier', null, null, 'https://www.youtube.com/@JeremyEthier', 'Health/Fitness/Food Brain', 1, true),
    ('Renaissance Periodization', null, null, 'https://www.youtube.com/@RenaissancePeriodization', 'Health/Fitness/Food Brain', 1, true),
    ('ATHLEAN-X', null, null, 'https://www.youtube.com/@athleanx', 'Health/Fitness/Food Brain', 2, true),
    ('Squat University', null, null, 'https://www.youtube.com/@SquatUniversity', 'Health/Fitness/Food Brain', 1, true),
    ('The Kneesovertoesguy', null, null, 'https://www.youtube.com/@TheKneesovertoesguy', 'Health/Fitness/Food Brain', 2, true),
    ('Thomas DeLauer', null, null, 'https://www.youtube.com/@ThomasDeLauerOfficial', 'Health/Fitness/Food Brain', 2, true),
    ('Andrew Kwong DeltaBolic', null, null, null, 'Health/Fitness/Food Brain', 2, true),
    ('Dan Go', null, null, 'https://www.youtube.com/@DanGo', 'Health/Fitness/Food Brain', 2, true),
    ('Dr. Eric Berg', null, null, 'https://www.youtube.com/@Drberg', 'Health/Fitness/Food Brain', 3, true),
    ('Dr. Will Bulsiewicz', null, null, 'https://www.youtube.com/@DrBulsiewicz', 'Health/Fitness/Food Brain', 2, true),
    ('Nick Norwitz MD PhD', null, null, 'https://www.youtube.com/@nicknorwitzPhD', 'Health/Fitness/Food Brain', 2, true),
    ('The Doctor''s Kitchen', null, null, 'https://www.youtube.com/@TheDoctorsKitchen', 'Health/Fitness/Food Brain', 2, true),
    ('Glucose Revolution', null, null, 'https://www.youtube.com/@GlucoseRevolution', 'Health/Fitness/Food Brain', 2, true),
    ('The Protein Chef', null, null, 'https://www.youtube.com/@TheProteinChef', 'Health/Fitness/Food Brain', 1, true),
    ('Stealth Health Life', null, null, 'https://www.youtube.com/@stealth_health_life', 'Health/Fitness/Food Brain', 2, true),
    ('Shred Happens', null, null, 'https://www.youtube.com/@shredhappens', 'Health/Fitness/Food Brain', 2, true),
    ('Jalalsamfit', null, null, 'https://www.youtube.com/@jalalsamfit', 'Health/Fitness/Food Brain', 2, true),
    ('Exercise4CheatMeals', null, null, 'https://www.youtube.com/@Exercise4CheatMeals', 'Health/Fitness/Food Brain', 2, true),
    ('Ryan Humiston', null, null, 'https://www.youtube.com/@RyanHumiston', 'Health/Fitness/Food Brain', 2, true),
    ('The Bioneer', null, null, 'https://www.youtube.com/@TheBioneer', 'Health/Fitness/Food Brain', 2, true),
    ('Boxing Science', null, null, 'https://www.youtube.com/@BoxingScience', 'Health/Fitness/Food Brain', 2, true),
    ('MyBoxingCoach', null, null, 'https://www.youtube.com/@myboxingcoach', 'Health/Fitness/Food Brain', 2, true),
    ('Internet Shaquille', null, null, 'https://www.youtube.com/@internetshaquille', 'Health/Fitness/Food Brain', 3, true),
    ('Institute of Human Anatomy', null, null, 'https://www.youtube.com/@TheAnatomyLab', 'Health/Fitness/Food Brain', 2, true)
)
insert into youtube_channels (name, yt_channel_id, rss_url, url, category, priority, is_active)
select name, yt_channel_id, rss_url, url, category, priority, is_active
from seed
where not exists (
  select 1
  from youtube_channels existing
  where lower(existing.name) = lower(seed.name)
     or (existing.url is not null and seed.url is not null and lower(existing.url) = lower(seed.url))
);

update youtube_channels
set category = 'Health/Fitness/Food Brain'
where category in (
  'Fitness/Food Brain',
  'Fitness Brain',
  'Health Brain',
  'Boxing Brain',
  'Boxing',
  'Fitness/Food'
);
