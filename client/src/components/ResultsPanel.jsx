// src/components/ResultsPanel.jsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

export function ResultsPanel({ results }) {
  // results = {
  //   score:  number,
  //   matchedKeywords:  [string, …],
  //   missingKeywords:  [string, …],
  //   suggestions:      [string, …],
  //   sections: {
  //     skills:    { score: number, feedback: string },
  //     experience:{ score: number, feedback: string },
  //     keywords:  { score: number, feedback: string }
  //   }
  // }

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  if (!results) {
    return null;
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
              <div className={`text-4xl font-bold ${getScoreColor(results?.score)}`}>
              {results?.score}%
            </div>
            <div className="flex-1">
              <Progress value={results?.score} className="h-3" />
            </div>
            {getScoreIcon(results?.score)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {results?.score >= 80
              ? "Excellent! Your resume is well-optimized for ATS systems."
              : results?.score >= 60
                ? "Good start! Some improvements needed for better ATS compatibility."
                : "Needs improvement. Consider the suggestions below to optimize your resume."}
          </p>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(results?.sections).map(([sectionName, data]) => (
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
              {results?.matchedKeywords?.map((keyword, i) => (
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
              {results?.missingKeywords?.map((keyword, i) => (
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
            {results?.suggestions?.map((suggestion, i) => (
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
 