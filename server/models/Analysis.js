import mongoose from "mongoose"

const keywordAnalysisSchema = new mongoose.Schema({
  matched: [String],
  missing: [String],
  score: {
    type: Number,
    min: 0,
    max: 100,
  },
})

const sectionAnalysisSchema = new mongoose.Schema({
  skills: {
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    suggestions: [String],
    detectedSkills: [String],
    missingSkills: [String],
  },
  experience: {
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    suggestions: [String],
    yearsDetected: Number,
    relevantExperience: Boolean,
  },
  education: {
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    suggestions: [String],
    detectedDegrees: [String],
    relevantEducation: Boolean,
  },
  formatting: {
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    suggestions: [String],
    issues: [String],
  },
})

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobDetails: {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      company: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        required: true,
      },
      requirements: [String],
      preferredSkills: [String],
      experienceLevel: String,
      location: String,
    },
    resumeData: {
      originalText: String,
      processedText: String,
      wordCount: Number,
      sections: {
        contact: String,
        summary: String,
        experience: String,
        education: String,
        skills: String,
        projects: String,
        certifications: String,
      },
    },
    analysis: {
      overallScore: {
        type: Number,
     
        min: 0,
        max: 100,
      },
      keywordAnalysis: keywordAnalysisSchema,
      sectionAnalysis: sectionAnalysisSchema,
      suggestions: [
        {
          type: String,
          priority: {
            type: String,
            enum: ["high", "medium", "low"],
            default: "medium",
          },
          category: String,
          description: String,
        },
      ],
      strengths: [String],
      weaknesses: [String],
    },
    metadata: {
      processingTime: Number,
      aiModel: String,
      version: String,
      confidence: Number,
    },
    status: {
      type: String,
      enum: ["processing", "completed", "failed"],
      default: "processing",
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
analysisSchema.index({ userId: 1, createdAt: -1 })
analysisSchema.index({ "jobDetails.title": "text", "jobDetails.company": "text" })

export default mongoose.model("Analysis", analysisSchema)
