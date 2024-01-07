const express = require('express');
const router = express.Router();

const { bookIssueDetails} = require('../controllers/student_library_controller')

router.get('/book_issue_details', bookIssueDetails);

module.exports = router;
