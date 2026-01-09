import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()
export class AIAnalyzer {
  constructor() {
    this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.apiKey = process.env.OPENROUTER_API_KEY;
    // Options provided:
    // Arcee AI: arcee-ai/trinity-large-preview:free
    // StepFun: stepfun/step-3.5-flash:free
    // Upstage: upstage/solar-pro-3-preview:free
    // LiquidAI Thinking: liquid/lfm-2.5-1.2b-thinking:free
    // LiquidAI Instruct: liquid/lfm-2.5-1.2b:free (Failed validation: invalid model ID)

    this.defaultModel = 'meta-llama/llama-3.3-70b-instruct:free';
    this.fallbackModel = 'microsoft/phi-3-mini-128k-instruct:free';
  }

  // Extract keywords from job description using yesOpenRouter
  async extractJobKeywords(jobDescription) {
    try {
      const response = await this._sendOpenRouterRequest(
        `Analyze this job description and extract in JSON format:
{
  "requiredSkills": [],
  "preferredSkills": [],
  "industryKeywords": [],
  "softSkills": [],
  "experienceLevel": ""
}

Job Description:
${jobDescription}

Return ONLY valid JSON without any additional text.`,
        'json_object'
      );
      // console.log(response)
      return this._validateJobKeywords(response);
    } catch (error) {
      console.error("Error extracting job keywords:", error);
      return this.fallbackKeywordExtraction(jobDescription);
    }
  }

  // Analyze resume content using OpenRouter
  async analyzeResumeContent(resumeText) {
    try {
      const response = await this._sendOpenRouterRequest(
        `Analyze this resume and return a valid JSON object with the following structure. Ensure all arrays are properly formatted and all values are valid JSON types:
{
  "skills": ["skill1", "skill2"],
  "experience": {"years": 0},
  "education": {"degrees": ["degree1", "degree2"]},
  "achievements": ["achievement1", "achievement2"],
  "formatting": {"issues": ["issue1", "issue2"]},
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}

Resume text (truncated to 3000 chars):
${resumeText.substring(0, 3000)}

IMPORTANT: Return ONLY the JSON object without any additional text, markdown formatting, or code blocks.`,
        'json_object'
      );

      // Additional validation to ensure arrays are properly formatted
      if (response) {
        // Ensure all array fields are actually arrays
        const validatedResponse = {
          skills: Array.isArray(response.skills) ? response.skills : [],
          experience: {
            years: typeof response.experience?.years === 'number' ? response.experience.years : 0
          },
          education: {
            degrees: Array.isArray(response.education?.degrees) ? response.education.degrees : []
          },
          achievements: Array.isArray(response.achievements) ? response.achievements : [],
          formatting: {
            issues: Array.isArray(response.formatting?.issues) ? response.formatting.issues : []
          },
          strengths: Array.isArray(response.strengths) ? response.strengths : [],
          weaknesses: Array.isArray(response.weaknesses) ? response.weaknesses : []
        };

        return validatedResponse;
      }

      return this._validateResumeAnalysis(response);
    } catch (error) {
      console.error("Error analyzing resume:", error);
      return this.fallbackResumeAnalysis(resumeText);
    }
  }

