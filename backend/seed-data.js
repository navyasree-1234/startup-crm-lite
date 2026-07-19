import mongoose from "mongoose";
import User from "./models/User.js";
import Lead from "./models/Lead.js";
import connectDB from "./config/database.js";

async function seed() {
  console.log("🌱 Starting CRM database seeding...");
  
  try {
    await connectDB();

    const email = "navyasreethatigutla@gmail.com";
    const name = "navya sree thatigutla";
    const password = "password123"; // default password

    // 1. Find or create the user
    let user = await User.findOne({ email });
    if (!user) {
      console.log(`👤 User '${email}' not found. Registering new user...`);
      user = await User.create({
        name,
        email,
        password,
        role: "user",
      });
      console.log("👤 User registered successfully!");
    } else {
      console.log(`👤 User '${email}' already exists.`);
    }

    // 2. Clear existing leads for this user to start fresh
    console.log("🧹 Clearing old leads for this user...");
    await Lead.deleteMany({ owner: user._id });
    console.log("🧹 Cleared old leads successfully.");

    // 3. Define sample leads with realistic dates spanning the last 6 months
    const now = new Date();
    
    const getPastDate = (monthsAgo, day = 15) => {
      const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
      return d;
    };

    const mockLeads = [
      {
        name: "Alice Johnson",
        company: "Alpha Tech",
        email: "alice@alphatech.com",
        phone: "555-0199",
        status: "Won",
        source: "Website",
        value: 8500,
        notes: "Highly interested in our enterprise subscription package. Closed successfully.",
        owner: user._id,
        createdAt: getPastDate(5),
      },
      {
        name: "Bob Smith",
        company: "Beta Builders",
        email: "bob@betabuilders.com",
        phone: "555-0144",
        status: "Contacted",
        source: "LinkedIn",
        value: 3200,
        notes: "Followed up after connect on LinkedIn. Shared our pricing brochure.",
        owner: user._id,
        createdAt: getPastDate(4),
      },
      {
        name: "Charlie Brown",
        company: "Gamma Group",
        email: "charlie@gammagroup.com",
        phone: "555-0188",
        status: "Meeting Scheduled",
        source: "Referral",
        value: 5000,
        notes: "Referred by Alpha Tech. Demo scheduled for next Thursday.",
        owner: user._id,
        createdAt: getPastDate(3),
      },
      {
        name: "Diana Prince",
        company: "Wayne Enterprises",
        email: "diana@wayne.com",
        phone: "555-1940",
        status: "Proposal Sent",
        source: "Cold Call",
        value: 12000,
        notes: "Presented custom implementation proposal. Pending review by management.",
        owner: user._id,
        createdAt: getPastDate(2),
      },
      {
        name: "Evan Wright",
        company: "Apex Systems",
        email: "evan@apex.com",
        phone: "555-0122",
        status: "New",
        source: "Email Campaign",
        value: 2500,
        notes: "Opted-in through the summer newsletter download page.",
        owner: user._id,
        createdAt: getPastDate(1),
      },
      {
        name: "Fiona Gallagher",
        company: "Southside Co",
        email: "fiona@southside.com",
        phone: "555-0177",
        status: "Lost",
        source: "Other",
        value: 1500,
        notes: "Decided to go with a competitor due to lower pricing options.",
        owner: user._id,
        createdAt: getPastDate(1),
      },
      {
        name: "George Clark",
        company: "Innovate Corp",
        email: "george@innovate.com",
        phone: "555-0133",
        status: "Won",
        source: "Website",
        value: 9500,
        notes: "Closed deal on our customized onboarding model. Onboarding starts next week.",
        owner: user._id,
        createdAt: getPastDate(0, 5), // earlier this month
      },
      {
        name: "Hannah Abbott",
        company: "Hufflepuff Ltd",
        email: "hannah@hufflepuff.com",
        phone: "555-0166",
        status: "New",
        source: "LinkedIn",
        value: 4500,
        notes: "Expressed interest in pipeline manager integrations.",
        owner: user._id,
        createdAt: getPastDate(0, 10), // mid this month
      },
      {
        name: "Ian Malcolm",
        company: "Jurassic Research",
        email: "ian@jurassic.com",
        phone: "555-0111",
        status: "Contacted",
        source: "Referral",
        value: 6200,
        notes: "Interested in data security protocols and data sovereignty features.",
        owner: user._id,
        createdAt: getPastDate(0, now.getDate() - 1), // yesterday
      },
      {
        name: "Tony Stark",
        company: "Stark Industries",
        email: "tony@stark.com",
        phone: "555-3000",
        status: "Won",
        source: "Referral",
        value: 150000,
        notes: "Enterprise contract for energy management solutions. Closed successfully.",
        owner: user._id,
        createdAt: getPastDate(3),
      },
      {
        name: "Bruce Banner",
        company: "Hulk Labs",
        email: "bruce@hulklabs.com",
        phone: "555-0700",
        status: "Meeting Scheduled",
        source: "LinkedIn",
        value: 6700,
        notes: "Interested in bio-health tracking APIs. Demo scheduled next Monday.",
        owner: user._id,
        createdAt: getPastDate(1),
      },
      {
        name: "Peter Parker",
        company: "Daily Bugle",
        email: "peter@dailybugle.com",
        phone: "555-0800",
        status: "New",
        source: "Website",
        value: 1200,
        notes: "Inquired about freelance management tool subscriptions.",
        owner: user._id,
        createdAt: getPastDate(0, 12),
      },
      {
        name: "Clark Kent",
        company: "Daily Planet",
        email: "clark@dailyplanet.com",
        phone: "555-0900",
        status: "Proposal Sent",
        source: "Email Campaign",
        value: 8500,
        notes: "Sent proposal for newsroom digital pipeline tracker licenses.",
        owner: user._id,
        createdAt: getPastDate(0, 15),
      }
    ];

    // 4. Save leads into the database
    console.log("💾 Inserting mock leads into database...");
    const leads = await Lead.insertMany(mockLeads);
    console.log(`💾 Successfully seeded ${leads.length} mock leads!`);

    console.log("\n🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
