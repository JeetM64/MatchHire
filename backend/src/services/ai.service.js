const { GoogleGenAI } = require("@google/genai");
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")


const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return response.text;
}



const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("The match score for the candidate"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("how to answer this question, What points to cover , what approach to take etc.")
    })).describe("A list of technical interview questions with their purpose and detailed answer guidance."),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("how to answer this question, What points to cover , what approach to take etc.")
    })).describe("A list of behavioral interview questions with the interviewer's intention and detailed answer strategy."),
    skillGaps: z.array(z.object({
        skills: z.string().describe("The skills that are gaps for the candidate"),
        severity: z.enum(["low","medium","high"]).describe("The severity of the skill gap")
    })).describe("A list of skill gaps for the candidate"),
    preparationPlan: z.array(z.object({
        day: z.string().describe("The day of the week for the preparation step"),
        focus: z.string().describe("The focus area for the preparation step"),
        tasks: z.array(z.string()).describe("The tasks to be completed for the preparation step")
    })).describe("A list of preparation steps for the interview")
})

async function generateInterviewReport({resume,selfDescription,jobDescription}) {

    const prompt = `
You are an experienced technical recruiter.

Analyze the candidate's resume, self description, and the job description.

Generate a realistic interview report.

The report must include:

1. Match score (0-100)
2. 10 Technical Interview Questions
3. 5 Behavioral Interview Questions
4. Skill Gaps
5. A 7-day Preparation Plan

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON matching the provided schema.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(interviewReportSchema)
        }
    });

    const report = JSON.parse(response.text);

    console.log(report);

    return report;
}


module.exports = {
    invokeGeminiAi,
    generateInterviewReport
}