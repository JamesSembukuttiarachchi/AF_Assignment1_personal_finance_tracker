const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Budget = require("../models/Budget");
const Goal = require("../models/Goal");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactionController");

// Mock the models and dependencies
jest.mock("../models/Transaction");
jest.mock("../models/User");
jest.mock("../models/Budget");
jest.mock("../models/Goal");
jest.mock("../services/currencyService");
jest.mock("../utils/notificationService");

describe("Transaction Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: "user123" },
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTransaction", () => {
    it("should create a new transaction and return it", async () => {
      req.body = {
        type: "income",
        amount: 100,
        currency: "USD",
        category: "Salary",
        tags: ["work"],
        description: "Monthly salary",
        recurring: false,
        date: "2023-10-01",
      };

      const mockUser = { _id: "user123", preferredCurrency: "USD" };
      const mockTransaction = { _id: "transaction123", ...req.body };

      // Mock User.findById
      User.findById.mockResolvedValue(mockUser);

      // Mock Goal.find to return an iterable array
      Goal.find.mockResolvedValue([
        {
          userId: "user123",
          percentageChange: 10,
          savedAmount: 0,
          save: jest.fn(),
        },
      ]);

      // Mock Transaction.prototype.save
      Transaction.prototype.save.mockResolvedValue(mockTransaction);

      await createTransaction(req, res);

      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(mockTransaction);
    });

    it("should return 404 if user is not found", async () => {
      User.findById.mockResolvedValue(null);

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("User not found");
    });
  });

  describe("getTransactions", () => {
    it("should fetch all transactions for the user", async () => {
      const mockTransactions = [
        { _id: "transaction123", userId: "user123", type: "income" },
      ];

      // Mock Transaction.find to return a query object with a sort method
      Transaction.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTransactions),
      });

      await getTransactions(req, res);

      expect(res.send).toHaveBeenCalledWith(mockTransactions);
    });

    it("should return 400 if there is an error", async () => {
      // Mock Transaction.find to throw an error
      Transaction.find.mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      await getTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getTransactionById", () => {
    it("should fetch a single transaction by ID", async () => {
      req.params.id = "transaction123";
      const mockTransaction = { _id: "transaction123", userId: "user123" };

      // Mock Transaction.findById
      Transaction.findById.mockResolvedValue(mockTransaction);

      await getTransactionById(req, res);

      expect(res.send).toHaveBeenCalledWith(mockTransaction);
    });

    it("should return 404 if transaction is not found or unauthorized", async () => {
      req.params.id = "transaction123";
      Transaction.findById.mockResolvedValue(null);

      await getTransactionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Transaction not found");
    });
  });

  describe("updateTransaction", () => {
    it("should update a transaction and return it", async () => {
      req.params.id = "transaction123";
      req.body = { description: "Updated description" };
      const mockTransaction = {
        _id: "transaction123",
        userId: "user123",
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock Transaction.findById
      Transaction.findById.mockResolvedValue(mockTransaction);

      await updateTransaction(req, res);

      expect(res.send).toHaveBeenCalled();
    });

    it("should return 404 if transaction is not found or unauthorized", async () => {
      req.params.id = "transaction123";
      Transaction.findById.mockResolvedValue(null);

      await updateTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Transaction not found");
    });
  });

  describe("deleteTransaction", () => {
    it("should delete a transaction", async () => {
      req.params.id = "transaction123";
      const mockTransaction = {
        _id: "transaction123",
        userId: "user123",
        type: "expense",
        category: "Food",
        date: new Date(),
        deleteOne: jest.fn().mockResolvedValue(true),
      };

      // Mock Transaction.findById
      Transaction.findById.mockResolvedValue(mockTransaction);

      // Mock Budget.findOne
      Budget.findOne.mockResolvedValue({
        currentSpending: 50,
        save: jest.fn(),
      });

      await deleteTransaction(req, res);

      expect(res.send).toHaveBeenCalledWith({
        message: "Transaction deleted successfully",
      });
    });

    it("should return 404 if transaction is not found or unauthorized", async () => {
      req.params.id = "transaction123";
      Transaction.findById.mockResolvedValue(null);

      await deleteTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Transaction not found");
    });
  });
});
