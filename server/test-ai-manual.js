import { AIAnalyzer } from "./utils/AIAnalyzer.js";
import dotenv from "dotenv";

dotenv.config();

async /**
 * Active: 2026-01-04
 * Function: testAI
 */
function testAI() {
    console.log("Starting AI Integration Test...");

    const analyzer = new AIAnalyzer();

    const mockJobDescription = `
    Full Stack Developer Intern – Infrabyte Consulting

    Duration: 2–3 months | Full-time | Remote | Stipend: ₹15,700

    About the Role

    Infrabyte Consulting is looking for a Full Stack Developer Intern to contribute to both front-end and back-end development. This internship will help you understand the complete lifecycle of web applications.

    Responsibilities

    * Build and maintain web applications across front-end and back-end.
    * Work with APIs and databases.
    * Optimize applications for performance and scalability.
    * Collaborate with designers and developers on project tasks.

    Requirements

    * Pursuing or recently completed a degree in Computer Science or related field.
    * Knowledge of HTML, CSS, JavaScript, and backend frameworks.
    * Familiarity with databases such as SQL or MongoDB.

    Skills

    HTML, CSS, JavaScript, React/Angular, Node.js, SQL/MongoDB, Git, REST APIs

    Benefits

    * Monthly stipend of ₹15,700.
    * Internship certificate.
    * Letter of Recommendation (LOR).
    * Exposure to full-stack projects with mentorship.
  `;

    // Test 1: Job Keyword Extraction
    try {
        console.log("Testing extractJobKeywords...");
        const keywords = await analyzer.extractJobKeywords(mockJobDescription);
        console.log("✅ Keyword Extraction Success:", JSON.stringify(keywords, null, 2));

        if (!keywords.requiredSkills || keywords.requiredSkills.length === 0) {
            console.error("❌ Failed to extract required skills.");
        }

    } catch (error) {
        console.error("❌ Keyword Extraction Failed:", error.message);
    }

    const mockResume = `
    Akash Sharma
    Khora colony,Sector 62 Noida, UP(201309), India
    +91 9540183487 | officialmailakashsharma@gmail.com@gmail.com | Linkedin | Github | Leetcode | GeekForGeeks
    Education
    Institute of Engineering and Rural Technology B.Tech. in Computer Science , CGPA: 8/10.0 Projects
    Allahabad, UP
    November 2021 – May 2025*
    Cloud IDE | Github ReactJS, NodeJS, Docker, Kubernetes, REST API, WebSocket
    may 2024
    • Built a cloud-based Integrated Development Environment (IDE) supporting multiple programming languages.
    • Implemented real-time code collaboration using WebSockets for enhanced developer teamwork.
    • Utilized Docker and Kubernetes to create isolated development environments for scalability and deployment.
    • Developed backend services with Node.js and REST APIs to handle file management, compilation, and execution of
    code.
    • Designed an intuitive user interface with ReactJS for seamless coding and project management.
    BuddyPlayer | Github | React, Node.js, Express.js, MongoDB, REST API, MaterialUI
    December 2023
    • Developed an interactive media player platform using React for the front end and Node.js for the backend.
    • Implemented functionalities like media upload, playlist management, and playback features.
    • Created a responsive and engaging user interface using MaterialUI for better user experience.
    • Utilized MongoDB for user data storage and Express.js for API management, ensuring seamless data interaction.
    Attendance Management System | Github MERN Stack (MongoDB, Express.js, React, Node.js), Bootstrap, REST API
    december 2023
    • Developed a full-featured attendance management system using the MERN stack for educational institutions.
    • Implemented functionalities such as marking attendance, generating attendance reports, and tracking student
    progress.
    • Created an intuitive and easy-to-use dashboard for administrators and teachers using React and Bootstrap.
    • Utilized MongoDB for efficient storage of attendance records and user data.
    Image Resizer | Github Python, img2pdf
    nov, 2023
    • Developed a Python-based desktop application for efficient image resizing and image-to-PDF conversion.
    • Implemented image resizing algorithm to reduce pixel count while preserving image quality.
    • Utilized the img2pdf library for seamless image-to-PDF conversion.
    • Created a user-friendly interface for entering image location, size input, and output format choice.
    Technical Skills
    Frontend: HTML, CSS, Tailwind CSS, Bootstrap, Shadcn, JavaScript, TypeScript, React, Next.js
    Backend: Node.js, Django, Express, RESTful APIs
    Databases: MongoDB, SQL, NoSQL, Mongoose ODM
    Version Control System: Git, GitHub
    Programming Languages: Python, C, C++, JavaScript, TypeScript
    Achievements
    Solved 500+ Data Structures and Algorithms problems over platforms like LeetCode, GeekForGeeks,
    CodingNinjas and CodeChef.
    HACKCBS 5.0, Hackathon , were among Top 10 teams to qualify for final round.
  `;

    // Test 2: Resume Analysis
    try {
        console.log("\nTesting analyzeResumeContent...");
        const analysis = await analyzer.analyzeResumeContent(mockResume);
        console.log("✅ Resume Analysis Success:", JSON.stringify(analysis, null, 2));

        if (!analysis.skills || analysis.skills.length === 0) {
            console.error("❌ Failed to extract skills from resume.");
        }
    } catch (error) {
        console.error("❌ Resume Analysis Failed:", error.message);
    }

}

testAI();