  // Generate improvement suggestions using OpenRouter
  async generateSuggestions(resumeAnalysis, jobKeywords, matchScore) {
    try {
      const response = await this._sendOpenRouterRequest(
        `Based on the resume analysis and job requirements, provide specific improvement suggestions. Return a valid JSON array of suggestion objects with this exact structure:
[
  {
    "suggestion": "string describing the suggestion",
    "priority": "high",
    "category": "skills",
    "description": "detailed explanation of the suggestion"
  }
]

Valid categories are: "skills", "experience", "formatting", "keywords"
Valid priorities are: "high", "medium", "low"

Resume Analysis: ${JSON.stringify(resumeAnalysis)}
Job Requirements: ${JSON.stringify(jobKeywords)}
Current Match Score: ${matchScore}%

IMPORTANT: 
1. Return ONLY the JSON array without any additional text or markdown
2. Ensure all objects in the array have all required fields
3. Use only the specified categories and priorities
4. Keep suggestions concise and actionable`,
        'json_object'
      );

      // Validate and normalize the suggestions
      if (Array.isArray(response)) {
        const validCategories = ['skills', 'experience', 'formatting', 'keywords'];
        const validPriorities = ['high', 'medium', 'low'];

        return response
          .filter(suggestion =>
            suggestion &&
            typeof suggestion === 'object' &&
            typeof suggestion.suggestion === 'string' &&
            typeof suggestion.description === 'string' &&
            validCategories.includes(suggestion.category) &&
            validPriorities.includes(suggestion.priority)
          )
          .map(suggestion => ({
            suggestion: suggestion.suggestion.trim(),
            priority: suggestion.priority,
            category: suggestion.category,
            description: suggestion.description.trim()
          }));
      }

      // If response is not an array, return fallback suggestions
      console.warn("Invalid suggestions format received, using fallback suggestions");
      return this.fallbackSuggestions(resumeAnalysis, jobKeywords);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      return this.fallbackSuggestions(resumeAnalysis, jobKeywords);
    }
  }

