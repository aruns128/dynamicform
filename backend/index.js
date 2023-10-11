const express = require('express');
const cors = require("cors")

const app = express()
require("dotenv").config()

app.use(cors())
app.use(express.json())
app.use("/api/formdata", (req, res, next) => {
  try {
    console.log(req.body)
    res.send({ msg: "form submitted successfully", data: req.body })
  } catch (error) {
    console.log(error)
    res.send({ msg: "Error Occurred while saving the form data" })
  }
})

const server = app.listen(process.env.PORT | 5000, () => {
  console.log(`Server stated on port ${process.env.PORT | 5000}`)
})