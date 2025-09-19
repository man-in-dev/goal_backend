"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const ContactForm_1 = __importDefault(require("../models/ContactForm"));
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../utils/logger");
class ContactService {
    static createContact(contactData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check for duplicate contact from same email in last 24 hours
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const existingContact = yield ContactForm_1.default.findOne({
                email: contactData.email,
                createdAt: { $gte: oneDayAgo },
            });
            if (existingContact) {
                throw new errorHandler_1.CustomError("A contact form has already been submitted with this email in the last 24 hours", 400);
            }
            const contact = yield ContactForm_1.default.create(Object.assign(Object.assign({}, contactData), { source: contactData.source || "website" }));
            logger_1.logger.info("Contact form created successfully", {
                contactId: contact._id,
                email: contact.email,
                subject: contact.subject,
            });
            return contact;
        });
    }
    static getAllContacts() {
        return __awaiter(this, arguments, void 0, function* (page = 1, limit = 10, status, state) {
            const query = {};
            if (status) {
                query.status = status;
            }
            if (state) {
                query.state = state;
            }
            const skip = (page - 1) * limit;
            const [contacts, total] = yield Promise.all([
                ContactForm_1.default.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                ContactForm_1.default.countDocuments(query),
            ]);
            return {
                contacts,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
    static getContactById(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield ContactForm_1.default.findById(contactId);
            if (!contact) {
                throw new errorHandler_1.CustomError("Contact form not found", 404);
            }
            return contact;
        });
    }
    static updateContactStatus(contactId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield ContactForm_1.default.findByIdAndUpdate(contactId, { status }, { new: true, runValidators: true });
            if (!contact) {
                throw new errorHandler_1.CustomError("Contact form not found", 404);
            }
            logger_1.logger.info("Contact form status updated", {
                contactId: contact._id,
                status: contact.status,
            });
            return contact;
        });
    }
    static getContactStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const [total, pending, contacted, resolved, closed, byState] = yield Promise.all([
                ContactForm_1.default.countDocuments(),
                ContactForm_1.default.countDocuments({ status: "pending" }),
                ContactForm_1.default.countDocuments({ status: "contacted" }),
                ContactForm_1.default.countDocuments({ status: "resolved" }),
                ContactForm_1.default.countDocuments({ status: "closed" }),
                ContactForm_1.default.aggregate([
                    {
                        $group: {
                            _id: "$state",
                            count: { $sum: 1 },
                        },
                    },
                ]),
            ]);
            const stateStats = {};
            byState.forEach((item) => {
                stateStats[item._id] = item.count;
            });
            return {
                total,
                pending,
                contacted,
                resolved,
                closed,
                byState: stateStats,
            };
        });
    }
    static deleteContact(contactId) {
        return __awaiter(this, void 0, void 0, function* () {
            const contact = yield ContactForm_1.default.findByIdAndDelete(contactId);
            if (!contact) {
                throw new errorHandler_1.CustomError("Contact form not found", 404);
            }
            logger_1.logger.info("Contact form deleted", { contactId });
        });
    }
}
exports.ContactService = ContactService;
//# sourceMappingURL=contactService.js.map