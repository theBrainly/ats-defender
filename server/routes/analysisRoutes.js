import express from "express"
import mongoose from "mongoose" // Import mongoose to use ObjectId
import Analysis from "../models/Analysis.js"
import User from "../models/User.js"
import { AIAnalyzer } from "../utils/AIAnalyzer.js"

const router = express.Router()
const aiAnalyzer = new AIAnalyzer()

// Helper function to determine score status
/**
 * Active: 2026-01-07
 * Function: getScoreStatus
 */
function getScoreStatus(score) {
  if (score >= 80) return "excellent"
  if (score >= 60) return "good"
  return "needs-improvement"
}

// POST /api/analysis/scan - Analyze resume against job description
router.post("/scan", async (req, res) => {
  try {
    const { resumeText, jobDescription, jobTitle, company, location } = req.body
    const userId = req.user?.id

    console.log("Received scan request:", {
      hasResume: !!resumeText,
      hasJobDesc: !!jobDescription,
      jobTitle
    });

    // Validate input
    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Resume text, job description, and job title are required",
      })
    }

    // Check if user is logged in
    if (userId) {
      // Check scan limits for logged-in users
      const user = await User.findById(userId);
      if (user.scanCount >= user.scanLimit) {
        return res.status(403).json({
          error: "Scan limit reached",
          message: "You have reached your maximum scan limit of " + user.scanLimit + " scans.",
          scanCount: user.scanCount,
          scanLimit: user.scanLimit
        });
      }
    }

    // Create analysis record
    const analysis = new Analysis({
      userId,
      jobDetails: {
        title: jobTitle || "",
        company: company || "",
        description: jobDescription,
        location: location || "",
      },
      resumeData: {
        originalText: resumeText,
        wordCount: resumeText.split(" ").length,
      },
      status: "processing",
    })
    //  console.log(analysis)
    await analysis.save()
    //  console.log("anssssssssssss      "+ans)
    // Perform AI analysis
    const startTime = Date.now()

    try {
      // Extract job requirements using AI
      // console.log("Extracting job keywords...")
      const jobKeywords = await aiAnalyzer.extractJobKeywords(jobDescription)
      // console.log("jobKeywords:", jobKeywords)

      // Analyze resume content using AI
      // console.log("Analyzing resume content...")
      const resumeAnalysis = await aiAnalyzer.analyzeResumeContent(resumeText)
      // console.log("resumeAnalysis:", resumeAnalysis)

      // Calculate keyword matching
      // console.log("Calculating keyword matches...")
      const keywordMatch = aiAnalyzer.calculateKeywordMatch(resumeAnalysis.skills, jobKeywords)
      // console.log("keywordMatch:", keywordMatch)

      // Calculate section scores
      // console.log("Calculating section scores...")
      const sectionScores = aiAnalyzer.calculateSectionScores(resumeAnalysis, jobKeywords)
      // console.log("sectionScores:", sectionScores)

      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        keywordMatch.score * 0.4 +
        sectionScores.skills.score * 0.25 +
        sectionScores.experience.score * 0.2 +
        sectionScores.education.score * 0.1 +
        sectionScores.formatting.score * 0.05,
      )
      // console.log("overallScore:", overallScore)

      // Generate AI-powered suggestions
      // console.log("Generating suggestions...")
      const suggestions = await aiAnalyzer.generateSuggestions(resumeAnalysis, jobKeywords, overallScore)
      // console.log("suggestions:", suggestions)

      const processingTime = Date.now() - startTime

      // Update analysis with results
      analysis.analysis = {
        overallScore,
        keywordAnalysis: {
          matched: keywordMatch.matched, // array of strings
          missing: keywordMatch.missing, // array of strings
          score: keywordMatch.score,
        },
        sectionAnalysis: sectionScores,
        suggestions: suggestions.map((suggestion) => suggestion.description || suggestion),
        strengths: resumeAnalysis.strengths || [],
        weaknesses: resumeAnalysis.weaknesses || [],
      }

      analysis.resumeData.processedText = resumeText
      analysis.jobDetails.requirements = jobKeywords.requiredSkills || []
      analysis.jobDetails.preferredSkills = jobKeywords.preferredSkills || []
      analysis.jobDetails.experienceLevel = jobKeywords.experienceLevel || ""

      analysis.metadata = {
        processingTime,
        aiModel: aiAnalyzer.model,
        version: "2.0",
      }

      analysis.status = "completed"
      await analysis.save()

      // console.log("API FINAL RESPONSE:", analysis.analysis)

      // Increment user's scan count if authenticated
      if (userId) {
        const user = await User.findById(userId)
        if (user) {
          await user.incrementScanCount()
        }
      }

      console.log(`Analysis completed in ${processingTime}ms with score: ${overallScore}`)

      // Format response to match client expectations
      const formattedResponse = {
        success: true,
        analysisId: analysis._id,
        results: {
          overallScore,
          // Format keyword analysis
          keywordAnalysis: {
            matched: keywordMatch.matched,
            missing: keywordMatch.missing,
            score: keywordMatch.score,
          },
          // Format section analysis
          sectionAnalysis: {
            skills: {
              score: sectionScores.skills.score,
              feedback: sectionScores.skills.feedback,
              suggestions: sectionScores.skills.suggestions,
              detectedSkills: sectionScores.skills.detectedSkills,
              missingSkills: sectionScores.skills.missingSkills,
            },
            experience: {
              score: sectionScores.experience.score,
              feedback: sectionScores.experience.feedback,
              suggestions: sectionScores.experience.suggestions,
              yearsDetected: sectionScores.experience.yearsDetected,
              relevantExperience: sectionScores.experience.relevantExperience,
            },
            education: {
              score: sectionScores.education.score,
              feedback: sectionScores.education.feedback,
              suggestions: sectionScores.education.suggestions,
              detectedDegrees: sectionScores.education.detectedDegrees,
              relevantEducation: sectionScores.education.relevantEducation,
            },
            formatting: {
              score: sectionScores.formatting.score,
              feedback: sectionScores.formatting.feedback,
              suggestions: sectionScores.formatting.suggestions,
              issues: sectionScores.formatting.issues,
            },
          },
          // Format suggestions
          suggestions: suggestions.map((suggestion) => ({
            text: suggestion.description || suggestion,
            priority: suggestion.priority || "medium",
            category: suggestion.category || "general",
          })),
          // Include strengths and weaknesses
          strengths: resumeAnalysis.strengths || [],
          weaknesses: resumeAnalysis.weaknesses || [],
          // Include processing metadata
          processingTime,
          // Include section scores in the format expected by the client
          skills_score: sectionScores.skills.score,
          skills_feedback: sectionScores.skills.feedback,
          experience_score: sectionScores.experience.score,
          experience_feedback: sectionScores.experience.feedback,
          keywords_score: keywordMatch.score,
          keywords_feedback: `Matched ${keywordMatch.matched.length} out of ${keywordMatch.matched.length + keywordMatch.missing.length} keywords`,
        },
      }

      res.json(formattedResponse)
    } catch (analysisError) {
      console.error("Analysis failed:", analysisError)
      analysis.status = "failed"
      analysis.error = {
        message: analysisError.message,
        stack: process.env.NODE_ENV === "development" ? analysisError.stack : undefined,
      }
      await analysis.save()

      res.status(500).json({
        error: "Analysis failed",
        message: "Unable to complete resume analysis. Please try again.",
      })
    }
  } catch (error) {
    console.error("Scan endpoint error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to process scan request",
    })
  }
})

