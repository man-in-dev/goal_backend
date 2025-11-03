import ContactForm, { IContactForm } from "../models/ContactForm";
import { CustomError } from "../middleware/errorHandler";
import { logger } from "../utils/logger";

export class ContactService {
  static async createContact(contactData: {
    name: string;
    email?: string;
    phone: string;
    state: string;
    district: string;
    studying?: string;
    course?: string;
    subject?: string;
    message?: string;
    location?: string;
    department?: string;
    source?: string;
  }): Promise<IContactForm> {
    // Check for duplicate contact from same phone in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingContact = await ContactForm.findOne({
      phone: contactData.phone,
      createdAt: { $gte: oneDayAgo },
    });

    if (existingContact) {
      throw new CustomError(
        "A contact form has already been submitted with this phone number in the last 24 hours",
        400
      );
    }

    const contact = await ContactForm.create({
      ...contactData,
      source: contactData.source || "website",
    });

    logger.info("Contact form created successfully", {
      contactId: contact._id,
      email: contact.email || "N/A",
      subject: contact.subject || "N/A",
    });

    return contact;
  }

  static async getAllContacts(
    page: number = 1,
    limit: number = 10,
    status?: string,
    state?: string
  ): Promise<{
    contacts: IContactForm[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (state) {
      query.state = state;
    }

    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      ContactForm.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ContactForm.countDocuments(query),
    ]);

    return {
      contacts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async getContactById(contactId: string): Promise<IContactForm> {
    const contact = await ContactForm.findById(contactId);

    if (!contact) {
      throw new CustomError("Contact form not found", 404);
    }

    return contact;
  }

  static async updateContactStatus(
    contactId: string,
    status: "pending" | "contacted" | "resolved" | "closed"
  ): Promise<IContactForm> {
    const contact = await ContactForm.findByIdAndUpdate(
      contactId,
      { status },
      { new: true, runValidators: true }
    );

    if (!contact) {
      throw new CustomError("Contact form not found", 404);
    }

    logger.info("Contact form status updated", {
      contactId: contact._id,
      status: contact.status,
    });

    return contact;
  }

  static async getContactStats(): Promise<{
    total: number;
    pending: number;
    contacted: number;
    resolved: number;
    closed: number;
    byState: Record<string, number>;
  }> {
    const [total, pending, contacted, resolved, closed, byState] =
      await Promise.all([
        ContactForm.countDocuments(),
        ContactForm.countDocuments({ status: "pending" }),
        ContactForm.countDocuments({ status: "contacted" }),
        ContactForm.countDocuments({ status: "resolved" }),
        ContactForm.countDocuments({ status: "closed" }),
        ContactForm.aggregate([
          {
            $group: {
              _id: "$state",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const stateStats: Record<string, number> = {};
    byState.forEach((item: any) => {
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
  }

  static async deleteContact(contactId: string): Promise<void> {
    const contact = await ContactForm.findByIdAndDelete(contactId);

    if (!contact) {
      throw new CustomError("Contact form not found", 404);
    }

    logger.info("Contact form deleted", { contactId });
  }
}
