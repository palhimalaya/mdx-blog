'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("GEMINI_API_KEY environment variable is missing.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

export async function analyzeQuestionPaper(textContent: string) {
  try {
    const prompt = `
    Analyze the following text from past exam question papers and:

    1. Identify the key topics covered in the questions.
    2. List the most frequently asked questions or question types under each topic, indicating their probability of appearing in future exams (high, medium, or low). Focus on specific question types or concepts rather than verbatim questions if they are rephrased across papers.
    3. Analyze the question papers by years using decision tree to find the question which may appear in this year.

    Text:
    \`\`\`
    ${textContent}
    \`\`\`

    Respond in a structured format and don't add extra information, for example:

    Subject: Subject Name

    Past Exam Papers

    Key Topics:
    - 1) Topic 1 Name
    - 2) Topic 2 Name
    ...

    Frequently Asked Questions by Topic:
    - Topic 1:
      - Question 1: Question text or concept (Probability: High/Medium/Low, Repetition Number: 2)
      - Question 2: Question text or concept (Probability: High/Medium/Low, Repetition Number: 1)
      ...
    - Topic 2:
      - Question 1: Question text or concept (Probability: High/Medium/Low, Repetition Number: 2)
      - Question 2: Question text or concept (Probability: High/Medium/Low, Repetition Number: 1)
      ...
    ...

    Most Probable Questions for Current Year:
    - Topic 1 Name: Question text or concept (Probability: High/Medium/Low, Repetition Number: 2)
    - Topic 2 Name: Question text or concept (Probability: High/Medium/Low, Repetition Number: 1)
    ...
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      return responseText;
  } catch (error) {
      console.error("Error processing PDF or API request:", error);
      throw error;
  }
}