// GET /api/analysis/history - Get user's analysis history
router.get("/history", async (req, res) => {
  try {
    console.log("[History] Fetching history...")
    const userId = req.user?.id
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // If no user, return empty history
    if (!userId) {
      return res.json({
        success: true,
        history: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      })
    }

    // Convert userId to ObjectId for MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(userId)

    const analyses = await Analysis.find({
      userId: userObjectId,
      status: "completed",
    })
      .select("jobDetails analysis.overallScore createdAt metadata")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Analysis.countDocuments({
      userId: userObjectId,
      status: "completed",
    })

    const formattedHistory = analyses.map((analysis) => ({
      id: analysis._id,
      jobTitle: analysis.jobDetails.title,
      company: analysis.jobDetails.company,
      score: analysis.analysis.overallScore,
      date: analysis.createdAt,
      processingTime: analysis.metadata?.processingTime,
      status: getScoreStatus(analysis.analysis.overallScore),
    }))

    res.json({
      success: true,
      history: formattedHistory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("History endpoint error:", error)
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Unable to fetch analysis history",
    })
  }
})

// GET /api/analysis/:id - Get specific analysis details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id
    console.log("User ID:", userId)

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "The provided analysis ID is not valid",
      })
    }

    const analysis = await Analysis.findById(id)

    if (!analysis) {
      return res.status(404).json({
        error: "Analysis not found",
        message: "The requested analysis does not exist",
      })
    }

    // Check ownership if user is authenticated
    if (userId && analysis.userId && !analysis.userId.equals(userId)) {
      return res.status(403).json({
        error: "Access denied",
        message: "You do not have permission to access this analysis",
      })
    }

    res.json({
      success: true,
      analysis: {
        id: analysis._id,
        jobDetails: analysis.jobDetails,
        results: analysis.analysis,
        metadata: analysis.metadata,
        createdAt: analysis.createdAt,
        status: analysis.status,
      },
    })
  } catch (error) {
    console.error("Get analysis error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to fetch analysis details",
    })
  }
})

