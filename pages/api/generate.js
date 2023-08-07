import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.log("entering generate api")

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const resume = req.body.resume || '';
  if (resume.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid resume",
      }
    });
    return;
  }

  const jobDescription = req.body.jobDescription || '';
  if (jobDescription.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid job description",
      }
    });
    return;
  }

  try {
    console.log("sending message to OpenAI API")
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generateMessages(resume, jobDescription),
    });
    console.log("done")
    console.log(completion.data.choices[0])
    res.status(200).json({ result: completion.data.choices[0].message.content});
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generateMessages(resume, jobDescription) {
  return [{
    role: "system",
    content: "Your job is to help the user, who is applying to a job, revise his resume to better fit the given job description. The resume you generate should include keywords from the job description, and highlight important skills and relevant experiences asked for in the job description. You should rewrite parts of the resume to achieve this goal. You can also change the tone to be more professional."
  }, {
    role: "user",
    content: `This is the resume: ${resume} 

    This is the job description: ${jobDescription}`
  }]
}

/*
example console.log(completion.data.choices[0])
{
  index: 0,
  message: {
    role: 'assistant',
    content: 'Software Developer\n' +
      '\n' +
      'Objective:\n' +
      'Highly motivated software developer with experience in full-stack development and a strong background in artificial intelligence. Seeking a challenging position as a Full Stack AI Developer to leverage my skills in developing innovative and efficient software solutions.\n' +
      '\n' +
      'Skills:\n' +
      '\n' +
      'Programming Languages: Java, Python, C++\n' +
      '\n' +
      'Web Development: HTML, CSS, JavaScript\n' +
      '\n' +
      'Database: SQL, MongoDB\n' +
      '\n' +
      'Frameworks: Spring, Django, Angular\n' +
      '\n' +
      'Artificial Intelligence: Machine Learning, Neural Networks, Natural Language Processing\n' +
      '\n' +
      'Operating Systems: Windows, Linux\n' +
      '\n' +
      'Projects:\n' +
      '\n' +
      '1. AI Chatbot: Developed an AI-powered chatbot using natural language processing techniques. Implemented conversational flows, user authentication, and API integrations.\n' +
      '\n' +
      '2. Recommender System: Designed and implemented a recommendation engine using collaborative filtering algorithms to provide personalized recommendations to users. Integrated it into an e-commerce platform.\n' +
      '\n' +
      '3. Facial Recognition System: Developed an application using neural networks for facial recognition. Implemented features like face detection, landmark detection, and face authentication.\n' +
      '\n' +
      'Experience:\n' +
      '\n' +
      'Software Developer Intern \n' +
      'XYZ Company, City, State \n' +
      'June 20XX - August 20XX\n' +
      '\n' +
      '- Assisted in the development of a web-based application using Java and Spring framework.\n' +
      '- Collaborated with a team to implement new features, fix bugs, and optimize code.\n' +
      '- Utilized SQL to design and manage databases.\n' +
      "- Conducted code reviews and suggested improvements to enhance the application's functionality.\n" +
      '\n' +
      'Education:\n' +
      '\n' +
      'Bachelor of Science in Computer Science\n' +
      'University XYZ, City, State\n' +
      'May 20XX\n' +
      '\n' +
      'Certifications:\n' +
      '- AI for Everyone, Coursera\n' +
      '- Machine Learning, Stanford Online\n' +
      '\n' +
      'Additional Skills:\n' +
      '\n' +
      '- Strong problem-solving and analytical skills\n' +
      '- Excellent communication and teamwork abilities\n' +
      '- Attention to detail and ability to work under pressure\n' +
      '\n' +
      'References:\n' +
      'Available upon request'
  },
  finish_reason: 'stop'
}
*/
