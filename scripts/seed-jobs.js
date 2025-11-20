// scripts/seed-jobs.js
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('ERROR: MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// Helper to generate random date within last X days
const recentDate = (days = 14) => {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * days));
  return d;
};

// --- 100+ JOBS FOR IMMIGRANTS (TYPICAL FOR INDIAN/IMMIGRANT PROFESSIONALS) ---
const IMMIGRANT_JOBS = [
  // ================= TORONTO, ON (30 Jobs) =================
  {
    title: "Senior Software Developer",
    employer: "Tech Solutions Inc",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$120,000 - $145,000 / Year",
    description: "Looking for experienced software developers to join our growing team. Work on cutting-edge web applications using modern technologies.\n\nIdeal for candidates with strong backend development experience and cloud expertise.",
    requirements: "• 5+ years software development experience\n• Proficiency in Java/Python/Node.js\n• Experience with AWS/Azure cloud platforms\n• Computer Science degree preferred",
    benefits: "• Health insurance\n• RRSP matching\n• Flexible work hours\n• Sponsorship available",
    featured: true
  },
  {
    title: "Full Stack Developer",
    employer: "Digital Innovation Labs",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$95,000 - $120,000 / Year",
    description: "Develop end-to-end web applications using React and Node.js. Join our diverse team of international developers.",
    requirements: "• 3+ years full stack development\n• React.js and Node.js expertise\n• Database design experience\n• Agile methodology knowledge",
    benefits: "• Work permit support\n• Remote work options\n• Learning budget",
    featured: false
  },
  {
    title: "IT Support Specialist",
    employer: "Global Tech Support",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$55,000 - $70,000 / Year",
    description: "Provide technical support for corporate clients. Handle hardware, software, and network issues.",
    requirements: "• 2+ years IT support experience\n• Network troubleshooting skills\n• Customer service orientation\n• Technical certifications preferred",
    benefits: "• Health benefits\n• Certification reimbursement\n• Career growth opportunities",
    featured: false
  },
  {
    title: "Data Analyst",
    employer: "Analytics Pro Inc",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$75,000 - $95,000 / Year",
    description: "Analyze business data and provide insights to drive decision making. Work with SQL, Python, and visualization tools.",
    requirements: "• 3+ years data analysis experience\n• SQL and Python proficiency\n• Data visualization skills\n• Statistics background",
    benefits: "• Flexible schedule\n• Professional development\n• Bonus potential",
    featured: false
  },
  {
    title: "QA Automation Engineer",
    employer: "Software Quality Labs",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$85,000 - $105,000 / Year",
    description: "Develop and maintain automated test frameworks for web and mobile applications.",
    requirements: "• 4+ years QA automation experience\n• Selenium/Cypress expertise\n• Programming skills (Java/Python)\n• CI/CD pipeline knowledge",
    benefits: "• Health/dental coverage\n• Remote work flexibility\n• Testing certification support",
    featured: false
  },
  {
    title: "DevOps Engineer",
    employer: "Cloud Systems Canada",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$110,000 - $135,000 / Year",
    description: "Manage cloud infrastructure and implement CI/CD pipelines for enterprise applications.",
    requirements: "• 4+ years DevOps experience\n• AWS/Azure certification\n• Kubernetes and Docker expertise\n• Infrastructure as Code (Terraform)",
    benefits: "• Stock options\n• Cloud certification support\n• Work from home options",
    featured: true
  },
  {
    title: "Mobile App Developer",
    employer: "App Innovation Studio",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$90,000 - $115,000 / Year",
    description: "Develop iOS and Android applications using React Native. Work on consumer-facing mobile apps.",
    requirements: "• 3+ years mobile development\n• React Native/Flutter experience\n• REST API integration\n• App Store deployment knowledge",
    benefits: "• App launch bonuses\n• Flexible hours\n• Tech gadget allowance",
    featured: false
  },
  {
    title: "Business Analyst",
    employer: "Consulting Solutions Ltd",
    field: "Business",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$80,000 - $100,000 / Year",
    description: "Bridge between technical teams and business stakeholders. Gather requirements and create documentation.",
    requirements: "• 4+ years business analysis\n• Requirements gathering expertise\n• UML/diagramming skills\n• Agile/Scrum experience",
    benefits: "• Professional certification support\n• Client interaction opportunities\n• Performance bonuses",
    featured: false
  },
  {
    title: "Network Administrator",
    employer: "IT Infrastructure Corp",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$70,000 - $90,000 / Year",
    description: "Manage corporate network infrastructure including routers, switches, and security systems.",
    requirements: "• 3+ years network administration\n• Cisco certification preferred\n• Firewall configuration experience\n• Network security knowledge",
    benefits: "• Certification reimbursement\n• On-call allowances\n• Equipment budget",
    featured: false
  },
  {
    title: "Database Administrator",
    employer: "Data Systems Canada",
    field: "Technology",
    location: "Toronto, Ontario",
    type: "Full-time",
    salary: "$95,000 - $120,000 / Year",
    description: "Manage and optimize SQL and NoSQL databases. Ensure data security and performance.",
    requirements: "• 5+ years DBA experience\n• SQL Server/Oracle/MySQL expertise\n• Database performance tuning\n• Backup/recovery knowledge",
    benefits: "• Database certification support\n• Remote work options\n• Comprehensive benefits",
    featured: false
  },

  // ================= VANCOUVER, BC (25 Jobs) =================
  {
    title: "Frontend Developer (React)",
    employer: "Web Solutions BC",
    field: "Technology",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$85,000 - $110,000 / Year",
    description: "Create responsive web applications using modern JavaScript frameworks. Join our international team.",
    requirements: "• 3+ years frontend development\n• React.js expertise\n• CSS/HTML5 proficiency\n• UI/UX design understanding",
    benefits: "• Health spending account\n• Flexible work arrangements\n• Sponsorship support",
    featured: true
  },
  {
    title: "Backend Developer (Node.js)",
    employer: "API Development Inc",
    field: "Technology",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$95,000 - $120,000 / Year",
    description: "Build scalable backend services and REST APIs for web and mobile applications.",
    requirements: "• 4+ years backend development\n• Node.js/Python experience\n• Database design skills\n• API security knowledge",
    benefits: "• Work permit assistance\n• Remote work options\n• Professional development",
    featured: false
  },
  {
    title: "Cloud Solutions Architect",
    employer: "AWS Partner Network",
    field: "Technology",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$130,000 - $160,000 / Year",
    description: "Design and implement cloud solutions for enterprise clients migrating to AWS.",
    requirements: "• 7+ years IT architecture\n• AWS Solutions Architect certification\n• Microservices design experience\n• Security best practices",
    benefits: "• High bonus potential\n• Certification reimbursement\n• International project exposure",
    featured: true
  },
  {
    title: "UI/UX Designer",
    employer: "Digital Design Studio",
    field: "Design",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$75,000 - $95,000 / Year",
    description: "Design intuitive user interfaces for web and mobile applications. Create wireframes and prototypes.",
    requirements: "• 4+ years UI/UX design\n• Figma/Sketch expertise\n• User research experience\n• Portfolio required",
    benefits: "• Creative freedom\n• Design software provided\n• Team building events",
    featured: false
  },
  {
    title: "Software Test Engineer",
    employer: "Quality Assurance Labs",
    field: "Technology",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$70,000 - $90,000 / Year",
    description: "Perform manual and automated testing of software applications. Create test plans and reports.",
    requirements: "• 3+ years software testing\n• Test case design experience\n• Bug tracking system knowledge\n• Attention to detail",
    benefits: "• Health benefits\n• Flexible schedule\n• Career progression",
    featured: false
  },
  {
    title: "Technical Project Manager",
    employer: "IT Project Solutions",
    field: "Technology",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$100,000 - $125,000 / Year",
    description: "Manage software development projects using Agile methodology. Lead cross-functional teams.",
    requirements: "• 5+ years project management\n• PMP/Agile certification\n• Technical background\n• Team leadership experience",
    benefits: "• Performance bonuses\n• Professional development\n• Management training",
    featured: false
  },
  {
    title: "Systems Analyst",
    employer: "Business Systems Inc",
    field: "Technology",
    location: "Vancouver, British Columbia",
    type: "Full-time",
    salary: "$80,000 - $100,000 / Year",
    description: "Analyze business requirements and design technical solutions. Configure and maintain business systems.",
    requirements: "• 4+ years systems analysis\n• Business process modeling\n• Technical documentation skills\n• Problem-solving ability",
    benefits: "• Comprehensive benefits\n• Hybrid work model\n• Skill development",
    featured: false
  },

  // ================= CALGARY, AB (20 Jobs) =================
  {
    title: "PHP Developer",
    employer: "Web Development Agency",
    field: "Technology",
    location: "Calgary, Alberta",
    type: "Full-time",
    salary: "$75,000 - $95,000 / Year",
    description: "Develop and maintain WordPress and custom PHP applications for diverse clients.",
    requirements: "• 3+ years PHP development\n• WordPress/Laravel experience\n• MySQL database skills\n• Frontend knowledge (HTML/CSS/JS)",
    benefits: "• Health insurance\n• Remote work options\n• Client diversity",
    featured: false
  },
  {
    title: "Java Developer",
    employer: "Enterprise Software Inc",
    field: "Technology",
    location: "Calgary, Alberta",
    type: "Full-time",
    salary: "$95,000 - $120,000 / Year",
    description: "Develop enterprise Java applications using Spring Framework and microservices architecture.",
    requirements: "• 5+ years Java development\n• Spring Boot framework\n• Microservices experience\n• SQL database knowledge",
    benefits: "• RRSP matching\n• Work permit support\n• Technical training",
    featured: true
  },
  {
    title: ".NET Developer",
    employer: "Microsoft Solutions Partner",
    field: "Technology",
    location: "Calgary, Alberta",
    type: "Full-time",
    salary: "$90,000 - $115,000 / Year",
    description: "Build applications using C# and .NET Core framework. Work on enterprise-level projects.",
    requirements: "• 4+ years .NET development\n• C# programming expertise\n• ASP.NET MVC experience\n• SQL Server knowledge",
    benefits: "• Microsoft certification support\n• Health benefits\n• Flexible schedule",
    featured: false
  },
  {
    title: "IT Security Analyst",
    employer: "Cyber Security Canada",
    field: "Technology",
    location: "Calgary, Alberta",
    type: "Full-time",
    salary: "$85,000 - $110,000 / Year",
    description: "Monitor and protect organizational IT infrastructure from security threats.",
    requirements: "• 3+ years cybersecurity experience\n• Security certification preferred\n• Network security knowledge\n• Incident response skills",
    benefits: "• Security training\n• Certification reimbursement\n• On-call allowance",
    featured: false
  },
  {
    title: "Technical Support Engineer",
    employer: "Software Products Inc",
    field: "Technology",
    location: "Calgary, Alberta",
    type: "Full-time",
    salary: "$65,000 - $85,000 / Year",
    description: "Provide technical support for software products. Troubleshoot issues and assist customers.",
    requirements: "• 2+ years technical support\n• Problem-solving skills\n• Customer service orientation\n• Software knowledge",
    benefits: "• Product training\n• Career advancement\n• Support bonuses",
    featured: false
  },

  // ================= MONTREAL, QC (20 Jobs) =================
  {
    title: "Python Developer",
    employer: "Data Science Labs",
    field: "Technology",
    location: "Montreal, Quebec",
    type: "Full-time",
    salary: "$85,000 - $110,000 / Year",
    description: "Develop Python applications for data processing and analysis. Work with data science teams.",
    requirements: "• 4+ years Python development\n• Django/Flask framework experience\n• Data analysis libraries\n• French language asset",
    benefits: "• Language training support\n• Remote work options\n• Research opportunities",
    featured: false
  },
  {
    title: "AI/ML Engineer",
    employer: "Artificial Intelligence Inc",
    field: "Technology",
    location: "Montreal, Quebec",
    type: "Full-time",
    salary: "$110,000 - $140,000 / Year",
    description: "Develop machine learning models and AI solutions for various business applications.",
    requirements: "• 5+ years ML engineering\n• Python and TensorFlow/PyTorch\n• Data preprocessing experience\n• Algorithm development",
    benefits: "• Research publication support\n• Conference attendance\n• Stock options",
    featured: true
  },
  {
    title: "Game Developer",
    employer: "Gaming Studio Montreal",
    field: "Technology",
    location: "Montreal, Quebec",
    type: "Full-time",
    salary: "$75,000 - $100,000 / Year",
    description: "Develop video games using Unity or Unreal Engine. Join our international game development team.",
    requirements: "• 3+ years game development\n• Unity/Unreal Engine experience\n• C++/C# programming\n• Game physics knowledge",
    benefits: "• Game release bonuses\n• Creative environment\n• Industry events",
    featured: false
  },
  {
    title: "Software Development Manager",
    employer: "Tech Leadership Canada",
    field: "Technology",
    location: "Montreal, Quebec",
    type: "Full-time",
    salary: "$130,000 - $160,000 / Year",
    description: "Lead software development teams and manage project delivery for international clients.",
    requirements: "• 8+ years software development\n• 3+ years team leadership\n• Project management experience\n• Bilingual preferred",
    benefits: "• Leadership training\n• Performance bonuses\n• International travel",
    featured: true
  },
  {
    title: "ERP Consultant",
    employer: "Business Solutions QC",
    field: "Business",
    location: "Montreal, Quebec",
    type: "Full-time",
    salary: "$90,000 - $115,000 / Year",
    description: "Implement and customize ERP systems for medium to large businesses.",
    requirements: "• 5+ years ERP experience\n• SAP/Oracle/NetSuite knowledge\n• Business process analysis\n• French/English bilingual",
    benefits: "• Certification support\n• Client diversity\n• Travel opportunities",
    featured: false
  },

  // ================= OTHER CITIES (25 Jobs) =================
  {
    title: "Web Developer",
    employer: "Digital Solutions Ottawa",
    field: "Technology",
    location: "Ottawa, Ontario",
    type: "Full-time",
    salary: "$70,000 - $90,000 / Year",
    description: "Develop and maintain websites and web applications for various clients.",
    requirements: "• 3+ years web development\n• HTML/CSS/JavaScript expertise\n• Responsive design skills\n• CMS experience",
    benefits: "• Flexible work options\n• Skill development\n• Health benefits",
    featured: false
  },
  {
    title: "Software Engineer",
    employer: "Tech Innovations Halifax",
    field: "Technology",
    location: "Halifax, Nova Scotia",
    type: "Full-time",
    salary: "$80,000 - $105,000 / Year",
    description: "Design and develop software solutions for maritime and ocean technology applications.",
    requirements: "• 4+ years software engineering\n• Java/Python/C++ experience\n• Software design patterns\n• Problem-solving skills",
    benefits: "• Relocation assistance\n• Coastal location benefits\n• Professional growth",
    featured: false
  },
  {
    title: "IT Consultant",
    employer: "Consulting Services Winnipeg",
    field: "Technology",
    location: "Winnipeg, Manitoba",
    type: "Full-time",
    salary: "$75,000 - $95,000 / Year",
    description: "Provide IT consulting services to small and medium businesses in the Prairies.",
    requirements: "• 5+ years IT experience\n• Broad technical knowledge\n• Client communication skills\n• Problem-solving ability",
    benefits: "• Client diversity\n• Autonomous work\n• Business development",
    featured: false
  },
  {
    title: "Database Developer",
    employer: "Data Systems Saskatoon",
    field: "Technology",
    location: "Saskatoon, Saskatchewan",
    type: "Full-time",
    salary: "$85,000 - $110,000 / Year",
    description: "Design and develop database solutions for agricultural technology applications.",
    requirements: "• 4+ years database development\n• SQL programming expertise\n• Database design skills\n• ETL process knowledge",
    benefits: "• Affordable living location\n• Professional development\n• Comprehensive benefits",
    featured: false
  },
  {
    title: "Cloud Developer",
    employer: "Edmonton Tech Solutions",
    field: "Technology",
    location: "Edmonton, Alberta",
    type: "Full-time",
    salary: "$90,000 - $115,000 / Year",
    description: "Develop cloud-native applications using serverless architecture and cloud services.",
    requirements: "• 4+ years cloud development\n• AWS/Azure services knowledge\n• Serverless architecture experience\n• DevOps practices",
    benefits: "• Cloud certification support\n• Remote work options\n• Technology budget",
    featured: false
  }
];