  // Private helper method to send requests to OpenRouter
  async _sendOpenRouterRequest(prompt, responseFormat = 'text') {
    /**
 * Active: 2026-01-09
 * Function: makeRequest
 */
const makeRequest = async (model, useJsonFormat = true) => {
      const config = {
        model: model,
        messages: [{ role: 'user', content: prompt }]
      };

      if (useJsonFormat && responseFormat === 'json_object') {
        config.response_format = { type: 'json_object' };
      }

      return axios.post(
        this.apiUrl,
        config,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://yourdomain.com',
            'X-Title': 'ATS Defender'
          },
          timeout: 45000 // Increased timeout
        }
      );
    };

    try {
      try {
        const response = await makeRequest(this.defaultModel, true);
        return this._processResponse(response, responseFormat);
      } catch (error) {
        // Handle 400 errors (often "json_object not supported" or similar)
        if (error.response && error.response.status === 400 && responseFormat === 'json_object') {
          console.log("Model rejected JSON format, retrying without strict JSON mode...");
          const retryResponse = await makeRequest(this.defaultModel, false);
          return this._processResponse(retryResponse, responseFormat);
        }
        throw error;
      }
    } catch (error) {
      // Try with fallback model if first request fails (rate limit or persistent 400/500)
      if (error.response && (error.response.status === 429 || error.response.status >= 500 || error.response.status === 400)) {
        console.log(`Switching to fallback model (${this.fallbackModel}) due to error: ${error.response?.status}`);
        try {
          const fallbackResponse = await makeRequest(this.fallbackModel, false); // Fallback usually without strict JSON to be safe
          return this._processResponse(fallbackResponse, responseFormat);
        } catch (fallbackError) {
          console.error("Fallback model also failed:", fallbackError.message);
          throw fallbackError;
        }
      }

      throw error;
    }
  }

  _processResponse(response, responseFormat) {
    if (responseFormat === 'json_object') {
      try {
        let content = response.data.choices[0].message.content;
        // Clean up markdown code block if present
        content = content.replace(/```json\n?|\n?```/g, '').trim();

        // Try to parse the JSON
        try {
          return JSON.parse(content);
        } catch (parseError) {
          // If parsing fails, try to clean up common JSON formatting issues
          content = content
            .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes to unquoted keys
            .replace(/(['"])\s*:\s*([^"{\[\d][^,}\]]*?)([,}])/g, '$1: "$2"$3') // Add quotes to unquoted string values
            .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
            .replace(/\n/g, ' ') // Remove newlines
            .replace(/\s+/g, ' '); // Normalize whitespace

          try {
            return JSON.parse(content);
          } catch (secondParseError) {
            console.error("JSON parsing error after cleanup:", secondParseError);
            console.error("Original content:", content);
            throw new Error("Invalid JSON response from AI after cleanup attempts");
          }
        }
      } catch (parseError) {
        console.error("JSON parsing error:", parseError);
        throw new Error("Invalid JSON response from AI");
      }
    }

    return response.data.choices[0].message.content;
  }

  // Validation methods
  _validateJobKeywords(data) {
    const defaults = {
      requiredSkills: [],
      preferredSkills: [],
      industryKeywords: [],
      softSkills: [],
      experienceLevel: "mid-level"
    };

    if (typeof data !== 'object') return defaults;

    return {
      requiredSkills: Array.isArray(data.requiredSkills) ? data.requiredSkills : defaults.requiredSkills,
      preferredSkills: Array.isArray(data.preferredSkills) ? data.preferredSkills : defaults.preferredSkills,
      industryKeywords: Array.isArray(data.industryKeywords) ? data.industryKeywords : defaults.industryKeywords,
      softSkills: Array.isArray(data.softSkills) ? data.softSkills : defaults.softSkills,
      experienceLevel: typeof data.experienceLevel === 'string' ? data.experienceLevel : defaults.experienceLevel
    };
  }

  _validateResumeAnalysis(data) {
    const defaults = {
      skills: [],
      experience: { years: 0 },
      education: { degrees: [] },
      achievements: [],
      formatting: { issues: [] },
      strengths: [],
      weaknesses: []
    };

    if (typeof data !== 'object') return defaults;

    return {
      skills: Array.isArray(data.skills) ? data.skills : defaults.skills,
      experience: typeof data.experience === 'object' ?
        { years: data.experience.years || 0 } : defaults.experience,
      education: typeof data.education === 'object' ?
        { degrees: Array.isArray(data.education.degrees) ? data.education.degrees : [] } : defaults.education,
      achievements: Array.isArray(data.achievements) ? data.achievements : defaults.achievements,
      formatting: typeof data.formatting === 'object' ?
        { issues: Array.isArray(data.formatting.issues) ? data.formatting.issues : [] } : defaults.formatting,
      strengths: Array.isArray(data.strengths) ? data.strengths : defaults.strengths,
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : defaults.weaknesses
    };
  }

  // Calculate keyword match between resume and job description
  //   calculateKeywordMatch(resumeSkills, jobKeywords) {
  //     const allJobKeywords = [
  //       ...(jobKeywords.requiredSkills || []),
  //       ...(jobKeywords.preferredSkills || []),
  //       ...(jobKeywords.industryKeywords || []),
  //     ].map(k => k.toLowerCase());

  //     const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());

  //     const matched = allJobKeywords.filter(keyword => 
  //       resumeSkillsLower.some(skill => 
  //         skill.includes(keyword) || keyword.includes(skill)
  //     )

  //     const matchScore = allJobKeywords.length > 0 
  //       ? Math.round((matched.length / allJobKeywords.length) * 100) 
  //       : 0;

  //     return {
  //       score: matchScore,
  //       matched: matched,
  //       missing: allJobKeywords.filter(k => !matched.includes(k)),
  //     };
  //   }

  calculateKeywordMatch(resumeSkills, jobKeywords) {
    // Combine all relevant keywords from job description
    const allJobKeywords = [
      ...(jobKeywords?.requiredSkills || []),
      ...(jobKeywords?.preferredSkills || []),
      ...(jobKeywords?.industryKeywords || []),
    ].map(k => k.toLowerCase().trim());
    // console.log("resume   "+resumeSkills)
    // Normalize resume skills
    const resumeSkillsLower = resumeSkills?.map(s => s.toLowerCase().trim());

    // Find matching keywords (case insensitive and checks for partial matches)
    const matched = allJobKeywords.filter(keyword =>
      resumeSkillsLower.some(skill =>
        skill.includes(keyword) || keyword.includes(skill)
      )
    );

    // Calculate match percentage (avoid division by zero)
    const matchScore = allJobKeywords.length > 0
      ? Math.round((matched.length / allJobKeywords.length) * 100)
      : 0;

    return {
      score: matchScore,
      matched: matched,
      missing: allJobKeywords.filter(k => !matched.includes(k)),
    };
  }
  // Calculate scores for different resume sections
  calculateSectionScores(resumeAnalysis, jobKeywords) {
    const skills = this.calculateSkillsScore(resumeAnalysis.skills, jobKeywords);
    const experience = this.calculateExperienceScore(resumeAnalysis.experience, jobKeywords);
    const education = this.calculateEducationScore(resumeAnalysis.education, jobKeywords);
    const formatting = this.calculateFormattingScore(resumeAnalysis.formatting);

    return { skills, experience, education, formatting };
  }

  // Calculate skills score
  calculateSkillsScore(resumeSkills, jobKeywords) {
    const requiredSkills = jobKeywords.requiredSkills || [];
    const preferredSkills = jobKeywords.preferredSkills || [];

    const hasRequiredSkills = requiredSkills.filter(skill =>
      resumeSkills.some(rs =>
        rs.toLowerCase().includes(skill.toLowerCase()))
    );

    const hasPreferredSkills = preferredSkills.filter(skill =>
      resumeSkills.some(rs =>
        rs.toLowerCase().includes(skill.toLowerCase()))
    );

    const requiredScore = requiredSkills.length > 0
      ? (hasRequiredSkills.length / requiredSkills.length) * 70
      : 70;

    const preferredScore = preferredSkills.length > 0
      ? (hasPreferredSkills.length / preferredSkills.length) * 30
      : 30;

    const totalScore = Math.round(requiredScore + preferredScore);

    return {
      score: Math.min(100, totalScore),
      feedback: this.generateSkillsFeedback(totalScore, hasRequiredSkills, hasPreferredSkills),
      suggestions: this.generateSkillsSuggestions(requiredSkills, preferredSkills, resumeSkills),
      detectedSkills: resumeSkills,
      missingSkills: [...requiredSkills, ...preferredSkills].filter(
        skill => !resumeSkills.some(rs =>
          rs.toLowerCase().includes(skill.toLowerCase()))
      ),
    };
  }

  // Calculate experience score
  calculateExperienceScore(experienceData, jobKeywords) {
    const requiredYears = this.extractRequiredExperience(jobKeywords.experienceLevel);
    const resumeYears = experienceData.years || 0;

    let score = 0;
    if (resumeYears >= requiredYears) {
      score = Math.min(100, 70 + (resumeYears - requiredYears) * 5);
    } else {
      score = Math.max(0, (resumeYears / requiredYears) * 70);
    }

    return {
      score: Math.round(score),
      feedback: this.generateExperienceFeedback(resumeYears, requiredYears),
      suggestions: this.generateExperienceSuggestions(resumeYears, requiredYears),
      yearsDetected: resumeYears,
      relevantExperience: resumeYears >= requiredYears * 0.8,
    };
  }

  // Calculate education score
  calculateEducationScore(educationData, jobKeywords) {
    const hasRelevantDegree = educationData.degrees && educationData.degrees.length > 0;
    const score = hasRelevantDegree ? 85 : 60;

    return {
      score,
      feedback: hasRelevantDegree ? "Good educational background" : "Consider highlighting relevant education",
      suggestions: hasRelevantDegree ? [] : ["Add relevant certifications or courses"],
      detectedDegrees: educationData.degrees || [],
      relevantEducation: hasRelevantDegree,
    };
  }

  // Calculate formatting score
  calculateFormattingScore(formattingData) {
    let score = 100;
    const issues = [];

    if (formattingData.issues) {
      score -= formattingData.issues.length * 10;
      issues.push(...formattingData.issues);
    }

    return {
      score: Math.max(0, score),
      feedback: score > 80 ? "Well-formatted resume" : "Formatting needs improvement",
      suggestions: this.generateFormattingSuggestions(issues),
      issues,
    };
  }

  // Fallback methods
  fallbackKeywordExtraction(jobDescription) {
    const commonSkills = ["javascript", "python", "react", "node.js", "sql", "aws", "docker"];
    const foundSkills = commonSkills.filter(skill =>
      jobDescription.toLowerCase().includes(skill)
    );

    return {
      requiredSkills: foundSkills.slice(0, 3),
      preferredSkills: foundSkills.slice(3),
      industryKeywords: [],
      softSkills: ["communication", "teamwork"],
      experienceLevel: "mid-level",
    };
  }

  fallbackResumeAnalysis(resumeText) {
    return {
      skills: this.extractBasicSkills(resumeText),
      experience: { years: this.estimateExperience(resumeText) },
      education: { degrees: [] },
      achievements: [],
      formatting: { issues: [] },
      strengths: ["Technical skills"],
      weaknesses: ["Could improve keyword optimization"],
    };
  }

  fallbackSuggestions(resumeAnalysis, jobKeywords) {
    return [
      {
        suggestion: "Add more relevant keywords",
        priority: "high",
        category: "keywords",
        description: "Include industry-specific terms from the job description",
      },
      {
        suggestion: "Quantify achievements",
        priority: "medium",
        category: "experience",
        description: "Add numbers and metrics to demonstrate impact",
      },
    ];
  }

  // Helper methods
  extractBasicSkills(text) {
    const skillKeywords = [
      "javascript", "python", "java", "react", "angular", "vue",
      "node.js", "express", "mongodb", "sql", "postgresql", "mysql",
      "aws", "azure", "docker", "kubernetes", "git", "html", "css"
    ];

    return skillKeywords.filter(skill =>
      text.toLowerCase().includes(skill)
    );
  }

  estimateExperience(text) {
    const yearMatches = text.match(/(\d+)\s*years?/gi);
    if (yearMatches) {
      const years = yearMatches.map(match =>
        Number.parseInt(match.match(/\d+/)[0])
      );
      return Math.max(...years);
    }
    return 2; // Default estimate
  }

  extractRequiredExperience(experienceLevel) {
    const levelMap = {
      entry: 0,
      junior: 1,
      mid: 3,
      senior: 5,
      lead: 7,
      principal: 10,
    };

    if (!experienceLevel) return 2; // Default

    const level = experienceLevel.toLowerCase();
    for (const [key, years] of Object.entries(levelMap)) {
      if (level.includes(key)) {
        return years;
      }
    }
    return 2; // Default
  }

  generateSkillsFeedback(score, hasRequired, hasPreferred) {
    if (score >= 80) return "Excellent skills match with job requirements";
    if (score >= 60) return "Good skills coverage, some improvements possible";
    return "Skills section needs significant improvement";
  }

  generateSkillsSuggestions(required, preferred, resume) {
    const suggestions = [];
    const missing = required.filter(skill =>
      !resume.some(rs =>
        rs.toLowerCase().includes(skill.toLowerCase()))
    );

    if (missing.length > 0) {
      suggestions.push(`Add missing required skills: ${missing.join(", ")}`);
    }

    return suggestions;
  }

  generateExperienceFeedback(resumeYears, requiredYears) {
    if (resumeYears >= requiredYears) return "Experience level meets job requirements";
    return `Consider highlighting ${requiredYears - resumeYears} more years of relevant experience`;
  }

  generateExperienceSuggestions(resumeYears, requiredYears) {
    if (resumeYears < requiredYears) {
      return [
        "Emphasize relevant projects and internships",
        "Highlight transferable skills"
      ];
    }
    return ["Quantify achievements with specific metrics"];
  }

  generateFormattingSuggestions(issues) {
    const suggestions = [];
    if (issues.includes("inconsistent_formatting")) {
      suggestions.push("Ensure consistent formatting throughout");
    }
    if (issues.includes("too_long")) {
      suggestions.push("Consider reducing resume length to 1-2 pages");
    }
    if (issues.includes("no_quantifiable_results")) {
      suggestions.push("Add quantifiable achievements with numbers");
    }
    return suggestions;
  }
}