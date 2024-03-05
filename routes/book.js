const express = require("express");
const router = express.Router();
const Book = require("../models/book.js");
const dayjs = require("dayjs"); // Import dayjs library for date comparison
require("dotenv").config();

const formResponse = {
  responses: [
    {
      questions: [
        {
          id: "nameId",
          name: "What's your name?",
          type: "ShortAnswer",
          value: "Timmy",
        },
        {
          id: "birthdayId",
          name: "What is your birthday?",
          type: "DatePicker",
          value: "2024-02-22T05:01:47.691Z",
        },
        {
          id: "nameId",
          name: "What's your name?",
          type: "ShortAnswer",
          value: "14",
        },
        {
          id: "nameId",
          name: "What's your name?",
          type: "ShortAnswer",
          value: "15",
        },
        {
          id: "birthdayId",
          name: "What is your birthday?",
          type: "DatePicker",
          value: "2024-02-22T05:01:47.691Z",
        },
        {
          id: "nameId",
          name: "What's your name?",
          type: "ShortAnswer",
          value: "Timmy",
        },
        {
          id: "birthdayId",
          name: "What is your birthday?",
          type: "DatePicker",
          value: "2024-02-22T05:01:47.691Z",
        },
      ],
      submissionId: "abc",
      submissionTime: "2024-05-16T23:20:05.324Z",
    },
  ],
  totalResponses: 1,
  pageCount: 1,
};

// Get all books
router.get("/form", async (req, res) => {
  try {
    const books = formResponse;
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:formId/filteredResponses", async (req, res) => {
  console.log("req.query", req.query);
  const formId = req.params.formId;
  // Extract individual filter parameters from query
  const id = req.query.id;
  const condition = req.query.condition;
  // Parse the value as a number if it represents a numeric value
  const value = isNaN(parseFloat(req.query.value))
    ? req.query.value
    : parseFloat(req.query.value);

  try {
    const filteredResponses = formResponse.responses
      .map((response) => {
        // Check if the response passes all filter conditions
        return response.questions.filter((question) => {
          // Check if the question matches the filter
          if (question.id === id) {
            // Determine the type of value
            let questionValue;
            if (!isNaN(parseFloat(question.value))) {
              questionValue = parseFloat(question.value);
            } else {
              questionValue = question.value;
            }

            console.log("questiontext", typeof question.value, typeof value);
            // Perform comparison based on the type of value
            switch (condition) {
              case "equals":
                return typeof value === "number"
                  ? Number(question.value) === value
                  : question.value === value;

              case "does_not_equal":
                return question.value !== value;
              case "greater_than":
                return typeof questionValue !== "string"
                  ? questionValue > value
                  : false;
              case "less_than":
                return typeof questionValue !== "string"
                  ? questionValue < value
                  : false;
              default:
                return false; // Invalid condition, response fails filter
            }
          } else {
            return false; // Question id doesn't match filter id
          }
        });
      })
      .flat(); // Flatten the array of arrays

    // User found, check if password matches

    if (!req.query.condition || !req.query.value) {
      return res
        .status(401)
        .json({ message: "Condition and value are required" });
    } else if (filteredResponses.length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    console.log("filtered response", filteredResponses);
    res.json({
      responses: filteredResponses,
      totalResponses: filteredResponses.length,
      pageCount: 1, // Assuming all responses are fetched in a single page
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
