import Lead from "../models/Lead.js";
import { successResponse, errorResponse, paginatedResponse } from "../utils/apiResponse.js";

/**
 * Controller: Get all leads belonging to the authenticated user.
 * Supports filtering by status, regex searching (name, company, email), and pagination.
 * 
 * Inputs:
 * - req.query: { status, search, page, limit, sortBy, sortOrder }
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns a paginated JSON list of leads.
 * 
 * Side Effects:
 * - Queries the database.
 */
/**
 * Controller: Get all leads belonging to the authenticated user.
 * Supports filtering by status, source, date ranges, regex searching (name, company, email), and pagination.
 * 
 * Inputs:
 * - req.query: { status, search, source, dateFrom, dateTo, page, limit, sortBy, sortOrder }
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns a paginated JSON list of leads with metadata { total, page, limit, pages, hasNext, hasPrev }.
 */
export const getLeads = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[getLeads] User ${req.user._id} requested leads list.`);
    }

    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
      status,
      search,
      source,
      dateFrom,
      dateTo,
    } = req.query;

    // Build the query filter - enforce owner isolation
    const filter = { owner: req.user._id };

    // Apply status filter if provided and not 'All'
    if (status && status !== "All") {
      filter.status = status;
    }

    // Apply source filter if provided and not 'All'
    if (source && source !== "All") {
      filter.source = source;
    }

    // Apply search filter using regex (case-insensitive) across name, company, and email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Apply date range filters on createdAt using $gte/$lte
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skip = (pageNum - 1) * limitNum;

    // Define allowed sort fields for safety
    const allowedSortFields = ["name", "company", "email", "status", "source", "value", "createdAt", "updatedAt"];
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
    const sortDir = sortOrder === "asc" ? 1 : -1;

    // Fetch leads & total count in parallel
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ [finalSortBy]: sortDir })
        .skip(skip)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Create a new lead.
 * 
 * Inputs:
 * - req.body: Lead schema attributes
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns the newly created lead document (201 status).
 * 
 * Side Effects:
 * - Inserts a new Lead document into the database.
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[createLead] User ${req.user._id} is creating a new lead.`);
    }

    // Bind owner field explicitly to the authenticated user
    const newLeadData = {
      ...req.body,
      owner: req.user._id,
    };

    const lead = await Lead.create(newLeadData);

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Retrieve a specific lead by its ID.
 * Enforces owner isolation.
 * 
 * Inputs:
 * - req.params.id: Target lead ID
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns the matched lead document.
 * 
 * Side Effects:
 * - Queries the database.
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[getLeadById] User ${req.user._id} requested lead: ${req.params.id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    return successResponse(res, lead, "Lead retrieved successfully", 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Update a specific lead.
 * Prevents changing the owner field and enforces owner isolation.
 * 
 * Inputs:
 * - req.params.id: Target lead ID
 * - req.body: Updated attributes
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns the updated lead document.
 * 
 * Side Effects:
 * - Modifies an existing Lead document.
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[updateLead] User ${req.user._id} updating lead: ${req.params.id}`);
    }

    // Defensive check: Do NOT allow modifying the owner
    const updateData = { ...req.body };
    delete updateData.owner;

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { returnDocument: "after", runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    return successResponse(res, lead, "Lead updated successfully", 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Update status of a lead.
 * Enforces owner isolation and enum validations.
 * 
 * Inputs:
 * - req.params.id: Target lead ID
 * - req.body.status: New status string
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns the updated lead document.
 * 
 * Side Effects:
 * - Modifies an existing Lead document's status.
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (process.env.NODE_ENV === "development") {
      console.log(`[updateLeadStatus] User ${req.user._id} updating lead: ${req.params.id} to status: ${status}`);
    }

    const validStatuses = ["New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, "Invalid status value", 400);
    }

    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    return successResponse(res, lead, "Lead status updated successfully", 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Delete a lead.
 * Enforces owner isolation.
 * 
 * Inputs:
 * - req.params.id: Target lead ID
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns success message on deletion.
 * 
 * Side Effects:
 * - Removes a Lead document from the database.
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[deleteLead] User ${req.user._id} is deleting lead: ${req.params.id}`);
    }

    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user._id });
    
    if (!lead) {
      return errorResponse(res, "Lead not found", 404);
    }

    await lead.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get pipeline statistics aggregated by status.
 * Calculates total, won, lost counts, and conversion rate.
 * 
 * Inputs:
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns stats aggregation dashboard payload.
 * 
 * Side Effects:
 * - Computes database aggregates.
 */
