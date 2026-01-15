// src/components/ResultsPanel.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";
import { logError } from "@/lib/logger";

// Helper functions for score visualization
/**
 * Active: 2026-01-01
 * Function: getScoreColor
 */
/**
 * Active: 2026-01-15
 * Function: getScoreColor
 */
function getScoreColor(score) {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-amber-500";
  return "text-red-500";
}

/**
 * Active: 2026-01-06
 * Function: getScoreIcon
 */
function getScoreIcon(score) {
  if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-500" />;
  if (score >= 60) return <AlertCircle className="h-5 w-5 text-amber-500" />;
  return <XCircle className="h-5 w-5 text-red-500" />;
}

/**
 * Active: 2026-01-05
 * Function: mapApiResults
 */
/**
 * Active: 2026-01-07
 * Function: mapApiResults
 */
function mapApiResults(apiResults) {
  // console.log("ResultsPanel - Mapping API results:", apiResults);
  if (!apiResults) {
    logError("No API results provided");
    return null;
  }

  // Helper to extract array of strings from array of objects or strings
  function extractKeywordArray(arr) {
    if (!Array.isArray(arr)) return [];
    return arr.map(k => (typeof k === 'object' && k !== null && 'keyword' in k) ? k.keyword : k);
  }

  // Make sure we have a valid response with a score
  if (apiResults.overallScore === undefined && apiResults.score === undefined) {
    logError("Invalid results data: Missing score", apiResults);
    return null;
  }

  const mapped = {
    score: apiResults.overallScore ?? apiResults.score ?? 0,
    matchedKeywords: extractKeywordArray(apiResults.keywordAnalysis?.matched || []),
    missingKeywords: extractKeywordArray(apiResults.keywordAnalysis?.missing || []),
    suggestions: (apiResults.suggestions || []).map(s =>
      typeof s === "string" ? { suggestion: s } : { suggestion: s.text || s.suggestion || s.description || String(s) }
    ),
    sections: {
      skills: {
        score: apiResults.sectionAnalysis?.skills?.score ?? 0,
        feedback: apiResults.sectionAnalysis?.skills?.feedback ?? "Skills assessment",
      },
      experience: {
        score: apiResults.sectionAnalysis?.experience?.score ?? 0,
        feedback: apiResults.sectionAnalysis?.experience?.feedback ?? "Experience assessment",
      },
      keywords: {
        score: apiResults.keywordAnalysis?.score ?? 0,
        feedback: apiResults.keywordAnalysis?.feedback ?? `Keyword matching analysis`,
      },
      formatting: {
        score: apiResults.sectionAnalysis?.formatting?.score ?? 0,
        feedback: apiResults.sectionAnalysis?.formatting?.feedback ?? "Document formatting assessment",
      },
    },
  };

  // console.log("ResultsPanel - Mapped results:", mapped);
  return mapped;
}

export function ResultsPanel({ results }) {
  const mappedResults = mapApiResults(results);

  if (!mappedResults) {
    logError("Failed to map results data", results);
    return (
      <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
        <p className="text-yellow-800 font-medium">Results could not be displayed</p>
        <p className="text-yellow-700 text-sm">The analysis results are in an unexpected format or missing required data.</p>
        <p className="text-yellow-700 text-xs mt-2">
          Technical details: {results ? `Results type: ${typeof results}, has keys: ${Object.keys(results).join(', ')}` : 'Results are undefined'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>ATS Compatibility Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`text-4xl font-bold ${getScoreColor(mappedResults?.score)}`}>
              {mappedResults?.score}%
            </div>
            <div className="flex-1">
              <Progress value={mappedResults?.score} className="h-3" />
            </div>
            {getScoreIcon(mappedResults?.score)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {mappedResults?.score >= 80
              ? "Excellent! Your resume is well-optimized for ATS systems."
              : mappedResults?.score >= 60
                ? "Good start! Some improvements needed for better ATS compatibility."
                : "Needs improvement. Consider the suggestions below to optimize your resume."}
          </p>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="grid md:grid-cols-3 gap-4">
        {mappedResults?.sections && Object.entries(mappedResults.sections)
          .filter(([, data]) => data && typeof data.score === 'number')
          .map(([sectionName, data]) => (
            <Card key={sectionName}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm capitalize">{sectionName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </span>
                  {getScoreIcon(data.score)}
                </div>
                <Progress value={data.score} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">{data.feedback}</p>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Keywords Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Matched Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Matched Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mappedResults?.matchedKeywords?.map((keyword, i) => (
                <Badge key={i} className="bg-green-100 text-green-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Missing Keywords</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {mappedResults?.missingKeywords?.map((keyword, i) => (
                <Badge key={i} variant="destructive" className="bg-red-100 text-red-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>Improvement Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mappedResults?.suggestions?.map((suggestion, i) => (
              <li key={i} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{suggestion.suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
