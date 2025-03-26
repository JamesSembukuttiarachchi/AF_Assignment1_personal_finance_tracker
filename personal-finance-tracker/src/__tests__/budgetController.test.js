const Budget = require("../models/Budget");
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

// Mock the Budget model
jest.mock("../models/Budget");

describe("Budget Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getBudgets", () => {
    it("should fetch all budgets for the user", async () => {
      const mockBudgets = [
        {
          _id: "budget123",
          userId: "user123",
          category: "Groceries",
          amount: 500,
          month: "2023-10",
        },
      ];

      // Mock Budget.find
      Budget.find.mockResolvedValue(mockBudgets);

      await getBudgets(req, res);

      expect(res.json).toHaveBeenCalledWith(mockBudgets);
    });

    it("should return 500 if there is an error", async () => {
      // Mock Budget.find to throw an error
      Budget.find.mockRejectedValue(new Error("Database error"));

      await getBudgets(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("updateBudget", () => {
    it("should update a budget and return it", async () => {
      req.params.id = "budget123";
      req.body = {
        category: "Groceries",
        amount: 600,
        month: "2023-10",
      };

      const mockBudget = {
        _id: "budget123",
        userId: "user123",
        ...req.body,
      };

      // Mock Budget.findByIdAndUpdate
      Budget.findByIdAndUpdate.mockResolvedValue(mockBudget);

      await updateBudget(req, res);

      expect(res.json).toHaveBeenCalledWith(mockBudget);
    });

    it("should return 500 if there is an error", async () => {
      req.params.id = "budget123";
      req.body = {
        category: "Groceries",
        amount: 600,
        month: "2023-10",
      };

      // Mock Budget.findByIdAndUpdate to throw an error
      Budget.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await updateBudget(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("deleteBudget", () => {
    it("should delete a budget and return a success message", async () => {
      req.params.id = "budget123";

      // Mock Budget.findByIdAndDelete
      Budget.findByIdAndDelete.mockResolvedValue(true);

      await deleteBudget(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Budget deleted successfully",
      });
    });

    it("should return 500 if there is an error", async () => {
      req.params.id = "budget123";

      // Mock Budget.findByIdAndDelete to throw an error
      Budget.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

      await deleteBudget(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
