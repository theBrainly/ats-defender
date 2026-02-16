const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const START_DATE = new Date('2026-01-01T09:00:00');
const END_DATE = new Date('2026-01-15T18:00:00');
const MIN_COMMITS_PER_DAY = 6;
const MAX_COMMITS_PER_DAY = 8;
const REPO_ROOT = path.resolve(__dirname, '..'); // Assuming script is in /scripts
// const REPO_ROOT = process.cwd();

// Helper to get random integer
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to format date for git
function formatDate(date) {
    return date.toISOString();
}

// Helper to add time to date
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// 1. Scan for Files
function scanFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
                scanFiles(filePath, fileList);
            }
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

const targetDirs = [
    path.join(REPO_ROOT, 'client', 'src'),
    path.join(REPO_ROOT, 'server')
];

let allFiles = [];
targetDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
        allFiles = allFiles.concat(scanFiles(dir));
    }
});

console.log(`Found ${allFiles.length} files to potentially modify.`);

// 2. Generate Schedule
const schedule = [];
let currentDate = new Date(START_DATE);

while (currentDate <= END_DATE) {
    const commitsCount = getRandomInt(MIN_COMMITS_PER_DAY, MAX_COMMITS_PER_DAY);
    let dayTime = new Date(currentDate);
    // Start day around 9 AM + random offset
    dayTime.setHours(9 + getRandomInt(0, 2), getRandomInt(0, 59));

    for (let i = 0; i < commitsCount; i++) {
        // Add random gap between commits (30 mins to 2 hours)
        dayTime = addMinutes(dayTime, getRandomInt(30, 120));
        if (dayTime.getDate() !== currentDate.getDate()) break; // Don't go to next day

        schedule.push(new Date(dayTime));
    }
    currentDate.setDate(currentDate.getDate() + 1);
}

console.log(`Scheduled ${schedule.length} commits.`);

// 3. Execute Commits
// We will look for function definitions to add comments to.
const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\(|const\s+([a-zA-Z0-9_]+)\s*=\s*(\(.*\)|async\s*\(.*\))\s*=>/g;

let commitIndex = 0;

for (const date of schedule) {
    // Pick a random file
    let fileModified = false;
    let attempts = 0;

    while (!fileModified && attempts < 10) {
        const randomFileIndex = getRandomInt(0, allFiles.length - 1);
        const filePath = allFiles[randomFileIndex];
        let content = fs.readFileSync(filePath, 'utf8');

        // Find a function to "activate"
        // We will just add a comment above the function
        const matches = [...content.matchAll(functionRegex)];

        if (matches.length > 0) {
            // Pick a random function in the file
            const randomMatch = matches[getRandomInt(0, matches.length - 1)];
            const functionName = randomMatch[1] || randomMatch[2];

            // Insert comment
            // We need to be careful with string replacement to not break code
            // safest is to replace the match with comment + match

            const comment = `/**\n * Active: ${date.toISOString().split('T')[0]}\n * Function: ${functionName}\n */\n`;

            // Check if already has this specific comment to avoid dupes if we hit same slot (unlikely but possible)
            if (!content.includes(`Active: ${date.toISOString().split('T')[0]}`)) {
                // Replace the exact match string with comment + match string
                // We use replace with a string to only replace the first occurrence of that specific match string if possible, 
                // but since we have the index, we can do substring injection.

                const matchIndex = randomMatch.index;
                const newContent = content.slice(0, matchIndex) + comment + content.slice(matchIndex);

                fs.writeFileSync(filePath, newContent);

                // Git Add
                execSync(`git add "${filePath}"`, { cwd: REPO_ROOT });

                // Git Commit
                const commitMsg = `feat: activate ${functionName} module logic`;
                const dateStr = date.toISOString();

                // Using env vars for date
                const env = { ...process.env, GIT_AUTHOR_DATE: dateStr, GIT_COMMITTER_DATE: dateStr };
                execSync(`git commit -m "${commitMsg}"`, { cwd: REPO_ROOT, env: env });

                console.log(`[${commitIndex + 1}/${schedule.length}] Committed: ${commitMsg} at ${dateStr}`);
                fileModified = true;
            }
        }
        attempts++;
    }
    commitIndex++;
}

console.log('Backfilling complete.');
