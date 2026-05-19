import type { BrainCategory, Channel } from "@/lib/types";

const aiNames = [
  "Julian Goldie SEO", "AyyazTech", "AI Foundations", "The AI Advantage",
  "Nate Herk | AI Automation", "Alex Followell | AI Automation", "Andy Lo",
  "Parker Prompts", "Mark Kashef", "Greg Isenberg", "Matt Wolfe", "AI LABS",
  "Futurepedia", "AI Agents By Jeff", "Skill Leap AI", "Chase AI",
  "Brock Mesarich | AI for Non Techies", "Cole Medin", "CodeSpace",
  "Frontier AI Labs", "Leon van Zyl", "Riley Brown", "Matt Penny | Applied AI",
  "Komal Bhojani", "Kris Torrington", "Lovable", "WesGPT",
  "Wyatt Roderick Extended", "Simon Hoiberg", "Python Programmer",
  "Linking Your Thinking with Nick Milo", "Tiago Forte", "Goda Go",
  "Automation Hackers", "Stephen G. Pope", "ByteByteGo", "ThePrimeagen",
  "Krish Naik", "Vizuara", "Cybernews", "AI Search", "Henrik Kniberg",
  "David Ondrej", "Your Average Tech Bro", "James Maduk | AI for Educators",
  "Income stream surfers", "Eugene Kadzin", "ICOR with Tom | AI Productivity",
  "Don Woodlock", "Robin Ebers", "Grace Leung", "Paul J Lipsky", "Jono Catliff",
  "Nick Automates", "Tao Prompts", "Rob Eason", "Jonathan Acuna - Doctor AI",
  "Zubair Trabzada | AI Workshop", "Wes Roth", "Website Learners",
  "Surfside PPC", "Semrush", "Surfer Academy", "GoBIG Systems",
  "Pesty Marketing", "Adrian Twarog", "Tech With Tim", "Moon Dev",
  "Yaqoob Developer", "Jameel | Full Stack Developer", "AsapGuide",
];

const datingNames = [
  "Distinguished Living", "Josef Smith", "Austen Summers", "Carter Weber",
  "A.G. Hayden", "Benjamin Seda", "Andy Wells", "AskToddV", "Todd V Dating",
  "Austin Dunham Dating", "Bobby Rio", "Casey Zander", "Danny Vera", "DateOn",
  "Elite Attraction", "Girls Chase", "Honest Signalz", "Jamie Social", "JostenJ",
  "Nick Notas", "Rob Judge", "The Attractive Man", "TheSingleGuy", "True Courage",
  "TextGod", "The Modern Schematics", "Orion Taraban", "Charisma on Command",
  "Vanessa Van Edwards", "Chase Hughes", "Dr Thomas Smithyman", "Christine Loveridge",
  "Two Mind Method", "ManTalks", "Bulldog Mindset", "Masculine Theory",
  "The Style O.G.", "Trey Bryant", "The Top Tier Man", "OlderBroSays",
  "Social Stoic", "Mindful Seduction", "Stop Losing Women with Harry Wilmington",
  "DOPELifeCoaching", "Chris Canwell", "TheDatingArts", "Honest Signalz",
  "The Dark Needle", "CXM",
];

const fitnessFoodNames = [
  "Thomas DeLauer", "Renaissance Periodization", "Jeff Nippard", "ATHLEAN-X",
  "Jeremy Ethier", "Andrew Kwong / DeltaBolic", "Dr. Pradip Jamnadas",
  "Dr. Will Bulsiewicz", "Paul Saladino MD", "Nick Norwitz MD PhD",
  "Dr. Michael Moeller", "Longevity Science News", "The Doctor's Kitchen",
  "Mark Hyman, MD", "Glucose Revolution", "Dr Karan", "Dr Dray",
  "motivationaldoc", "Body Hub", "Institute of Human Anatomy", "Squat University",
  "The Kneesovertoesguy", "Conor Harris", "RehabFix", "The Bioneer", "Bioforceman",
  "Dan Go", "Ryan Humiston", "musclemonsters", "Average To Jacked",
  "Brad Newton Fitness", "Adam Bunnell", "Adam Wolfe", "A Whey to Explain",
  "Flexible Dieting Lifestyle", "The Protein Chef", "Josh Cortis / The Meal Prep Manual",
  "Stealth Health Life", "SHREDHAPPENS", "Jalalsamfit", "Rahul Kamat",
  "fitfoodieselma", "Exercise4CheatMeals", "How To Cook Smarter",
  "The Big Man's World", "The Golden Balance", "Max the Meat Guy",
  "Tasting History with Max Miller", "LifebyMikeG", "Internet Shaquille",
  "NOT ANOTHER COOKING SHOW", "Feelgoodfoodie", "Cooking for Peanuts",
  "Carleigh Bodrug / PlantYou", "Primal Kitchen", "The Grid-Down Kitchen",
  "Boxing Science", "Dynamic Striking", "MyBoxingCoach", "Fight Lab", "FightFast",
  "Jesse Enkamp", "GracieBreakdown", "The Arena", "Sweet Science Boxing Gym",
  "Pad Flow", "Logan Brown Boxing", "Coach Britt / Las Vegas Combat Academy",
  "Bobby Maximus", "FitnessFAQs", "MovementbyDavid", "Yoga Dose", "Davis Diley",
  "eugene teo", "Nick Trigili | Biohacking & Performance Specialist", "Tim Burmaster",
  "Ben Winney", "Seth Capehart MD", "This Is Not Covered - Dr. Ashley Froese",
  "Dr. Matt Jones", "Living Youthful", "Rimon | Metabolic Architecture",
  "Leonid Kim MD", "The Health and Beauty Pharmacist", "FoodFix", "Health With Cory",
  "Healthier Than Yesterday", "The Science of Self-Care", "Aussie Fitness",
  "Baked Lean", "Balanced Treats", "Amanda | FitFoodAE", "Rahul Kamat",
  "Stefan Bodegrajac", "TylerButt_Eats", "The Protein Chef", "Matt Santos",
  "Mulligainz-Fitness", "Tom O'Connor - Weight Loss | Food Noise | Cravings",
  "Sober Fitness", "Boxing Science", "MyBoxingCoach", "Oracle Boxing",
  "Sweet Science Boxing Gym", "The Arena", "Dynamic Striking", "Jesse Enkamp",
  "GracieBreakdown",
];

const notes: Record<BrainCategory, string> = {
  ai: "Track tools, agents, automation, SEO, coding workflows, and business systems. Base44-style builders belong in notes when relevant.",
  dating: "Track dating, communication, confidence, signals, style, and behavior patterns.",
  "fitness-food": "Track training, food, boxing, longevity, recovery, gut health, and weekly actions.",
};

function priorityFor(index: number): Channel["priority"] {
  if (index < 12) return "core";
  if (index < 38) return "useful";
  return "low";
}

function toChannels(names: string[], category: BrainCategory): Channel[] {
  return names.map((name, index) => ({
    name,
    category,
    priority: priorityFor(index),
    notes: notes[category],
  }));
}

export const channels: Channel[] = [
  ...toChannels(aiNames, "ai"),
  ...toChannels(datingNames, "dating"),
  ...toChannels(fitnessFoodNames, "fitness-food"),
];

export function getChannelsByCategory(category: BrainCategory) {
  return channels.filter((channel) => channel.category === category);
}
