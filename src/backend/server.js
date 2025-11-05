const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const connectDB = require('./config/db')

const app = express()

const userRoutes = require('./routes/user')
const eventRoutes = require('./routes/event')
const swapRoutes = require('./routes/swap')

dotenv.config()

app.use(
    cors({
        origin: "https://slot-swapper-beryl.vercel.app",
        credentials: true,
    })
);
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

connectDB()

app.get('/', (req, res) => {
    res.json({ message: "Hello" })
})

app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes)
app.use("/api", swapRoutes);

app.listen(8080, () => console.log("Listening on port 8080"));