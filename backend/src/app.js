import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
const app = express();



app.use(cors({
  origin : process.env.CORS
}))

app.use(
  express.urlencoded({extended : true, limit : "10mb"})
)

app.use(express.static("public"))
app.use(express.json({limit: "16kb"}))
app.use(cookieParser())


// ======================================================
// import routes
// ======================================================
import authRouter from './routes/auth.route.js'
import internRouter from './routes/intern.route.js'
import projectRouter from './routes/project.route.js'
import teamRouter from './routes/team.route.js'
import taskRouter from './routes/task.route.js'



// ======================================================
// handle routes
// ======================================================
app.use("/api/v1/tms/auth", authRouter)
app.use("/api/v1/tms/intern", internRouter)
app.use("/api/v1/tms/project", projectRouter)
app.use("/api/v1/tms/team", teamRouter)
app.use("/api/v1/tms/task", taskRouter)
// ======================================================
// global error handler
// ======================================================
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
});

export default app;
