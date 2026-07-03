export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  featured: boolean;
  breaking: boolean;
};

export const categories = [
  { name: "Home", slug: "/" },
  { name: "Politics", slug: "politics" },
  { name: "Business", slug: "business" },
  { name: "Sports", slug: "sports" },
  { name: "Entertainment", slug: "entertainment" },
  { name: "Technology", slug: "technology" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "Crime", slug: "crime" },
];

export const articles: Article[] = [
  {
    id: 1,
    slug: "gujarat-infrastructure-development-highway-project",
    title: "Gujarat Announces Major Highway Expansion Project Worth ₹15,000 Crore",
    excerpt: "The state government has unveiled an ambitious highway expansion plan connecting 12 major cities, promising to cut travel time by nearly half.",
    content: `
<p>The Gujarat state government announced a landmark infrastructure project on Thursday, revealing plans to expand and modernise major highway corridors connecting 12 cities across the state at an estimated investment of ₹15,000 crore.</p>

<p>Chief Minister unveiled the project during a press conference in Gandhinagar, calling it "the most significant infrastructure initiative in the state's history." The expansion will cover over 2,400 kilometres of road network and is expected to be completed in three phases over the next five years.</p>

<h2>Key Highlights</h2>
<p>The first phase, budgeted at ₹5,200 crore, will focus on the Ahmedabad-Rajkot-Jamnagar corridor — one of the busiest stretches in the state. Authorities expect travel time on this route to drop from nearly five hours to under three.</p>

<p>Phase two will connect Surat, Vadodara, and Bharuch with four-lane expressways, while the final phase tackles the Kutch and Saurashtra regions, which have historically seen slower infrastructure growth.</p>

<h2>Economic Impact</h2>
<p>According to a government report, the project is expected to generate over 50,000 direct construction jobs and an estimated 1.5 lakh indirect jobs in logistics, transport, and associated services. Economists have noted that improved road connectivity could add 0.8 to 1.2 percentage points to the state's GDP growth annually once complete.</p>

<p>The project will be partially funded through the National Infrastructure Pipeline (NIP) and the rest through state bonds and public-private partnerships. Several Japanese and German infrastructure firms have already expressed interest in bidding for contracts.</p>

<p>"This is not just about roads," said a senior government official. "It is about connecting people, reducing logistics costs for our industries, and making Gujarat the undisputed gateway for trade in western India."</p>

<p>Opposition parties have welcomed the announcement but called for transparency in the tendering process, citing concerns about past delays in infrastructure projects in the state.</p>
    `,
    category: "Politics",
    categorySlug: "politics",
    author: "Ramesh Patel",
    publishedAt: "2025-07-03T08:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&q=80",
    featured: true,
    breaking: false,
  },
  {
    id: 2,
    slug: "india-cricket-team-wins-test-series",
    title: "India Clinch Test Series 3-1 Against Australia in Thrilling Final Match",
    excerpt: "A stunning century from Shubman Gill and five wickets from Jasprit Bumrah sealed a memorable victory for the Men in Blue at Melbourne.",
    content: `
<p>India secured a historic 3-1 Test series victory over Australia at the Melbourne Cricket Ground on Wednesday, with a comprehensive 8-wicket win that had the travelling Indian fans in raptures.</p>

<p>Shubman Gill anchored India's chase with a magnificent 134 not out, his third century of the series, while Jasprit Bumrah's five-wicket haul earlier in the day had skittled Australia for just 189 in their second innings.</p>

<h2>Bumrah's Brilliance</h2>
<p>Bumrah, who was rested for the third Test, returned with a point to prove and delivered a performance that will be remembered for years. He dismissed Pat Cummins, Steve Smith, Marnus Labuschagne, Mitchell Marsh, and Nathan Lyon in a devastating 12-over spell that broke the Australian middle order's resistance.</p>

<p>His final figures of 5 for 42 took his series tally to 28 wickets — the most by any bowler in an away series against Australia in the last two decades.</p>

<h2>Gill's Masterclass</h2>
<p>Chasing 219 to win, India lost Rohit Sharma cheaply, but Gill batted with serene authority. He found an able partner in Virat Kohli (54*), and the two put on an unbroken stand of 147 that made the game look far easier than it was on a pitch that had offered considerable assistance to the pacers throughout the match.</p>

<p>The victory is India's first series win in Australia in 22 years and ends a long chapter of near-misses and heartbreaks.</p>
    `,
    category: "Sports",
    categorySlug: "sports",
    author: "Sunil Mehta",
    publishedAt: "2025-07-03T07:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1540747913346-19212a4b423d?w=800&q=80",
    featured: false,
    breaking: true,
  },
  {
    id: 3,
    slug: "sensex-hits-record-high",
    title: "Sensex Crosses 85,000 Mark for First Time on Strong FII Inflows",
    excerpt: "Indian equity markets surged to a fresh all-time high as foreign institutional investors pumped over ₹8,200 crore into Indian stocks in a single session.",
    content: `
<p>The BSE Sensex breached the 85,000 mark for the first time in history on Thursday, closing at 85,247 — a gain of 1,134 points or 1.35% — driven by a massive surge in foreign institutional investor (FII) buying and strong domestic economic data.</p>

<p>The Nifty 50 similarly closed at a fresh peak of 25,934, up 1.28%, with broad-based gains across sectors.</p>

<h2>What Drove the Rally</h2>
<p>FIIs pumped ₹8,247 crore into Indian equities in a single day — the highest single-session inflow in nearly eight months. Analysts attributed this to a combination of factors: expectations of a US Federal Reserve rate cut in September, India's improving GDP forecast (revised upward to 7.2% by the IMF), and strong June quarter earnings from India's top IT and banking companies.</p>

<p>Banking stocks led the charge, with the Bank Nifty index rising 2.1%. HDFC Bank, ICICI Bank, and Axis Bank all gained between 1.5% and 3%.</p>

<h2>Expert Views</h2>
<p>"The macro fundamentals for India have never been stronger. We are seeing a convergence of strong earnings growth, manageable inflation, and improving fiscal metrics that is attracting global capital," said a senior fund manager at a leading domestic asset management company.</p>

<p>However, some analysts cautioned that valuations at current levels warrant selectivity. "At 23x forward earnings, the market is pricing in a lot of good news. Investors should be selective and focus on quality earnings growth," said a market strategist.</p>
    `,
    category: "Business",
    categorySlug: "business",
    author: "Priya Shah",
    publishedAt: "2025-07-03T09:15:00Z",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    featured: false,
    breaking: true,
  },
  {
    id: 4,
    slug: "bollywood-film-breaks-opening-day-record",
    title: "Blockbuster Opens to ₹180 Crore on Day One, Breaks All Opening Day Records",
    excerpt: "The most anticipated Bollywood release of 2025 shattered box office records, collecting ₹180 crore net on its opening day across India and overseas.",
    content: `
<p>In what trade analysts are calling the most spectacular opening in Indian cinema history, the year's biggest Bollywood release collected ₹180 crore net on its first day, obliterating the previous record by nearly ₹40 crore.</p>

<p>The film saw houseful shows across multiplexes and single-screen theatres nationwide, with fans lining up for early-morning shows as early as 4 AM in cities like Mumbai, Delhi, and Ahmedabad.</p>

<h2>Record-Breaking Numbers</h2>
<p>Mumbai contributed the highest single-city collection at ₹28.5 crore, followed by Delhi NCR at ₹22 crore. The overseas market added another ₹45 crore, predominantly from the US, UK, and Gulf markets, taking the worldwide gross past ₹230 crore on day one alone.</p>

<p>Advance bookings had crossed ₹90 crore before the film even released — another industry milestone — signalling the unprecedented fan frenzy surrounding the project.</p>

<h2>Critical Reception</h2>
<p>The film has earned near-universal praise from critics, scoring an 8.9/10 on Filmibeat and a 94% approval rating on a leading review aggregator. Reviewers particularly highlighted the lead actor's performance and the director's ambitious visual storytelling.</p>

<p>"This is the film that will define Indian cinema for the next decade," wrote a leading film critic. "It is technically brilliant, emotionally devastating, and utterly unmissable."</p>
    `,
    category: "Entertainment",
    categorySlug: "entertainment",
    author: "Kavita Nair",
    publishedAt: "2025-07-02T18:45:00Z",
    imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    featured: false,
    breaking: false,
  },
  {
    id: 5,
    slug: "isro-aditya-l1-solar-data",
    title: "ISRO's Aditya-L1 Sends Back Stunning Solar Corona Images, Scientists Elated",
    excerpt: "India's first solar mission has transmitted high-resolution images of the sun's corona, revealing previously unseen detail in solar flare activity.",
    content: `
<p>Scientists at the Indian Space Research Organisation (ISRO) are celebrating after the Aditya-L1 spacecraft successfully transmitted the clearest images ever captured of the sun's outer atmosphere — the corona — providing data that could unlock secrets about solar storms and their impact on Earth.</p>

<p>The images, captured by the VELC (Visible Emission Line Coronagraph) instrument, show intricate loops and arches of plasma extending millions of kilometres into space, with a resolution that surpasses what existing ground-based telescopes can achieve.</p>

<h2>Scientific Significance</h2>
<p>"What we are seeing in these images is completely new. We can observe the base of solar wind formation in real time. This is data that has never been captured before at this resolution," said ISRO's project director for the mission.</p>

<p>The data will help scientists better understand coronal mass ejections (CMEs) — massive bursts of solar wind that can interfere with satellite communications, power grids, and GPS systems on Earth.</p>

<h2>What Comes Next</h2>
<p>ISRO scientists said Aditya-L1 has enough fuel to operate for at least five more years in its halo orbit around the first Lagrange point (L1), approximately 1.5 million kilometres from Earth — a location that provides an unobstructed view of the sun at all times.</p>

<p>The mission has already exceeded several of its primary objectives ahead of schedule, prompting discussions internally about whether additional scientific goals can be added to the mission plan.</p>
    `,
    category: "Technology",
    categorySlug: "technology",
    author: "Dr. Anand Iyer",
    publishedAt: "2025-07-02T11:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    featured: false,
    breaking: false,
  },
  {
    id: 6,
    slug: "ahmedabad-metro-phase-2-update",
    title: "Ahmedabad Metro Phase 2 on Track for 2026 Launch, 12 New Stations Ready",
    excerpt: "Civil construction on 12 of the 22 new stations in Ahmedabad Metro Phase 2 is complete, with trial runs expected to begin by December.",
    content: `
<p>The Ahmedabad Metro Rail Corporation announced Thursday that 12 of the planned 22 new stations in Phase 2 of the city's metro network have completed civil construction, with the project firmly on track for a commercial launch by mid-2026.</p>

<p>Phase 2 will extend the metro network by 28.2 kilometres and add two new lines connecting the eastern and northern parts of the city to the existing network — a development that urban mobility experts say will transform daily commutes for over 8 lakh residents.</p>

<h2>Progress Report</h2>
<p>Tunnelling work on the underground section, widely considered the most challenging component of the project, is 78% complete. The elevated viaducts on all surface sections have been fully constructed.</p>

<p>Electrical and systems integration work — including signalling, traction power, and platform screen doors — has begun at the completed stations and is expected to take six to eight months.</p>

<h2>Environmental Benefits</h2>
<p>The expanded metro network is expected to take approximately 2.2 lakh private vehicles off Ahmedabad's roads daily once fully operational — reducing the city's vehicular carbon emissions by an estimated 11% annually.</p>

<p>"Phase 2 is not just an infrastructure project. It is an investment in cleaner air and better quality of life for everyone in this city," said a senior corporation official.</p>
    `,
    category: "Politics",
    categorySlug: "politics",
    author: "Ramesh Patel",
    publishedAt: "2025-07-02T14:30:00Z",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    featured: false,
    breaking: false,
  },
  {
    id: 7,
    slug: "ipl-2025-mi-vs-csk-preview",
    title: "MI vs CSK Final Preview: Rohit vs Dhoni Set for One Last Dance at Wankhede",
    excerpt: "The two most successful franchises in IPL history clash in a dream final that has set the cricketing world ablaze with anticipation.",
    content: `
<p>The stage is set. The Wankhede Stadium in Mumbai will host the ultimate IPL final on Sunday as Mumbai Indians take on Chennai Super Kings in what many are billing as the most eagerly awaited title match in the tournament's history.</p>

<p>Both teams have been in exceptional form through the tournament, and the final promises to be a contest of contrasting styles: MI's fearless aggression versus CSK's calculated precision.</p>

<h2>Key Battles</h2>
<p>All eyes will be on Rohit Sharma and MS Dhoni — two icons whose rivalry has defined an era of Indian cricket. Rohit has been in the form of his life this season, amassing 712 runs, while Dhoni, now 43, showed at the knockout stage that he still has the ability to change a match in a single over.</p>

<p>The bowling matchup is equally intriguing. Jasprit Bumrah's ability to defend totals against CSK's deep batting lineup will be tested against Deepak Chahar's uncanny ability to strike with the new ball against MI's explosive openers.</p>

<h2>Weather and Pitch</h2>
<p>The Wankhede surface is expected to favour batsmen, with the ground typically producing scores in excess of 190. Weather forecasts suggest a clear evening, removing the threat of rain interruptions that disrupted two earlier matches this season.</p>
    `,
    category: "Sports",
    categorySlug: "sports",
    author: "Sunil Mehta",
    publishedAt: "2025-07-01T16:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    featured: false,
    breaking: false,
  },
  {
    id: 8,
    slug: "gujarat-startup-ecosystem-growth",
    title: "Gujarat Ranks Second in Startup Ecosystem Index, 400 New Startups Registered in Q2",
    excerpt: "A new government report shows Gujarat's startup ecosystem is flourishing, with 400 new companies registered in Q2 alone, driven by fintech and agri-tech sectors.",
    content: `
<p>Gujarat has climbed to second position in the national Startup Ecosystem Index for 2025, behind only Karnataka, as the state recorded its strongest quarter for new company registrations with 400 startups officially incorporated between April and June.</p>

<p>The state's flagship startup policy, which offers a combination of seed funding, mentorship, and office space to early-stage ventures, has been instrumental in the surge, according to the report released by the Gujarat Innovation and Startup Cell.</p>

<h2>Sector Leaders</h2>
<p>Fintech and agri-tech together accounted for 42% of new registrations, reflecting both the state's strong banking and financial services heritage and its deep agricultural economy. Healthcare technology and clean energy startups also showed significant growth, each registering over 40 new companies in the quarter.</p>

<p>Ahmedabad and Surat are the two dominant startup hubs within the state, but Vadodara and Rajkot are rapidly emerging as secondary centres, supported by the presence of major engineering institutions and a skilled manufacturing talent pool.</p>

<h2>Investment Landscape</h2>
<p>Venture capital investment into Gujarat-based startups totalled ₹2,340 crore in Q2 — a 67% increase year-on-year. Five startups have achieved unicorn status in the past 18 months, further burnishing the state's credentials as a serious rival to Bengaluru and Delhi NCR for early-stage investment.</p>
    `,
    category: "Business",
    categorySlug: "business",
    author: "Priya Shah",
    publishedAt: "2025-07-01T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
    featured: false,
    breaking: false,
  },
  {
    id: 9,
    slug: "monsoon-health-tips-2025",
    title: "5 Essential Health Tips to Stay Safe This Monsoon Season",
    excerpt: "Doctors share practical advice on preventing waterborne diseases, mosquito-borne illnesses, and seasonal infections during the rainy season.",
    content: `
<p>As the monsoon arrives across Gujarat and much of India, health authorities are urging citizens to take simple but effective precautions against a seasonal spike in waterborne diseases, mosquito-related infections, and respiratory illnesses.</p>

<h2>1. Drink Only Boiled or Purified Water</h2>
<p>Contamination of water sources during heavy rains increases the risk of cholera, typhoid, and gastroenteritis significantly. Doctors recommend boiling tap water for at least five minutes or using a certified water purifier. Avoid drinking water from unknown sources when outdoors.</p>

<h2>2. Use Mosquito Protection</h2>
<p>Standing water that accumulates after rain is an ideal breeding ground for the Aedes mosquito, which spreads dengue and chikungunya. Use mosquito repellent creams or sprays when going outdoors, and ensure windows are fitted with proper mesh screens. Discard any stagnant water around your home.</p>

<h2>3. Avoid Street Food During Early Monsoon</h2>
<p>Exposed food items sold on the street are particularly vulnerable to contamination during the rainy season. If eating out, choose cooked, hot food from hygienic establishments. Pay particular attention to hygiene when consuming raw vegetables and fruit.</p>

<h2>4. Keep Your Feet Dry</h2>
<p>Fungal infections of the skin, particularly on the feet, are extremely common during monsoon. Dry your feet thoroughly after coming in from the rain, change wet socks promptly, and apply antifungal powder if you are prone to such infections.</p>

<h2>5. Boost Your Immunity</h2>
<p>Seasonal changes weaken the immune system. Doctors recommend maintaining adequate intake of Vitamin C through fresh citrus fruits, staying physically active, and ensuring seven to eight hours of sleep nightly. If you have underlying health conditions, consult your doctor about seasonal vaccination options.</p>
    `,
    category: "Lifestyle",
    categorySlug: "lifestyle",
    author: "Dr. Meera Desai",
    publishedAt: "2025-07-03T06:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?w=800&q=80",
    featured: false,
    breaking: false,
  },
  {
    id: 10,
    slug: "surat-diamond-industry-ai-revolution",
    title: "Surat's Diamond Industry Embraces AI Sorting Technology, Boosting Efficiency by 40%",
    excerpt: "Cutting-edge AI-powered grading and sorting machines are transforming the way Surat's diamond polishers work, with adoption rates doubling in the last year.",
    content: `
<p>Surat, the world's diamond polishing capital that processes over 90% of the world's rough diamonds, is undergoing a technological transformation. Artificial intelligence-powered sorting and grading machines are rapidly replacing manual processes, with industry insiders reporting efficiency gains of 30 to 40 percent in cutting and polishing operations.</p>

<p>The Diamond Association of Surat estimates that over 2,500 of the city's approximately 8,000 polishing units have now adopted some form of automated or AI-assisted technology — double the number from just 18 months ago.</p>

<h2>How the Technology Works</h2>
<p>Modern AI grading machines use high-resolution cameras and machine learning algorithms to analyse thousands of characteristics of a rough diamond within seconds: inclusions, colour distribution, shape, and structural stress points. The system then recommends the optimal cut plan to maximise the value of the polished output.</p>

<p>"Earlier, an experienced worker would take 30 to 45 minutes to plan a single stone. Our AI system does it in under two minutes with greater accuracy," said the owner of one of Surat's larger polishing firms.</p>

<h2>Impact on Workers</h2>
<p>The transition has raised concerns about job displacement in an industry that employs an estimated 10 lakh workers directly in the Surat region. Industry leaders are quick to point out that most workers are being retrained to operate and oversee the new machinery rather than being let go, but labour unions are monitoring the situation carefully.</p>
    `,
    category: "Business",
    categorySlug: "business",
    author: "Vijay Kothari",
    publishedAt: "2025-07-02T09:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1515630278258-407f994a2e15?w=800&q=80",
    featured: false,
    breaking: false,
  },
];

export function getAllArticles(): Article[] {
  return articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getFeaturedArticle(): Article {
  return articles.find((a) => a.featured) || articles[0];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles
    .filter((a) => a.categorySlug === categorySlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBreakingNews(): Article[] {
  return articles.filter((a) => a.breaking);
}

export function getLatestArticles(limit = 6): Article[] {
  return getAllArticles().slice(0, limit);
}

export function getCategoryName(slug: string): string {
  const cat = categories.find((c) => c.slug === slug);
  return cat ? cat.name : slug;
}
