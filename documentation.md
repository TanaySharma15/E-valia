## I have broken down this project into several small steps so as to accomplish each one by one so that I won't look at the project like a huge one. It will look some small steps that I have to complete.

# Task - 1 (Done)

- Basic RAG chatbot setup using gemini API.
- It takes in multiple files as input and parses them and respond the users with their query related to the files.
- It can Read PDF files so that whenever user sends resume as pdf or as image it can extract user's details and suggest which role the user should apply for.
- Moreover it can read through a person's resume and ask question related to the things mentioned in the resume.

# Task - 2 (Done)

- Takes in role as input for which user wants to apply.
- Takes in job description.
- If job description is not available it generates a job description for user.
- Tells how much chances are there for selection based on resume and the job description.
- Generates question for the interview

# Task - 3 (Done)

- Now since we have build two endpoints that analyzes user's resume and generate job description for a selected job title
- Now our next step would be to give summarized resume and job description to LLM as a prompt and ask it to generate 10 good level questions from it.
- The questions should take all data from resume and job description and use it directly.
- Questions should be around user's experience, projects and job description.

# Task - 4 (Done)

- Now after our LLM has generated question our next step should be that we should something like: turn-based interview flow (AI asks one question → user answers → AI asks the next question) etc.
- First the LLM should ask question then user should reply using textbox.
- Upon recieving the user's response we should call LLM again.
- Everytime the LLM is called it should have context to user's resume and job description.
- Also everytime the LLM should be called with previous responses.

# Task -5 (Done)

- I have added generating interview questions.
- It generates interview questions based on the resume, job description and user's previous response.
- I have also added timer functionality where after a specific time LLM will stop asking question and just wish them goodbye.

# Task - 6 (last part left)

- After the generating question I have also added analysis part.
- After the interview is over or the user stops the interview the whole chat is passed to another endpoint where LLM analysis the user and generate a report.
- Currently I am using localstorage to store all the chats and analysis.
- Later I should add it to database so user can get earlier reports also.

# Task - 7 (Left)

- I need to add all the chats and analysis of the user in the database
- There will be two endpoints if user just completed their interview they will get analysis of the latest interview.
- But if user goes to library / archieves page he will get all the analysis of all his interviews

# Task - 8 (Done)

- Created new route so that we can get all the questions at once and send it to vapi api.
- Implemented real time q/a using vapi api.
- Implemented trancription so that we get transcription of the complete conversation at the end of the call.

# Task -9 (Optional)

- I should implement all the things using websocket instead of using vapi api.
