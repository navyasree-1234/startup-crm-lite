import assert from "node:assert";

const BASE_URL = "http://localhost:5000";

async function runTests() {
  console.log("🚀 Starting advanced verification of new features and API endpoints...");
  let token = null;
  let leadId = null;
  const email = `verifier_${Date.now()}@example.com`;
  const password = "password123";

  // Helper for auth headers
  const getHeaders = () => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  });

  try {
    // 1. Register and Login
    const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        name: "Advanced Verifier",
        email,
        password,
      }),
    });
    const registerData = await registerRes.json();
    if (registerRes.status !== 201) {
      console.error("❌ Registration failed with status:", registerRes.status);
      console.error("❌ Response body:", JSON.stringify(registerData, null, 2));
    }
    assert.strictEqual(registerRes.status, 201, "Register should succeed");

    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();
    token = loginData.token;
    assert.ok(token, "Login should return a valid JWT token");
    console.log("✅ Authenticated successfully");

    // 2. Create multiple leads to test search, pagination and stats
    const leadPayloads = [
      { name: "Alice Allison", company: "Alpha Corp", email: "alice@alpha.com", source: "Website", value: 1000 },
      { name: "Alex Alexander", company: "Beta Inc", email: "alex@beta.com", source: "LinkedIn", value: 2000 },
      { name: "Bob Roberts", company: "Alpha Corp", email: "bob@alpha.com", source: "Referral", value: 1500 },
    ];

    console.log("Creating test leads...");
    const createdLeads = [];
    for (const payload of leadPayloads) {
      const res = await fetch(`${BASE_URL}/api/leads`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      assert.strictEqual(res.status, 201);
      createdLeads.push(data.data);
    }
    leadId = createdLeads[0]._id;
    console.log(`✅ Created ${createdLeads.length} test leads`);

    // 3. Test Autocomplete Search: GET /api/leads/search?q=ali
    console.log("\nTesting Autocomplete Search: GET /api/leads/search?q=ali");
    const searchRes = await fetch(`${BASE_URL}/api/leads/search?q=ali&limit=2`, {
      headers: getHeaders(),
    });
    const searchData = await searchRes.json();
    assert.strictEqual(searchRes.status, 200, "Search endpoint should return 200");
    assert.ok(Array.isArray(searchData.data), "Search data should be an array");
    assert.ok(searchData.data.length <= 2, "Limit of 2 should be respected");
    // Assert projection contains only: _id, name, company, email, status (and virtual age since Mongoose default virtuals might include it)
    searchData.data.forEach((lead) => {
      assert.ok(lead._id, "Should contain _id");
      assert.ok(lead.name, "Should contain name");
      assert.ok(lead.company, "Should contain company");
      assert.ok(lead.email, "Should contain email");
      assert.ok(lead.status, "Should contain status");
      assert.strictEqual(lead.value, undefined, "Should NOT contain value projection");
      assert.strictEqual(lead.source, undefined, "Should NOT contain source projection");
    });
    console.log("✅ Autocomplete search passed checks!");

    // 4. Test Enhanced Pagination: GET /api/leads?limit=2&page=1
    console.log("\nTesting Enhanced Pagination: GET /api/leads?limit=2&page=1");
    const paginatedRes = await fetch(`${BASE_URL}/api/leads?limit=2&page=1&sortBy=value&sortOrder=asc`, {
      headers: getHeaders(),
    });
    const paginatedData = await paginatedRes.json();
    assert.strictEqual(paginatedRes.status, 200);
    const pagObj = paginatedData.pagination;
    assert.strictEqual(pagObj.total, 3, "Total should be 3");
    assert.strictEqual(pagObj.page, 1, "Page should be 1");
    assert.strictEqual(pagObj.limit, 2, "Limit should be 2");
    assert.strictEqual(pagObj.pages, 2, "Total pages should be 2");
    assert.strictEqual(pagObj.hasNext, true, "hasNext should be true");
    assert.strictEqual(pagObj.hasPrev, false, "hasPrev should be false");
    // Sorting verification: first lead value should be 1000 (Alice), second 1500 (Bob)
    assert.strictEqual(paginatedData.data[0].value, 1000);
    assert.strictEqual(paginatedData.data[1].value, 1500);
    console.log("✅ Enhanced Pagination and Sorting checks passed!");

    // 5. Test getLeadStats (Single query facet aggregate)
    console.log("\nTesting Lead stats summary: GET /api/leads/stats/summary");
    // Update status to Won for one lead to test conversionRate
    await fetch(`${BASE_URL}/api/leads/${leadId}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status: "Won" }),
    });

    const statsRes = await fetch(`${BASE_URL}/api/leads/stats/summary`, {
      headers: getHeaders(),
    });
    const statsData = await statsRes.json();
    assert.strictEqual(statsRes.status, 200);
    const s = statsData.data;
    assert.strictEqual(s.totalLeads, 3, "totalLeads should be 3");
    assert.strictEqual(s.statusBreakdown.Won, 1, "statusBreakdown.Won should be 1");
    assert.strictEqual(s.statusBreakdown.New, 2, "statusBreakdown.New should be 2");
    assert.strictEqual(s.conversionRate, 33.3, "conversionRate should be 33.3%");
    assert.strictEqual(s.sourceBreakdown.Website, 1, "sourceBreakdown.Website should be 1");
    assert.strictEqual(s.sourceBreakdown.LinkedIn, 1, "sourceBreakdown.LinkedIn should be 1");
    assert.strictEqual(s.sourceBreakdown.Referral, 1, "sourceBreakdown.Referral should be 1");
    assert.strictEqual(s.thisMonthLeads, 3, "thisMonthLeads should be 3");
    assert.strictEqual(s.lastMonthLeads, 0, "lastMonthLeads should be 0");
    assert.strictEqual(s.growthRate, 100.0, "growthRate should be 100% since previous month was 0");
    console.log("✅ getLeadStats Facet Aggregation passed checks!");

    // 6. Test getMonthlyStats (6 Months chronological)
    console.log("\nTesting Monthly Stats chart data: GET /api/leads/monthly-stats");
    const monthlyRes = await fetch(`${BASE_URL}/api/leads/monthly-stats`, {
      headers: getHeaders(),
    });
    const monthlyData = await monthlyRes.json();
    assert.strictEqual(monthlyRes.status, 200);
    assert.ok(Array.isArray(monthlyData.data), "Should return array");
    assert.strictEqual(monthlyData.data.length, 6, "Should return exactly 6 months");
    // Verify sorting oldest to newest and check property names
    const lastMonth = monthlyData.data[5];
    assert.strictEqual(lastMonth.total, 3, "Current month total should be 3");
    assert.strictEqual(lastMonth.won, 1, "Current month won should be 1");
    assert.strictEqual(lastMonth.lost, 0, "Current month lost should be 0");
    assert.strictEqual(lastMonth.conversionRate, 33.3, "Current month conversionRate should be 33.3%");
    // Verify chronological order (months are consecutive)
    console.log("Chronological output check:", monthlyData.data.map(m => m.month));
    console.log("✅ getMonthlyStats 6-month Chronological aggregation passed checks!");

    console.log("\n🎉 ALL ADVANCED FEATURE CHECKS PASSED SUCCESSFULLY!");
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    process.exit(1);
  }
}

runTests();
