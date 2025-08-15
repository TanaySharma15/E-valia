// id
// :
// "vGzyRQyGPi356dFR"
// metadata
// :
// undefined
// parts
// :
// Array(2)
// 0
// :
// {type: 'step-start'}
// 1
// :
// providerMetadata
// :
// undefined
// state
// :
// "done"
// text
// :
// "```json\n{\n  \"name\": \"Tanay Kumar Sharma\",\n  \"skills\": [\n    \"JavaScript (ES6+)\",\n    \"TypeScript\",\n    \"HTML5\",\n    \"CSS3\",\n    \"Next.js\",\n    \"React.js\",\n    \"Node.js\",\n    \"Express.js\",\n    \"Tailwind CSS\",\n    \"Framer Motion\",\n    \"PostgreSQL\",\n    \"MongoDB\",\n    \"Prisma\",\n    \"Knex.js\",\n    \"Supabase\",\n    \"WebSockets\",\n    \"Liveblocks\",\n    \"Google Gemini API\",\n    \"OpenAI API\",\n    \"Web Speech API\",\n    \"Google TTS\",\n    \"Git\",\n    \"GitHub\",\n    \"Docker\",\n    \"Vercel\",\n    \"Netlify\",\n    \"Supabase Storage\",\n    \"Stripe API\",\n    \"Responsive Web Design\",\n    \"REST API Development\",\n    \"Authentication & Authorization\",\n    \"RLS (Row-Level Security)\",\n    \"Payment Integration\"\n  ],\n  \"experience\": [\n    {\n      \"company\": \"Secure Entry\",\n      \"role\": \"FullStack Developer Intern\",\n      \"years\": 0\n    },\n    {\n      \"company\": \"[Care-Connect]\",\n      \"role\": \"Backend Developer Intern\",\n      \"years\": 0\n    }\n  ],\n  \"education\": [\n    \"Bachelor's Degree at Jabalpur Engineering College\",\n    \"Class 12th CBSE\"\n  ]\n}\n```"
// type
// :
// "text"
// [[Prototype]]
// :
// Object
// length
// :
// 2
// [[Prototype]]
// :
// Array(0)
// role
// :
// "assistant"
// [[Prototype]]
// :
// Object
type GeminiPart = {
  type: string;
  text?: string;
  providerMetadata?: any;
  state?: string;
};
export type GeminiMessage = {
  id: string;
  role: string;
  metadata: any;
  parts: GeminiPart[];
};
