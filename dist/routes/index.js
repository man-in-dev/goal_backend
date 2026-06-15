"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const admission_1 = __importDefault(require("./admission"));
const contact_1 = __importDefault(require("./contact"));
const enquiry_1 = __importDefault(require("./enquiry"));
const complaintFeedback_1 = __importDefault(require("./complaintFeedback"));
const banner_1 = __importDefault(require("./banner"));
const newsEvent_1 = __importDefault(require("./newsEvent"));
const blog_1 = __importDefault(require("./blog"));
const publicNotice_1 = __importDefault(require("./publicNotice"));
const result_1 = __importDefault(require("./result"));
const careerApplication_1 = __importDefault(require("./careerApplication"));
const gvet_1 = __importDefault(require("./gvet"));
const gaetResult_1 = __importDefault(require("./gaetResult"));
const gaetDate_1 = __importDefault(require("./gaetDate"));
const aitsVideoSolution_1 = __importDefault(require("./aitsVideoSolution"));
const spotTestVideoSolution_1 = __importDefault(require("./spotTestVideoSolution"));
const reNeetVideoSolution_1 = __importDefault(require("./reNeetVideoSolution"));
const course_1 = __importDefault(require("./course"));
const payment_1 = __importDefault(require("./payment"));
const admissionForm_1 = __importDefault(require("./admissionForm"));
const summerCamp_1 = __importDefault(require("./summerCamp"));
const upload_1 = __importDefault(require("./upload"));
const neet2026AnswerKey_1 = __importDefault(require("./neet2026AnswerKey"));
const pageImage_1 = __importDefault(require("./pageImage"));
const pageSetting_1 = __importDefault(require("./pageSetting"));
const careerCounselling_1 = __importDefault(require("./careerCounselling"));
const neetCounselling_1 = __importDefault(require("./neetCounselling"));
const router = (0, express_1.Router)();
// Mount routes
router.use('/auth', auth_1.default);
router.use('/admission', admission_1.default);
router.use('/contact', contact_1.default);
router.use('/enquiry', enquiry_1.default);
router.use('/complaint-feedback', complaintFeedback_1.default);
router.use('/banner', banner_1.default);
router.use('/news-events', newsEvent_1.default);
router.use('/blog', blog_1.default);
router.use('/public-notice', publicNotice_1.default);
router.use('/result', result_1.default);
router.use('/career-applications', careerApplication_1.default);
router.use('/gvet', gvet_1.default);
router.use('/gaet-results', gaetResult_1.default);
router.use('/gaet-dates', gaetDate_1.default);
router.use('/aits-video-solutions', aitsVideoSolution_1.default);
router.use('/spot-test-video-solutions', spotTestVideoSolution_1.default);
router.use('/re-neet-video-solutions', reNeetVideoSolution_1.default);
router.use('/courses', course_1.default);
router.use('/payment', payment_1.default);
router.use('/admission-form', admissionForm_1.default);
router.use('/summer-camp', summerCamp_1.default);
router.use('/upload', upload_1.default);
router.use('/neet-2026-answerkey', neet2026AnswerKey_1.default);
router.use('/page-images', pageImage_1.default);
router.use('/page-settings', pageSetting_1.default);
router.use('/career-counselling', careerCounselling_1.default);
router.use('/neet-counselling', neetCounselling_1.default);
// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map