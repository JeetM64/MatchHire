require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { resume, selfDescription, jobDescription} = require("./src/services/temp")

// const  generateInterviewReport = require("./src/services/ai.service")
const { invokeGeminiAi, generateInterviewReport} = require("./src/services/ai.service");


generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
})
.then(report => {
    console.log(report);
})
.catch(err => {
    console.error(err);
});



invokeGeminiAi("what is an interview")
.then((response)=>{
    console.log("AI Response:", response);
})

// connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
// });