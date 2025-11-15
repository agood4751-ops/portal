// scripts/seed-jobs.js
// Usage:
//   node scripts/seed-jobs.js               -> inserts embedded sample jobs
//   node scripts/seed-jobs.js jobs.json     -> inserts jobs from jobs.json (array of job objects)
//
// Make sure .env.local has MONGODB_URI set (this script uses dotenv like your other scripts)

require('dotenv').config({ path: '.env.local' });
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Please set MONGODB_URI in .env.local');
  process.exit(1);
}

const SAMPLE_JOBS = [
/* ========================================================================
   ATLANTIC CANADA (PEI, NS, NB, NL)
======================================================================== */

/* -------- PRINCE EDWARD ISLAND — Charlottetown -------- */
{ title:"Registered Nurse", employer:"PEI Health Services", field:"Healthcare", salary:"$42 - $55 / Hourly", type:"Full-time", location:"Charlottetown, Prince Edward Island", description:"Hospital nursing duties.", requirements:"RN License", benefits:"Pension", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Restaurant Manager", employer:"Island Dining Group", field:"Hospitality", salary:"$4,500 - $6,000 / Monthly", type:"Full-time", location:"Charlottetown, Prince Edward Island", description:"Manage operations.", requirements:"3 years exp", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"IT Support Technician", employer:"Coastal IT Services", field:"IT", salary:"$28 - $35 / Hourly", type:"Full-time", location:"Charlottetown, Prince Edward Island", description:"Hardware & software support.", requirements:"A+ Certification", benefits:"RRSP", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- NOVA SCOTIA — Halifax -------- */
{ title:"Software Developer", employer:"Atlantic Tech", field:"Technology", salary:"$85,000 - $110,000 / Yearly", type:"Full-time", location:"Halifax, Nova Scotia", description:"Build enterprise apps.", requirements:"React/Node", benefits:"Hybrid", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Electrician", employer:"Maritime Electrical", field:"Construction", salary:"$40 - $55 / Hourly", type:"Full-time", location:"Halifax, Nova Scotia", description:"Commercial electrical work.", requirements:"Red Seal", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Financial Analyst", employer:"EastBank", field:"Finance", salary:"$70,000 - $95,000 / Yearly", type:"Full-time", location:"Halifax, Nova Scotia", description:"Analyze statements.", requirements:"CPA preferred", benefits:"Bonus", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- NEW BRUNSWICK — Moncton -------- */
{ title:"Warehouse Supervisor", employer:"NB Logistics", field:"Warehousing", salary:"$55,000 - $70,000 / Yearly", type:"Full-time", location:"Moncton, New Brunswick", description:"Oversee warehouse.", requirements:"2 years lead", benefits:"Insurance", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Customer Service Specialist", employer:"TeleSupport", field:"Business", salary:"$20 - $25 / Hourly", type:"Full-time", location:"Moncton, New Brunswick", description:"Assist customers.", requirements:"Communication skills", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Civil Engineer", employer:"Moncton Engineering", field:"Engineering", salary:"$85,000 - $120,000 / Yearly", type:"Full-time", location:"Moncton, New Brunswick", description:"Municipal project design.", requirements:"P.Eng", benefits:"RRSP", featured:true, published_at:new Date(), createdAt:new Date() },

/* -------- NEWFOUNDLAND — St. John's -------- */
{ title:"Oil & Gas Technician", employer:"Atlantic Offshore", field:"Oil & Gas", salary:"$45 - $65 / Hourly", type:"Rotation", location:"St. John's, Newfoundland and Labrador", description:"Rig maintenance.", requirements:"Offshore certs", benefits:"Rotation bonus", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Admin Assistant", employer:"NL Government", field:"Business", salary:"$48,000 - $60,000 / Yearly", type:"Full-time", location:"St. John's, Newfoundland and Labrador", description:"Clerical tasks.", requirements:"Office exp", benefits:"Government pension", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Network Engineer", employer:"TechNorth", field:"IT", salary:"$90,000 - $130,000 / Yearly", type:"Full-time", location:"St. John's, Newfoundland and Labrador", description:"Manage networks.", requirements:"CCNA/CCNP", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   QUEBEC (Montreal, Quebec City, Laval)
======================================================================== */

/* -------- Montreal -------- */
{ title:"Full Stack Developer", employer:"Montreal Digital", field:"Technology", salary:"$95,000 - $130,000 / Yearly", type:"Full-time", location:"Montreal, Quebec", description:"React/Node", requirements:"3+ years", benefits:"Hybrid", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Accountant", employer:"Quebec Finance Group", field:"Finance", salary:"$70,000 - $90,000 / Yearly", type:"Full-time", location:"Montreal, Quebec", description:"Tax filings.", requirements:"CPA", benefits:"Bonus", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Mechanical Engineer", employer:"TechMech", field:"Engineering", salary:"$80,000 - $115,000 / Yearly", type:"Full-time", location:"Montreal, Quebec", description:"Manufacturing systems.", requirements:"P.Eng", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- Quebec City -------- */
{ title:"Nurse Practitioner", employer:"QC Health", field:"Healthcare", salary:"$50 - $65 / Hourly", type:"Full-time", location:"Quebec City, Quebec", description:"Clinical duties.", requirements:"NP License", benefits:"Pension", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Project Manager", employer:"Nordic Construction", field:"Construction", salary:"$95,000 - $135,000 / Yearly", type:"Full-time", location:"Quebec City, Quebec", description:"Oversee builds.", requirements:"PMP", benefits:"Vehicle", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Graphic Designer", employer:"QC Creative", field:"Marketing", salary:"$25 - $35 / Hourly", type:"Full-time", location:"Quebec City, Quebec", description:"Brand design.", requirements:"Portfolio", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- Laval -------- */
{ title:"Warehouse Associate", employer:"Laval Logistics", field:"Warehousing", salary:"$22 - $28 / Hourly", type:"Full-time", location:"Laval, Quebec", description:"Pick/pack.", requirements:"Physically fit", benefits:"Insurance", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Data Analyst", employer:"Laval Analytics", field:"Technology", salary:"$70,000 - $95,000 / Yearly", type:"Full-time", location:"Laval, Quebec", description:"Reports & dashboards.", requirements:"SQL", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"HR Coordinator", employer:"Human Capital QC", field:"Business", salary:"$50,000 - $65,000 / Yearly", type:"Full-time", location:"Laval, Quebec", description:"Recruitment support.", requirements:"HR diploma", benefits:"Insurance", featured:false, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   ONTARIO (Toronto, Ottawa, Hamilton, London, Mississauga)
======================================================================== */

/* -------- Toronto -------- */
{ title:"Senior Software Engineer", employer:"TorontoTech", field:"Technology", salary:"$120,000 - $160,000 / Yearly", type:"Full-time", location:"Toronto, Ontario", description:"Architect systems.", requirements:"5+ years", benefits:"Stock options", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Marketing Manager", employer:"CityMarketing", field:"Marketing", salary:"$80,000 - $110,000 / Yearly", type:"Full-time", location:"Toronto, Ontario", description:"Campaign strategy.", requirements:"3 years mgmt", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Security Guard", employer:"Metro Security", field:"Security", salary:"$20 - $27 / Hourly", type:"Full-time", location:"Toronto, Ontario", description:"Patrol duties.", requirements:"Security license", benefits:"Benefits", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- Ottawa -------- */
{ title:"Government Policy Analyst", employer:"Gov of Canada", field:"Government", salary:"$75,000 - $100,000 / Yearly", type:"Full-time", location:"Ottawa, Ontario", description:"Draft policy.", requirements:"Degree", benefits:"Government pension", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Cybersecurity Specialist", employer:"SecureNorth", field:"IT", salary:"$95,000 - $130,000 / Yearly", type:"Full-time", location:"Ottawa, Ontario", description:"Security audits.", requirements:"CISSP", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Teacher", employer:"Ottawa School Board", field:"Education", salary:"$65,000 - $85,000 / Yearly", type:"Full-time", location:"Ottawa, Ontario", description:"Teach curriculum.", requirements:"Teaching license", benefits:"Pension", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- Mississauga -------- */
{ title:"Forklift Operator", employer:"GTA Warehousing", field:"Warehousing", salary:"$22 - $30 / Hourly", type:"Full-time", location:"Mississauga, Ontario", description:"Material handling.", requirements:"Forklift license", benefits:"Shift premium", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Sales Manager", employer:"RetailCorp", field:"Sales", salary:"$70,000 - $95,000 / Yearly", type:"Full-time", location:"Mississauga, Ontario", description:"Sales strategy.", requirements:"3 years exp", benefits:"Commission", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"QA Analyst", employer:"TechCheck", field:"Technology", salary:"$65,000 - $85,000 / Yearly", type:"Full-time", location:"Mississauga, Ontario", description:"Test software.", requirements:"Automation exp", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- Hamilton -------- */
{ title:"Steel Mill Worker", employer:"Hamilton Steel Co.", field:"Manufacturing", salary:"$30 - $40 / Hourly", type:"Full-time", location:"Hamilton, Ontario", description:"Operate machinery.", requirements:"Heavy industry exp", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Mechanical Technician", employer:"Hamilton Mech Group", field:"Engineering", salary:"$65,000 - $85,000 / Yearly", type:"Full-time", location:"Hamilton, Ontario", description:"Maintain machines.", requirements:"Technical diploma", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"HR Manager", employer:"HR Ontario", field:"Business", salary:"$90,000 - $120,000 / Yearly", type:"Full-time", location:"Hamilton, Ontario", description:"HR operations.", requirements:"HR cert", benefits:"RRSP", featured:false, published_at:new Date(), createdAt:new Date() },

/* -------- London -------- */
{ title:"Truck Driver", employer:"Midwest Transport", field:"Logistics", salary:"$27 - $35 / Hourly", type:"Full-time", location:"London, Ontario", description:"Local hauling.", requirements:"AZ license", benefits:"Bonus", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Physiotherapist", employer:"London Health", field:"Healthcare", salary:"$70,000 - $95,000 / Yearly", type:"Full-time", location:"London, Ontario", description:"Rehab patients.", requirements:"PT license", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Data Entry Clerk", employer:"London Services", field:"Business", salary:"$20 - $25 / Hourly", type:"Full-time", location:"London, Ontario", description:"Data processing.", requirements:"Typing skills", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   MANITOBA (Winnipeg)
======================================================================== */

{ title:"HVAC Technician", employer:"Prairie Heating", field:"Construction", salary:"$35 - $48 / Hourly", type:"Full-time", location:"Winnipeg, Manitoba", description:"Install HVAC.", requirements:"HVAC cert", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Software QA Engineer", employer:"Winnipeg TechWorks", field:"Technology", salary:"$75,000 - $100,000 / Yearly", type:"Full-time", location:"Winnipeg, Manitoba", description:"Test systems.", requirements:"Automation exp", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Registered Nurse", employer:"Winnipeg Health", field:"Healthcare", salary:"$42 - $54 / Hourly", type:"Full-time", location:"Winnipeg, Manitoba", description:"Provide care.", requirements:"RN License", benefits:"Health plan", featured:true, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   SASKATCHEWAN (Saskatoon, Regina)
======================================================================== */

{ title:"Agriculture Technician", employer:"SaskAg", field:"Agriculture", salary:"$28 - $40 / Hourly", type:"Full-time", location:"Saskatoon, Saskatchewan", description:"Farm equipment repair.", requirements:"Tech diploma", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"IT Support Analyst", employer:"SaskTech", field:"Technology", salary:"$60,000 - $80,000 / Yearly", type:"Full-time", location:"Saskatoon, Saskatchewan", description:"Support users.", requirements:"1 year experience", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Office Admin", employer:"Sask Services", field:"Business", salary:"$21 - $28 / Hourly", type:"Full-time", location:"Saskatoon, Saskatchewan", description:"Clerical work.", requirements:"Basic computer skills", benefits:"RRSP", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Construction Laborer", employer:"Regina BuildCo", field:"Construction", salary:"$27 - $35 / Hourly", type:"Full-time", location:"Regina, Saskatchewan", description:"Site labor.", requirements:"Physically fit", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Nurse", employer:"Regina Hospital", field:"Healthcare", salary:"$40 - $55 / Hourly", type:"Full-time", location:"Regina, Saskatchewan", description:"General nursing.", requirements:"RN License", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Sales Representative", employer:"Regina Sales Pro", field:"Sales", salary:"$55,000 - $75,000 / Yearly", type:"Full-time", location:"Regina, Saskatchewan", description:"Sell products.", requirements:"1 year exp", benefits:"Commission", featured:false, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   ALBERTA (Calgary, Edmonton, Red Deer)
======================================================================== */

{ title:"Oilfield Operator", employer:"Alberta Energy", field:"Oil & Gas", salary:"$45 - $70 / Hourly", type:"Rotation", location:"Calgary, Alberta", description:"Oilfield work.", requirements:"Safety tickets", benefits:"Bonus", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Software Engineer", employer:"Calgary Tech Hub", field:"Technology", salary:"$110,000 - $150,000 / Yearly", type:"Full-time", location:"Calgary, Alberta", description:"Back-end development.", requirements:"Java/Node", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Paramedic", employer:"Calgary EMS", field:"Healthcare", salary:"$38 - $50 / Hourly", type:"Full-time", location:"Calgary, Alberta", description:"Emergency care.", requirements:"Paramedic license", benefits:"Pension", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Pipefitter", employer:"AB Industrial", field:"Construction", salary:"$42 - $58 / Hourly", type:"Full-time", location:"Edmonton, Alberta", description:"Pipe fitting.", requirements:"Journeyman", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"IT Consultant", employer:"Edmonton IT", field:"Technology", salary:"$85,000 - $120,000 / Yearly", type:"Full-time", location:"Edmonton, Alberta", description:"Client IT support.", requirements:"CCNA optional", benefits:"Hybrid", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Account Manager", employer:"AB Finance", field:"Finance", salary:"$80,000 - $110,000 / Yearly", type:"Full-time", location:"Edmonton, Alberta", description:"Manage portfolios.", requirements:"Finance degree", benefits:"Bonus", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Welder", employer:"Red Deer MetalWorks", field:"Trades", salary:"$35 - $48 / Hourly", type:"Full-time", location:"Red Deer, Alberta", description:"Welding tasks.", requirements:"CWB cert", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Warehouse Lead", employer:"Red Deer Logistics", field:"Warehousing", salary:"$55,000 - $70,000 / Yearly", type:"Full-time", location:"Red Deer, Alberta", description:"Team leadership.", requirements:"2 years exp", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Pharmacy Technician", employer:"Red Deer Health", field:"Healthcare", salary:"$28 - $35 / Hourly", type:"Full-time", location:"Red Deer, Alberta", description:"Pharmacy operations.", requirements:"Tech license", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   BRITISH COLUMBIA (Vancouver, Victoria, Kelowna, Surrey)
======================================================================== */

{ title:"UX Designer", employer:"Pacific Design", field:"Technology", salary:"$90,000 - $120,000 / Yearly", type:"Full-time", location:"Vancouver, British Columbia", description:"UX research.", requirements:"Portfolio", benefits:"Hybrid", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Chef", employer:"Vancouver Culinary", field:"Hospitality", salary:"$55,000 - $75,000 / Yearly", type:"Full-time", location:"Vancouver, British Columbia", description:"Kitchen leadership.", requirements:"Culinary diploma", benefits:"Meals", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Electrician", employer:"VanCity Electric", field:"Trades", salary:"$40 - $55 / Hourly", type:"Full-time", location:"Vancouver, British Columbia", description:"Install systems.", requirements:"Red Seal", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Retail Manager", employer:"Island Retail", field:"Retail", salary:"$55,000 - $75,000 / Yearly", type:"Full-time", location:"Victoria, British Columbia", description:"Manage store.", requirements:"Supervision exp", benefits:"Bonus", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Software Developer", employer:"Island Tech", field:"Technology", salary:"$90,000 - $120,000 / Yearly", type:"Full-time", location:"Victoria, British Columbia", description:"Build apps.", requirements:"3 years exp", benefits:"Hybrid", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Carpenter", employer:"Victoria Carpentry", field:"Construction", salary:"$30 - $45 / Hourly", type:"Full-time", location:"Victoria, British Columbia", description:"Carpentry work.", requirements:"Apprentice/Journeyman", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Dental Hygienist", employer:"Kelowna Dental", field:"Healthcare", salary:"$45 - $60 / Hourly", type:"Full-time", location:"Kelowna, British Columbia", description:"Oral care.", requirements:"Hygienist license", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Bookkeeper", employer:"Kelowna Accounting", field:"Finance", salary:"$50,000 - $65,000 / Yearly", type:"Full-time", location:"Kelowna, British Columbia", description:"Accounting support.", requirements:"Bookkeeping exp", benefits:"RRSP", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Customer Service Rep", employer:"Kelowna Services", field:"Business", salary:"$20 - $26 / Hourly", type:"Full-time", location:"Kelowna, British Columbia", description:"Serve customers.", requirements:"Communication", benefits:"Dental", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Class 1 Driver", employer:"Surrey Freight", field:"Logistics", salary:"$28 - $38 / Hourly", type:"Full-time", location:"Surrey, British Columbia", description:"Truck routes.", requirements:"Class 1", benefits:"Bonus", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Warehouse Worker", employer:"Surrey Logistics", field:"Warehousing", salary:"$22 - $29 / Hourly", type:"Full-time", location:"Surrey, British Columbia", description:"Warehouse tasks.", requirements:"Physically fit", benefits:"Insurance", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"IT Support Technician", employer:"Surrey IT", field:"Technology", salary:"$55,000 - $75,000 / Yearly", type:"Full-time", location:"Surrey, British Columbia", description:"IT troubleshooting.", requirements:"Helpdesk exp", benefits:"RRSP", featured:false, published_at:new Date(), createdAt:new Date() },

/* ========================================================================
   NORTHERN CANADA (Yukon, Northwest Territories, Nunavut)
======================================================================== */

{ title:"Community Nurse", employer:"Yukon Health", field:"Healthcare", salary:"$50 - $70 / Hourly", type:"Full-time", location:"Whitehorse, Yukon", description:"Health services.", requirements:"RN license", benefits:"Housing allowance", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Maintenance Worker", employer:"Yukon Services", field:"Trades", salary:"$28 - $40 / Hourly", type:"Full-time", location:"Whitehorse, Yukon", description:"General maintenance.", requirements:"Tools experience", benefits:"OT", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"IT Technician", employer:"Yukon IT", field:"Technology", salary:"$60,000 - $80,000 / Yearly", type:"Full-time", location:"Whitehorse, Yukon", description:"Tech support.", requirements:"IT diploma", benefits:"Health", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Heavy Equipment Operator", employer:"NWT Mining", field:"Mining", salary:"$42 - $55 / Hourly", type:"Rotation", location:"Yellowknife, Northwest Territories", description:"Operate heavy machinery.", requirements:"Operator ticket", benefits:"Rotation bonus", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Teacher", employer:"NWT Schools", field:"Education", salary:"$75,000 - $95,000 / Yearly", type:"Full-time", location:"Yellowknife, Northwest Territories", description:"Teach curriculum.", requirements:"Teaching cert", benefits:"Housing stipend", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Admin Officer", employer:"NWT Gov", field:"Business", salary:"$65,000 - $80,000 / Yearly", type:"Full-time", location:"Yellowknife, Northwest Territories", description:"Admin duties.", requirements:"Office experience", benefits:"Gov pension", featured:false, published_at:new Date(), createdAt:new Date() },

{ title:"Housing Coordinator", employer:"Nunavut Housing", field:"Government", salary:"$80,000 - $110,000 / Yearly", type:"Full-time", location:"Iqaluit, Nunavut", description:"Housing support.", requirements:"Admin exp", benefits:"Northern allowance", featured:true, published_at:new Date(), createdAt:new Date() },
{ title:"Nurse", employer:"Nunavut Health", field:"Healthcare", salary:"$50 - $72 / Hourly", type:"Full-time", location:"Iqaluit, Nunavut", description:"Community care.", requirements:"RN license", benefits:"Housing", featured:false, published_at:new Date(), createdAt:new Date() },
{ title:"Logistics Coordinator", employer:"Nunavut Transport", field:"Logistics", salary:"$70,000 - $95,000 / Yearly", type:"Full-time", location:"Iqaluit, Nunavut", description:"Manage shipments.", requirements:"Supply chain diploma", benefits:"Northern allowance", featured:false, published_at:new Date(), createdAt:new Date() },

];


async function main() {
  const argvPath = process.argv[2];
  let jobsToInsert = SAMPLE_JOBS;

  if (argvPath) {
    const resolved = path.resolve(process.cwd(), argvPath);
    if (!fs.existsSync(resolved)) {
      console.error('File not found:', resolved);
      process.exit(1);
    }
    try {
      const raw = fs.readFileSync(resolved, 'utf8');
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        console.error('JSON file must contain an array of job objects');
        process.exit(1);
      }
      jobsToInsert = parsed;
    } catch (e) {
      console.error('Failed to parse JSON file:', e.message);
      process.exit(1);
    }
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();

    // derive DB name from URI, fallback to jobs_portal
    const dbNameMatch = uri.match(/\/([^/?]+)(\?|$)/);
    const dbName = dbNameMatch && dbNameMatch[1] ? dbNameMatch[1] : 'jobs_portal';
    const db = client.db(dbName);

    // normalize and coerce fields for each job
    const docs = jobsToInsert.map(j => {
      const copy = { ...j };
      // ensure string fields exist
      ['title','employer','field','salary','type','location','description','requirements','benefits']
        .forEach(k => { copy[k] = typeof copy[k] === 'undefined' || copy[k] === null ? '' : String(copy[k]); });

      copy.featured = !!copy.featured;
      copy.published_at = copy.published_at ? new Date(copy.published_at) : new Date();
      copy.createdAt = copy.createdAt ? new Date(copy.createdAt) : new Date();
      return copy;
    });

    const col = db.collection('jobs');
    const r = await col.insertMany(docs);
    console.log(`Inserted ${r.insertedCount} job(s).`);
    Object.values(r.insertedIds).forEach(id => console.log('Inserted id:', id.toString()));
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error inserting jobs:', err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch {}
  }
}

main();
