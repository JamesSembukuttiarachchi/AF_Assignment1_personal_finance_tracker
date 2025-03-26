const Report = require("../models/Report");
const Transaction = require("../models/Transaction");
const { generateMonthlyReport } = require("../controllers/reportController");

// Mock the models
jest.mock("../models/Report");
jest.mock("../models/Transaction");

describe("Report Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: "user123" },
      body: {
        month: 10, // October
        year: 2023,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("generateMonthlyReport", () => {
    it("should generate a monthly report and return it", async () => {
      const startDate = new Date(2023, 9, 1); // October 1, 2023
      const endDate = new Date(2023, 10, 0); // October 31, 2023

      const mockTransactions = [
        {
          _id: "transaction1",
          userId: "user123",
          type: "income",
          amount: 1000,
          category: "Salary",
          date: new Date(2023, 9, 15), // October 15, 2023
        },
        {
          _id: "transaction2",
          userId: "user123",
          type: "expense",
          amount: 200,
          category: "Groceries",
          date: new Date(2023, 9, 20), // October 20, 2023
        },
      ];

      const mockReport = {
        _id: "report123",
        userId: "user123",
        startDate,
        endDate,
        totalIncome: 1000,
        totalExpense: 200,
        categories: [
          { category: "Salary", totalAmount: 1000 },
          { category: "Groceries", totalAmount: 200 },
        ],
      };

      // Mock Transaction.find
      Transaction.find.mockResolvedValue(mockTransactions);

      // Mock Report.prototype.save
      Report.prototype.save.mockResolvedValue(mockReport);

      await generateMonthlyReport(req, res);

      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(res.status).not.toHaveBeenCalledWith(404);
      expect(res.status).not.toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith(mockReport);
    });

    it("should return 400 if month or year is missing", async () => {
      req.body = {}; // Missing month and year

      await generateMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        error: "Month and year are required.",
      });
    });

    it("should return 404 if no transactions are found", async () => {
      // Mock Transaction.find to return an empty array
      Transaction.find.mockResolvedValue([]);

      await generateMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "No transactions found for the specified month.",
      });
    });

    it("should return 500 if there is an error", async () => {
      // Mock Transaction.find to throw an error
      Transaction.find.mockRejectedValue(new Error("Database error"));

      await generateMonthlyReport(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        error: "An error occurred while generating the report.",
      });
    });
  });
});
