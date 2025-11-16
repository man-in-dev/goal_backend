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