// DELETE /api/analysis/:id - Delete specific analysis
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid ID format",
        message: "The provided analysis ID is not valid",
      })
    }

    const analysis = await Analysis.findById(id)

    if (!analysis) {
      return res.status(404).json({
        error: "Analysis not found",
        message: "The requested analysis does not exist",
      })
    }

    // Check ownership
    if (userId && analysis.userId && !analysis.userId.equals(userId)) {
      return res.status(403).json({
        error: "Access denied",
        message: "You do not have permission to delete this analysis",
      })
    }

    await Analysis.deleteOne({ _id: id })

    res.json({
      success: true,
      message: "Analysis deleted successfully",
    })
  } catch (error) {
    console.error("Delete analysis error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to delete analysis",
    })
  }
})

// GET /api/analysis/stats/overview - Get user's analysis statistics
router.get("/stats/overview", async (req, res) => {
  try {
    const userId = req.user?.id

    // Return empty stats if no user
    if (!userId) {
      return res.json({
        success: true,
        stats: {
          totalScans: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          recentScans: [],
          recentScansCount: 0,
          improvement: 0,
        },
      })
    }

    const stats = await Analysis.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },
      {
        $group: {
          _id: null,
          totalScans: { $sum: 1 },
          averageScore: { $avg: "$analysis.overallScore" },
          highestScore: { $max: "$analysis.overallScore" },
          lowestScore: { $min: "$analysis.overallScore" },
          recentScans: {
            $push: {
              score: "$analysis.overallScore",
              date: "$createdAt",
            },
          },
        },
      },
    ])

    const userStats = stats[0] || {
      totalScans: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      recentScans: [],
    }

    // Calculate improvement based on last 5 scans
    let improvement = 0
    const recentScores = userStats.recentScans
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map((item) => item.score)

    if (recentScores.length > 1) {
      improvement = recentScores[0] - recentScores[recentScores.length - 1]
    }

    res.json({
      success: true,
      stats: {
        totalScans: userStats.totalScans,
        averageScore: Math.round(userStats.averageScore || 0),
        highestScore: userStats.highestScore,
        lowestScore: userStats.lowestScore,
        recentScans: userStats.recentScans.slice(0, 5),
        recentScansCount: userStats.recentScans.length,
        improvement,
      },
    })
  } catch (error) {
    console.error("Stats endpoint error:", error)
    res.status(500).json({
      error: "Internal server error",
      message: "Unable to fetch statistics",
    })
  }
})

// GET /api/analysis/scan-stats - Get user scan count and limit
router.get("/scan-stats", async (req, res) => {
  try {
    const userId = req.user?.id

    // If no user is logged in, return default values
    if (!userId) {
      return res.json({
        success: true,
        scanCount: 0,
        scanLimit: 25,
        canScan: true
      })
    }

    // Get user scan count and limit
    const user = await User.findById(userId).select('scanCount scanLimit')
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      })
    }

    res.json({
      success: true,
      scanCount: user.scanCount,
      scanLimit: user.scanLimit,
      canScan: user.scanCount < user.scanLimit,
      remaining: user.scanLimit - user.scanCount
    })
  } catch (error) {
    console.error("Error getting scan stats:", error)
    res.status(500).json({
      success: false,
      error: "Failed to get scan statistics"
    })
  }
})

export default router
