MatchoMate 🏠🤝
AI-Assisted Roommate Compatibility & Matching Platform
MatchoMate is a web-based platform designed to help students find compatible roommates based on their lifestyle preferences and daily habits.
Instead of assigning roommates only on room availability, MatchoMate analyzes factors such as sleep schedules, cleanliness, study habits, noise tolerance, social preferences, guest frequency, food preferences, and smoking preferences to calculate an explainable compatibility score.
The project combines a modern React frontend with a lightweight TypeScript/Express backend containing the compatibility and matching engine.
Live Demo: https://matchomate1.vercel.app
🎯 Problem
Finding a suitable roommate is often based on limited information such as:
Room availability
Course or branch
Random allocation
Personal assumptions
However, lifestyle differences can create problems after students start living together.
Examples include:
Different sleeping schedules
Different cleanliness expectations
Different study routines
Different noise tolerance
Different social preferences
Different guest preferences
Different food preferences
Smoking/non-smoking preferences
MatchoMate addresses this problem by using structured lifestyle data to provide compatibility-based roommate recommendations.
💡 Solution
MatchoMate allows students to create a lifestyle profile and uses that information to calculate compatibility with other students.
The system:
Collects student lifestyle information.
Validates the profile data.
Compares two students across multiple lifestyle dimensions.
Calculates individual compatibility scores.
Combines the scores using predefined weights.
Generates an overall compatibility percentage.
Provides an explanation highlighting similarities and differences.
Uses the compatibility results to generate roommate matches.
The final compatibility score is the weighted combination of all eight dimensions.
📝 Explainable Results
MatchoMate does not only return a percentage.
The compatibility engine also generates an explanation based on the strongest and weakest compatibility dimensions.
For example:
Compatibility: 88%

Strong compatibility:
✓ Similar sleep schedules
✓ Similar study habits
✓ Similar cleanliness preferences

Areas of difference:
• Different social preferences
The backend categorizes overall compatibility into:
Score
Category
90+
Excellent
75–89
Strong
60–74
Moderate
Below 60
Limited