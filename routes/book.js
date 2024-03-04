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
          value: 14,
        },
        {
          id: "nameId",
          name: "What's your name?",
          type: "ShortAnswer",
          value: 15,
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
  // Extract filters from query parameters
  const filters = JSON.parse(req.query.filters || "[]");
  console.log("filters", filters);
  try {
    const filteredResponses = formResponse.responses
      .map((response) => {
        // Check if the response passes all filter conditions
        return response.questions.filter((question) => {
          return filters.every((filter) => {
            if (question.id !== filter.id) return false;

            // Determine the type of value
            let questionValue;
            if (!isNaN(question.value)) {
              questionValue = parseFloat(question.value);
            } else {
              questionValue = question.value;
            }
            console.log("question", question.value);
            console.log("filtered question", filter.value);

            // Perform comparison based on the type of value
            switch (filter.condition) {
              case "equals":
                return question.value === filter.value;
              case "does_not_equal":
                return question.value !== filter.value;
              case "greater_than":
                return typeof question.value !== "string"
                  ? question.value > filter.value
                  : false;
              case "less_than":
                return typeof question.value !== "string"
                  ? question.value < filter.value
                  : false;
              default:
                return false; // Invalid condition, response fails filter
            }
          });
        });
      })
      .flat(); // Flatten the array of arrays

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
