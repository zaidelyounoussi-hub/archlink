import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("demo12345", 10);

  // â”€â”€ ARCHITECTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const architects = [
    {
      name: "Marta Delgado",
      email: "marta@demo.com",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      specialty: "Sustainable / Green Architecture",
      location: "Barcelona, Spain",
      bio: "Committed to architecture that respects the environment without compromising beauty.",
      yearsExp: 12, priceRange: "$80-$150/hr", website: "https://martadelgado.com",
    },
    {
      name: "James Osei",
      email: "james@demo.com",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      specialty: "Urban Planning & Design",
      location: "Accra, Ghana",
      bio: "Reimagining African cities through innovative urban design and community-centered planning.",
      yearsExp: 9, priceRange: "$60-$100/hr", website: "https://jamesosei.com",
    },
    {
      name: "Yuki Tanaka",
      email: "yuki@demo.com",
      image: "https://randomuser.me/api/portraits/women/66.jpg",
      specialty: "Interior Architecture",
      location: "Tokyo, Japan",
      bio: "Blending minimalist Japanese principles with contemporary global influences.",
      yearsExp: 7, priceRange: "$70-$120/hr", website: "https://yukitanaka.jp",
    },
    {
      name: "Amara Nwosu",
      email: "amara@demo.com",
      image: "https://randomuser.me/api/portraits/women/79.jpg",
      specialty: "Cultural & Civic Architecture",
      location: "Lagos, Nigeria",
      bio: "Designing spaces that celebrate African heritage and foster community pride.",
      yearsExp: 10, priceRange: "$75-$130/hr",
    },
    {
      name: "Lucas Ferreira",
      email: "lucas@demo.com",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      specialty: "Residential & Housing Design",
      location: "Sao Paulo, Brazil",
      bio: "Crafting homes that respond to climate, culture, and the human need for beauty.",
      yearsExp: 8, priceRange: "$50-$90/hr",
    },
    {
      name: "Sofia Andersson",
      email: "sofia@demo.com",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      specialty: "Educational Facilities",
      location: "Stockholm, Sweden",
      bio: "Designing schools and universities that inspire learning and foster creativity.",
      yearsExp: 11, priceRange: "$90-$160/hr",
    },
    {
      name: "Karim El Fassi",
      email: "karim.arch@demo.com",
      image: "https://randomuser.me/api/portraits/men/77.jpg",
      specialty: "Islamic & Traditional Architecture",
      location: "Marrakech, Morocco",
      bio: "Reviving the timeless beauty of Islamic architecture in contemporary spaces.",
      yearsExp: 14, priceRange: "$70-$120/hr",
    },
    {
      name: "Lena Fischer",
      email: "lena@demo.com",
      image: "https://randomuser.me/api/portraits/women/90.jpg",
      specialty: "Industrial & Commercial Design",
      location: "Berlin, Germany",
      bio: "Transforming industrial spaces into inspiring work environments.",
      yearsExp: 6, priceRange: "$60-$100/hr",
    },
    {
      name: "Arjun Mehta",
      email: "arjun@demo.com",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      specialty: "Landscape Architecture",
      location: "Mumbai, India",
      bio: "Creating outdoor spaces that breathe life into urban environments.",
      yearsExp: 9, priceRange: "$55-$95/hr",
    },
    {
      name: "Chiara Romano",
      email: "chiara@demo.com",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      specialty: "Heritage & Restoration",
      location: "Rome, Italy",
      bio: "Preserving history while breathing new life into ancient structures.",
      yearsExp: 15, priceRange: "$100-$180/hr",
    },
    {
      name: "Omar Khalid",
      email: "omar@demo.com",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      specialty: "High-Rise & Skyscraper Design",
      location: "Dubai, UAE",
      bio: "Pushing the limits of vertical architecture in the world most ambitious cities.",
      yearsExp: 11, priceRange: "$120-$200/hr",
    },
    {
      name: "Fatima Al-Hassan",
      email: "fatima@demo.com",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      specialty: "Healthcare Architecture",
      location: "Cairo, Egypt",
      bio: "Designing hospitals and clinics that promote healing and wellbeing.",
      yearsExp: 8, priceRange: "$80-$140/hr",
    },
  ];

  // â”€â”€ CLIENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const clients = [
    {
      name: "Alex Rivera",
      email: "alex@demo.com",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      location: "New York, USA",
      projectType: "Residential Renovation",
      budget: "$50,000-$100,000",
      bio: "Looking for an architect to help redesign my Brooklyn brownstone.",
    },
    {
      name: "Zaid El Younoussi",
      email: "zaid@demo.com",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      location: "Casablanca, Morocco",
      projectType: "Commercial Office Space",
      budget: "$100,000-$250,000",
      bio: "Building a modern co-working space in the heart of Casablanca.",
    },
    {
      name: "Emma Wilson",
      email: "emma@demo.com",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
      location: "London, UK",
      projectType: "Villa Design",
      budget: "$200,000+",
      bio: "Dreaming of a sustainable villa in the countryside.",
    },
    {
      name: "Karim Mansouri",
      email: "karim@demo.com",
      image: "https://randomuser.me/api/portraits/men/77.jpg",
      location: "Paris, France",
      projectType: "Restaurant Interior",
      budget: "$75,000-$150,000",
      bio: "Opening a Moroccan restaurant and need a stunning interior design.",
    },
    {
      name: "Priya Sharma",
      email: "priya@demo.com",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      location: "Bangalore, India",
      projectType: "Tech Office Campus",
      budget: "$500,000+",
      bio: "Building an innovative campus for my growing tech startup.",
    },
    {
      name: "Marco Rossi",
      email: "marco@demo.com",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
      location: "Milan, Italy",
      projectType: "Luxury Apartment",
      budget: "$150,000-$300,000",
      bio: "Renovating a historic apartment in Milan with modern touches.",
    },
    {
      name: "Aisha Bello",
      email: "aisha@demo.com",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
      location: "Abuja, Nigeria",
      projectType: "Cultural Center",
      budget: "$300,000+",
      bio: "Creating a cultural space to celebrate Nigerian arts and heritage.",
    },
    {
      name: "Chen Wei",
      email: "chen@demo.com",
      image: "https://randomuser.me/api/portraits/men/88.jpg",
      location: "Shanghai, China",
      projectType: "Mixed-Use Development",
      budget: "$1,000,000+",
      bio: "Developing a mixed-use tower combining retail, office, and residential spaces.",
    },
  ];

  console.log("Seeding database...");

  // Create architects
  const createdArchitects = [];
  for (const arch of architects) {
    const user = await prisma.user.upsert({
      where: { email: arch.email },
      update: {},
      create: {
        name: arch.name,
        email: arch.email,
        password,
        image: arch.image,
        role: "ARCHITECT",
      },
    });

    await prisma.architectProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: arch.bio,
        specialty: arch.specialty,
        location: arch.location,
        yearsExp: arch.yearsExp,
        priceRange: arch.priceRange,
        website: arch.website ?? null,
        available: true,
      },
    });

    createdArchitects.push(user);
    console.log("Created architect:", arch.name);
  }

  // Create clients
  const createdClients = [];
  for (const cl of clients) {
    const user = await prisma.user.upsert({
      where: { email: cl.email },
      update: {},
      create: {
        name: cl.name,
        email: cl.email,
        password,
        image: cl.image,
        role: "CLIENT",
      },
    });

    await prisma.clientProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: cl.bio,
        location: cl.location,
        projectType: cl.projectType,
        budget: cl.budget,
      },
    });

    createdClients.push(user);
    console.log("Created client:", cl.name);
  }

  // Create some posts
  const posts = [
    { authorEmail: "marta@demo.com", content: "Just completed a LEED Platinum certified home in Barcelona. The solar panels alone will save the family 80% on energy bills. Sustainable architecture is not a compromise â€” it is the future.", type: "project" },
    { authorEmail: "james@demo.com", content: "The most underrated element in residential design? The threshold â€” the transition between outside and inside. A well-designed entrance sets the emotional tone for an entire home. It deserves far more attention than it typically receives.", type: "tip" },
    { authorEmail: "yuki@demo.com", content: "Just had our first meeting with an architect for our Brooklyn brownstone renovation. I had no idea how many decisions were involved! Feeling both excited and slightly overwhelmed. Any advice from people who have been through this?", type: "question" },
    { authorEmail: "zaid@demo.com", content: "Looking for an architect in Morocco with experience in modern commercial spaces. Our startup is growing and we need a proper office. Found some great profiles here on ArchLink â€” really impressive work being shared!", type: "update" },
    { authorEmail: "sofia@demo.com", content: "Quick tip for anyone starting a sustainable build: passive design first, technology second. Before specifying any solar panels or smart systems, optimize your orientation, massing, and insulation. You will save money and energy.", type: "tip" },
    { authorEmail: "arjun@demo.com", content: "Just unveiled our latest landscape project â€” a 2-acre urban park in the heart of Mumbai. Green spaces in cities are not luxuries, they are essential infrastructure for mental health and community wellbeing.", type: "project", imageUrl: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?w=800" },
    { authorEmail: "chiara@demo.com", content: "Restoration work on a 16th century palazzo in Rome. Every crack tells a story. Our job is to preserve those stories while making the building safe and functional for another 500 years.", type: "project", imageUrl: "https://images.unsplash.com/photo-1555993539-1732b0258235?w=800" },
    { authorEmail: "omar@demo.com", content: "The future of high-rise design is not about height â€” it is about integration. Buildings that breathe, generate their own energy, and connect meaningfully with the city around them. Dubai is becoming a laboratory for this.", type: "update" },
    { authorEmail: "emma@demo.com", content: "After 6 months of searching, I finally found my architect through ArchLink. The portfolio filtering by specialty made all the difference. Starting our sustainable villa project next month!", type: "update" },
    { authorEmail: "lena@demo.com", content: "Converted a 1920s factory in Berlin into a creative office hub. Kept the raw concrete, exposed steel beams, and original skylights. The best industrial designs respect the building history.", type: "project", imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800" },
    { authorEmail: "karim.arch@demo.com", content: "Islamic geometric patterns are not decoration â€” they are a profound mathematical language that creates harmony between the human scale and the infinite. Every pattern tells a story of the cosmos.", type: "tip" },
    { authorEmail: "fatima@demo.com", content: "Healthcare design is deeply human work. The difference between a stressful hospital and a healing one comes down to light, wayfinding, and how spaces make patients feel safe. Architecture saves lives in more ways than one.", type: "update" },
  ];

  for (const post of posts) {
    const author = await prisma.user.findUnique({ where: { email: post.authorEmail } });
    if (!author) continue;
    await prisma.post.create({
      data: {
        authorId: author.id,
        content: post.content,
        type: post.type,
        imageUrl: (post as any).imageUrl ?? null,
        archived: false,
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
