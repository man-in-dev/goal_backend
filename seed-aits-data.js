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
const dotenv_1 = __importDefault(require("dotenv"));
const AITSVideoSolution_1 = __importDefault(require("./src/models/AITSVideoSolution"));
const db_1 = __importDefault(require("./src/config/db"));
// Load environment variables
dotenv_1.default.config();
const aitsTestData = [
    {
        testName: "AITS MIN TEST - 01",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=y5kvj_89wwc",
        order: 1,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 01",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=33kSYydCmYs",
        order: 2,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 01",
        subject: "INORGANIC CHEMISTRY",
        videoLink: "https://www.youtube.com/watch?v=JsWQcNivaN4",
        order: 3,
        isActive: true,
    },
    {
        testName: "AITS FLASH BACK - 01",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=LSd03PFfIRA",
        order: 4,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 02",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=4KyTWprBw7g",
        order: 5,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 02",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=6Kbcb569Tjg",
        order: 6,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 02",
        subject: "INORGANIC CHEMISTRY",
        videoLink: "https://www.youtube.com/watch?v=yfyeEpnJrUA",
        order: 7,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 03",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=HJz-aWTIho4",
        order: 8,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 03",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=Y2MdA4ip5fY",
        order: 9,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 03",
        subject: "ORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=Oexlv9seWyk",
        order: 10,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 03",
        subject: "INORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=WaMTPpwRZRY",
        order: 11,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 04",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=3kd5S8M1uMo",
        order: 12,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 04",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=BPxJHUxOu-k",
        order: 13,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 04",
        subject: "ORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=er4hk9PG3eU",
        order: 14,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 04",
        subject: "INORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=A1OfmbQdb9Q",
        order: 15,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 05",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=N-qHQADD00g",
        order: 16,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 05",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=x6NsomGzHNU",
        order: 17,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 05",
        subject: "ORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=FVKgKyjEaIc",
        order: 18,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 05",
        subject: "INORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=0y2Sp8UIatI",
        order: 19,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 06",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=4GFqvV-9LVI",
        order: 20,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 06",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=JYfJUWEr5TU",
        order: 21,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 06",
        subject: "ORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=BHhxKzNGyaQ",
        order: 22,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 06",
        subject: "INORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=pund-CEuDPs",
        order: 23,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 07",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=xLl--QTbM4g",
        order: 24,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 07",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=nfX-Bzmefmc",
        order: 25,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 07",
        subject: "ORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=sT-htbTJRaw",
        order: 26,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 07",
        subject: "INORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=_rvM-qXVHQg",
        order: 27,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 08",
        subject: "PHYSICS SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=TVq6iNTl790",
        order: 28,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 08",
        subject: "PHYSICAL CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=liqDuHcsTEY",
        order: 29,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 08",
        subject: "ORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=TTYqXRW2UCg",
        order: 30,
        isActive: true,
    },
    {
        testName: "AITS MIN TEST - 08",
        subject: "INORGANIC CHEMISTRY SOLUTION",
        videoLink: "https://www.youtube.com/watch?v=y4qmGKk_UgI",
        order: 31,
        isActive: true,
    },
];
function seedAITSData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Connecting to database...');
            yield (0, db_1.default)();
            // Wait a bit for connection to establish
            yield new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Clearing existing AITS video solutions...');
            yield AITSVideoSolution_1.default.deleteMany({});
            console.log('Existing data cleared.');
            console.log('Inserting AITS video solutions...');
            const inserted = yield AITSVideoSolution_1.default.insertMany(aitsTestData);
            console.log(`✅ Successfully inserted ${inserted.length} AITS video solutions!`);
            console.log('\nInserted records:');
            inserted.forEach((item, index) => {
                console.log(`${index + 1}. ${item.testName} - ${item.subject}`);
            });
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Error seeding AITS data:', error);
            process.exit(1);
        }
    });
}
// Run the seed function
seedAITSData();
//# sourceMappingURL=seed-aits-data.js.map