/**
 * Controller: Get overall pipeline statistics aggregated by status and source.
 * Calculates conversion rates, monthly trends, growth rate, status and source breakdowns.
 * Runs in a single aggregation query using $facet.
 * 
 * Inputs:
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns a formatted statistics JSON object.
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[getLeadStats] User ${req.user._id} requested dashboard statistics.`);
    }

    // Determine current and previous calendar month bounds
    const now = new Date();
    const thisYear = now.getFullYear();
    const thisMonthNum = now.getMonth() + 1; // 1-indexed (1-12)

    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastYear = lastMonthDate.getFullYear();
    const lastMonthNum = lastMonthDate.getMonth() + 1; // 1-indexed (1-12)

    const stats = await Lead.aggregate([
      // Enforce owner isolation
      { $match: { owner: req.user._id } },
      
      // Perform all breakdown counts inside a single query via $facet
      {
        $facet: {
          total: [
            { $count: "count" }
          ],
          statusGroup: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          sourceGroup: [
            { $group: { _id: "$source", count: { $sum: 1 } } }
          ],
          monthlyGroup: [
            {
              $group: {
                _id: null,
                thisMonthLeads: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: [{ $year: "$createdAt" }, thisYear] },
                          { $eq: [{ $month: "$createdAt" }, thisMonthNum] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                },
                lastMonthLeads: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: [{ $year: "$createdAt" }, lastYear] },
                          { $eq: [{ $month: "$createdAt" }, lastMonthNum] }
                        ]
                      },
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    const totalLeads = stats[0]?.total[0]?.count || 0;
    const statusGroup = stats[0]?.statusGroup || [];
    const sourceGroup = stats[0]?.sourceGroup || [];
    const monthlyGroup = stats[0]?.monthlyGroup[0] || { thisMonthLeads: 0, lastMonthLeads: 0 };

    const thisMonthLeads = monthlyGroup.thisMonthLeads;
    const lastMonthLeads = monthlyGroup.lastMonthLeads;

    // Format full status breakdown
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      "Meeting Scheduled": 0,
      "Proposal Sent": 0,
      Won: 0,
      Lost: 0,
    };
    statusGroup.forEach((item) => {
      if (statusBreakdown.hasOwnProperty(item._id)) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Format full source breakdown
    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      "Cold Call": 0,
      "Email Campaign": 0,
      Other: 0,
    };
    sourceGroup.forEach((item) => {
      if (sourceBreakdown.hasOwnProperty(item._id)) {
        sourceBreakdown[item._id] = item.count;
      }
    });

    // conversionRate: (won / total) * 100, rounded to 1 decimal. Safeguard division by zero.
    const wonLeads = statusBreakdown.Won;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100 * 10) / 10 : 0.0;

    // growthRate: ((thisMonth - lastMonth) / lastMonth) * 100, rounded to 1 decimal. Safeguard division by zero.
    let growthRate = 0.0;
    if (lastMonthLeads > 0) {
      growthRate = Math.round(((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100 * 10) / 10;
    } else if (thisMonthLeads > 0) {
      growthRate = 100.0;
    }

    return res.status(200).json({
      success: true,
      data: {
        totalLeads,
        statusBreakdown,
        conversionRate,
        sourceBreakdown,
        thisMonthLeads,
        lastMonthLeads,
        growthRate,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Get monthly aggregation details of lead counts for the last 6 months.
 * Sorted chronologically from oldest to newest, zero-padded for empty months.
 * 
 * Inputs:
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns array of six monthly items: [{ month, total, won, lost, conversionRate }]
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log(`[getMonthlyStats] User ${req.user._id} requested monthly aggregation details.`);
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Date from 6 months ago (including current month)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyLeads = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          won: {
            $sum: {
              $cond: [{ $eq: ["$status", "Won"] }, 1, 0],
            },
          },
          lost: {
            $sum: {
              $cond: [{ $eq: ["$status", "Lost"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Build default structures for 6 months to handle missing months chronologically
    const last6Months = [];
    const tempDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(tempDate.getFullYear(), tempDate.getMonth() - i, 1);
      const year = targetDate.getFullYear();
      const monthIdx = targetDate.getMonth();
      last6Months.push({
        year,
        monthNum: monthIdx + 1,
        month: `${monthNames[monthIdx]} ${year}`,
        total: 0,
        won: 0,
        lost: 0,
        conversionRate: 0.0,
      });
    }

    // Populate actual counts and calculate conversionRate safely
    monthlyLeads.forEach((dbItem) => {
      const match = last6Months.find(
        (m) => m.year === dbItem._id.year && m.monthNum === dbItem._id.month
      );
      if (match) {
        match.total = dbItem.total;
        match.won = dbItem.won;
        match.lost = dbItem.lost;
        match.conversionRate = dbItem.total > 0 ? Math.round((dbItem.won / dbItem.total) * 100 * 10) / 10 : 0.0;
      }
    });

    // Format output array according to specification
    const formattedResult = last6Months.map(({ month, total, won, lost, conversionRate }) => ({
      month,
      total,
      won,
      lost,
      conversionRate,
    }));

    return res.status(200).json({
      success: true,
      data: formattedResult,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller: Autocomplete search leads by query text.
 * Returns only: _id, name, company, email, status, limited to 5 results for performance.
 * 
 * Inputs:
 * - req.query.q: Search query string
 * - req.query.limit: Limit of results (default 5)
 * - req.user._id: Authenticated user's ID
 * 
 * Outputs:
 * - Returns a JSON array containing matching leads.
 */
export const searchLeadsAutocomplete = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const limitNum = parseInt(limit, 10) || 5;

    const query = {
      owner: req.user._id,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    };

    const leads = await Lead.find(query)
      .select("_id name company email status")
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};