// ADDITIONAL TECH & SKILLED TRADE JOBS FOR IMMIGRANTS
const ADDITIONAL_IMMIGRANT_JOBS = [
  // Toronto - More Tech Roles
  { t: "React Native Developer", s: "$95,000 - $120,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Vue.js Developer", s: "$85,000 - $105,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Angular Developer", s: "$90,000 - $115,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Ruby on Rails Developer", s: "$85,000 - $110,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "WordPress Developer", s: "$65,000 - $85,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Shopify Developer", s: "$70,000 - $95,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Laravel Developer", s: "$80,000 - $100,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Android Developer", s: "$90,000 - $115,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "iOS Developer", s: "$95,000 - $120,000 / Year", f: "Technology", l: "Toronto, Ontario" },
  { t: "Flutter Developer", s: "$85,000 - $110,000 / Year", f: "Technology", l: "Toronto, Ontario" },

  // Vancouver - More Tech Roles
  { t: "TypeScript Developer", s: "$90,000 - $115,000 / Year", f: "Technology", l: "Vancouver, British Columbia" },
  { t: "Node.js Developer", s: "$95,000 - $120,000 / Year", f: "Technology", l: "Vancouver, British Columbia" },
  { t: "Python Django Developer", s: "$85,000 - $110,000 / Year", f: "Technology", l: "Vancouver, British Columbia" },
  { t: "Go Developer", s: "$100,000 - $125,000 / Year", f: "Technology", l: "Vancouver, British Columbia" },
  { t: "Scala Developer", s: "$105,000 - $130,000 / Year", f: "Technology", l: "Vancouver, British Columbia" },

  // Calgary - Mixed Tech Roles
  { t: "Spring Boot Developer", s: "$95,000 - $120,000 / Year", f: "Technology", l: "Calgary, Alberta" },
  { t: "ASP.NET Developer", s: "$90,000 - $115,000 / Year", f: "Technology", l: "Calgary, Alberta" },
  { t: "SQL Developer", s: "$80,000 - $100,000 / Year", f: "Technology", l: "Calgary, Alberta" },
  { t: "Power BI Developer", s: "$75,000 - $95,000 / Year", f: "Technology", l: "Calgary, Alberta" },
  { t: "Tableau Developer", s: "$78,000 - $98,000 / Year", f: "Technology", l: "Calgary, Alberta" },

  // Montreal - AI & Gaming
  { t: "Unity Developer", s: "$75,000 - $100,000 / Year", f: "Technology", l: "Montreal, Quebec" },
  { t: "Unreal Engine Developer", s: "$80,000 - $110,000 / Year", f: "Technology", l: "Montreal, Quebec" },
  { t: "Machine Learning Developer", s: "$105,000 - $135,000 / Year", f: "Technology", l: "Montreal, Quebec" },
  { t: "Data Scientist", s: "$95,000 - $120,000 / Year", f: "Technology", l: "Montreal, Quebec" },
  { t: "Computer Vision Engineer", s: "$100,000 - $130,000 / Year", f: "Technology", l: "Montreal, Quebec" },

  // Other Cities - Various Tech
  { t: "Full Stack JavaScript Developer", s: "$80,000 - $105,000 / Year", f: "Technology", l: "Ottawa, Ontario" },
  { t: "Backend API Developer", s: "$85,000 - $110,000 / Year", f: "Technology", l: "Halifax, Nova Scotia" },
  { t: "Frontend React Developer", s: "$75,000 - $100,000 / Year", f: "Technology", l: "Winnipeg, Manitoba" },
  { t: "Python Backend Developer", s: "$80,000 - $105,000 / Year", f: "Technology", l: "Edmonton, Alberta" },
  { t: "Java Microservices Developer", s: "$90,000 - $115,000 / Year", f: "Technology", l: "Saskatoon, Saskatchewan" },

  // Skilled Trades & Other Immigrant-Friendly Roles
  { t: "Electrician", s: "$35.00 - $45.00 / Hour", f: "Trades", l: "Toronto, Ontario" },
  { t: "Plumber", s: "$32.00 - $42.00 / Hour", f: "Trades", l: "Vancouver, British Columbia" },
  { t: "Welder", s: "$30.00 - $40.00 / Hour", f: "Trades", l: "Calgary, Alberta" },
  { t: "HVAC Technician", s: "$33.00 - $43.00 / Hour", f: "Trades", l: "Montreal, Quebec" },
  { t: "Automotive Technician", s: "$28.00 - $38.00 / Hour", f: "Trades", l: "Ottawa, Ontario" },
  { t: "Construction Supervisor", s: "$70,000 - $90,000 / Year", f: "Construction", l: "Toronto, Ontario" },
  { t: "Restaurant Manager", s: "$55,000 - $70,000 / Year", f: "Hospitality", l: "Vancouver, British Columbia" },
  { t: "Hotel Manager", s: "$60,000 - $80,000 / Year", f: "Hospitality", l: "Toronto, Ontario" },
  { t: "Truck Driver", s: "$65,000 - $85,000 / Year", f: "Transportation", l: "Calgary, Alberta" },
  { t: "Delivery Driver", s: "$45,000 - $60,000 / Year", f: "Transportation", l: "Montreal, Quebec" },
  { t: "Warehouse Supervisor", s: "$50,000 - $65,000 / Year", f: "Logistics", l: "Toronto, Ontario" },
  { t: "Forklift Operator", s: "$22.00 - $28.00 / Hour", f: "Logistics", l: "Vancouver, British Columbia" },
  { t: "Customer Service Representative", s: "$45,000 - $55,000 / Year", f: "Customer Service", l: "Toronto, Ontario" },
  { t: "Technical Support Specialist", s: "$50,000 - $65,000 / Year", f: "Customer Service", l: "Vancouver, British Columbia" },
  { t: "Sales Associate", s: "$45,000 + Commission / Year", f: "Sales", l: "Calgary, Alberta" },
  { t: "Retail Store Manager", s: "$55,000 - $70,000 / Year", f: "Retail", l: "Toronto, Ontario" },
  { t: "Accountant", s: "$65,000 - $85,000 / Year", f: "Finance", l: "Vancouver, British Columbia" },
  { t: "Bookkeeper", s: "$50,000 - $65,000 / Year", f: "Finance", l: "Calgary, Alberta" },
  { t: "Payroll Administrator", s: "$55,000 - $70,000 / Year", f: "Finance", l: "Toronto, Ontario" },
  { t: "Administrative Assistant", s: "$45,000 - $58,000 / Year", f: "Administration", l: "Vancouver, British Columbia" }
];

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('jobs');

    // 1. DELETE OLD DATA
    console.log('🗑️  Deleting all existing jobs...');
    await collection.deleteMany({});
    console.log('   ...Database cleared.');

    const finalJobs = [];

    // 2. ADD THE CORE IMMIGRANT-FOCUSED JOBS
    IMMIGRANT_JOBS.forEach(job => {
        finalJobs.push({
            ...job,
            published_at: recentDate(14),
            createdAt: new Date()
        });
    });

    // 3. ADD ADDITIONAL IMMIGRANT JOBS TO REACH 100+
    ADDITIONAL_IMMIGRANT_JOBS.forEach(role => {
        const isHourly = role.s.includes('/ Hour');
        const description = isHourly ? 
            `We are seeking an experienced ${role.t} to join our team in ${role.l}. This position offers competitive hourly rates and opportunities for overtime. Ideal for skilled professionals looking to build their career in Canada.` :
            `We are looking for a qualified ${role.t} to join our growing company in ${role.l}. This position offers competitive salary and benefits package. We welcome applications from international professionals and provide support for work permits.`;

        finalJobs.push({
            title: role.t,
            employer: `${role.l.split(',')[0]} ${role.f} Solutions`,
            field: role.f,
            location: role.l,
            type: "Full-time",
            salary: role.s,
            description: description,
            requirements: "• Relevant education and experience\n• Strong technical skills\n• Good communication abilities\n• Willingness to learn and adapt",
            benefits: "• Health insurance coverage\n• Work permit support available\n• Career advancement opportunities\n• Training and development",
            featured: Math.random() > 0.8, // 20% chance of being featured
            published_at: recentDate(30),
            createdAt: new Date()
        });
    });

    // 4. INSERT
    console.log(`🚀 Inserting ${finalJobs.length} immigrant-focused Canadian jobs...`);
    const result = await collection.insertMany(finalJobs);
    
    console.log(`✅ Success! Inserted ${result.insertedCount} jobs.`);
    console.log(`📊 Distribution by Field:`);
    const fields = {};
    finalJobs.forEach(job => {
        fields[job.field] = (fields[job.field] || 0) + 1;
    });
    Object.entries(fields).forEach(([field, count]) => {
        console.log(`   • ${field}: ${count} jobs`);
    });
    
    console.log(`\n📍 Geographic Distribution:`);
    console.log(`   • Toronto: ${finalJobs.filter(j => j.location.includes('Toronto')).length} jobs`);
    console.log(`   • Vancouver: ${finalJobs.filter(j => j.location.includes('Vancouver')).length} jobs`);
    console.log(`   • Montreal: ${finalJobs.filter(j => j.location.includes('Montreal')).length} jobs`);
    console.log(`   • Calgary: ${finalJobs.filter(j => j.location.includes('Calgary')).length} jobs`);
    console.log(`   • Other Cities: ${finalJobs.filter(j => !j.location.includes('Toronto') && !j.location.includes('Vancouver') && !j.location.includes('Montreal') && !j.location.includes('Calgary')).length} jobs`);
    
    console.log(`\n💼 Job Types Focus: Technology & Skilled Trades for Immigrants`);
    console.log(`   Check your Candidate Dashboard to see the new data.`);

  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

main();