"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const gvetController_1 = require("../controllers/gvetController");
const router = express_1.default.Router();
const answerKeyValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required'),
    (0, express_validator_1.body)('rollNo').trim().notEmpty().withMessage('Roll No is required'),
    (0, express_validator_1.body)('phone').trim().isLength({ min: 10 }).withMessage('Valid phone is required'),
    (0, express_validator_1.body)('questionNo').trim().notEmpty().withMessage('Question No is required'),
    (0, express_validator_1.body)('explanation').trim().isLength({ min: 5 }).withMessage('Explanation must be at least 5 characters'),
];
router.post('/answer-key', gvetController_1.submitAnswerKey);
router.get('/answer-key', gvetController_1.getAnswerKeys);
router.delete('/answer-key/:id', gvetController_1.deleteAnswerKey);
exports.default = router;
//# sourceMappingURL=gvet.js.map