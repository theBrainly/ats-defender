// Utility functions for resume and job description analysis
// export const analyzeResume = (resumeText, jdText) => {
//   // Preprocessing
//   const resumeWords = preprocessText(resumeText);
//   const jdWords = preprocessText(jdText);

//   // Keyword matching
//   const matchedKeywords = jdWords.filter(word => 
//     resumeWords.includes(word)
//   );

//   // Calculate score
//   const score = Math.round((matchedKeywords.length / jdWords.length) * 100);

//   // Find missing keywords
//   const missingKeywords = jdWords.filter(word => 
//     !resumeWords.includes(word)
//   ).slice(0, 10); // Show top 10 missing

//   // Generate suggestions
//   const suggestions = generateSuggestions(missingKeywords);

//   return { score, missingKeywords, suggestions };
// };

// const preprocessText = (text) => {
//   return text
//     .toLowerCase()
//     .replace(/[^\w\s]/g, '') // Remove punctuation
//     .split(/\s+/)
//     .filter(word => word.length > 3); // Filter short words
// };

// const generateSuggestions = (missingKeywords) => {
//   return missingKeywords.map(keyword => 
//     `Add "${keyword}" to your skills or experience section`
//   );
// };