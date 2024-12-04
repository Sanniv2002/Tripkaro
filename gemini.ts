import { GoogleGenerativeAI  } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY || ""

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default model 