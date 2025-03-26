const Goal = require("../models/Goal");
const {
  createGoal,
  getGoals,
  updateGoal,
  modifySavedAmount,
  deleteGoal,
} = require("../controllers/goalController");

// Mock the Goal model
jest.mock("../models/Goal");

describe("Goal Controller", () => {
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

  describe("createGoal", () => {
    it("should create a new goal and return it", async () => {
      req.body = {
        goalName: "Buy a car",
        targetAmount: 10000,
        targetDate: "2025-12-31",
        percentageChange: 10,
      };

      const mockGoal = {
        _id: "goal123",
        userId: "user123",
        ...req.body,
        savedAmount: 0,
      };

      // Mock Goal.prototype.save
      const saveMock = jest.fn().mockResolvedValue(mockGoal);
      Goal.mockImplementation(() => ({
        save: saveMock,
      }));

      await createGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Goal created successfully",
        goal: mockGoal,
      });
    });

    it("should return 500 if there is an error", async () => {
      req.body = {
        goalName: "Buy a car",
        targetAmount: 10000,
        targetDate: "2025-12-31",
        percentageChange: 10,
      };

      // Mock Goal.prototype.save to throw an error
      const saveMock = jest.fn().mockRejectedValue(new Error("Database error"));
      Goal.mockImplementation(() => ({
        save: saveMock,
      }));

      await createGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("getGoals", () => {
    it("should fetch all goals for the user", async () => {
      const mockGoals = [
        {
          _id: "goal123",
          userId: "user123",
          goalName: "Buy a car",
          targetAmount: 10000,
          savedAmount: 0,
          targetDate: "2025-12-31",
          percentageChange: 10,
        },
      ];

      // Mock Goal.find
      Goal.find.mockResolvedValue(mockGoals);

      await getGoals(req, res);

      expect(res.json).toHaveBeenCalledWith(mockGoals);
    });

    it("should return 500 if there is an error", async () => {
      // Mock Goal.find to throw an error
      Goal.find.mockRejectedValue(new Error("Database error"));

      await getGoals(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("updateGoal", () => {
    it("should update a goal and return it", async () => {
      req.params.id = "goal123";
      req.body = {
        goalName: "Buy a car",
        targetAmount: 15000,
        targetDate: "2025-12-31",
        percentageChange: 15,
      };

      const mockGoal = {
        _id: "goal123",
        userId: "user123",
        ...req.body,
        savedAmount: 0,
      };

      // Mock Goal.findByIdAndUpdate
      Goal.findByIdAndUpdate.mockResolvedValue(mockGoal);

      await updateGoal(req, res);

      expect(res.json).toHaveBeenCalledWith(mockGoal);
    });

    it("should return 500 if there is an error", async () => {
      req.params.id = "goal123";
      req.body = {
        goalName: "Buy a car",
        targetAmount: 15000,
        targetDate: "2025-12-31",
        percentageChange: 15,
      };

      // Mock Goal.findByIdAndUpdate to throw an error
      Goal.findByIdAndUpdate.mockRejectedValue(new Error("Database error"));

      await updateGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("modifySavedAmount", () => {
    it("should update savedAmount with income and return the goal", async () => {
      req.params.id = "goal123";
      req.body = { income: 1000 };

      const mockGoal = {
        _id: "goal123",
        userId: "user123",
        goalName: "Buy a car",
        targetAmount: 10000,
        savedAmount: 0,
        targetDate: "2025-12-31",
        percentageChange: 10,
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock Goal.findById
      Goal.findById.mockResolvedValue(mockGoal);

      await modifySavedAmount(req, res);

      expect(mockGoal.savedAmount).toBe(100); // 10% of 1000
      expect(res.json).toHaveBeenCalledWith({
        message: "Goal savedAmount updated successfully",
        goal: mockGoal,
      });
    });

    it("should update savedAmount with expense and return the goal", async () => {
      req.params.id = "goal123";
      req.body = { expense: 500 };

      const mockGoal = {
        _id: "goal123",
        userId: "user123",
        goalName: "Buy a car",
        targetAmount: 10000,
        savedAmount: 1000,
        targetDate: "2025-12-31",
        percentageChange: 10,
        save: jest.fn().mockResolvedValue(true),
      };

      // Mock Goal.findById
      Goal.findById.mockResolvedValue(mockGoal);

      await modifySavedAmount(req, res);

      expect(mockGoal.savedAmount).toBe(950); // 1000 - (10% of 500)
      expect(res.json).toHaveBeenCalledWith({
        message: "Goal savedAmount updated successfully",
        goal: mockGoal,
      });
    });

    it("should return 404 if goal is not found", async () => {
      req.params.id = "goal123";
      req.body = { income: 1000 };

      // Mock Goal.findById to return null
      Goal.findById.mockResolvedValue(null);

      await modifySavedAmount(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Goal not found" });
    });

    it("should return 500 if there is an error", async () => {
      req.params.id = "goal123";
      req.body = { income: 1000 };

      // Mock Goal.findById to throw an error
      Goal.findById.mockRejectedValue(new Error("Database error"));

      await modifySavedAmount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  describe("deleteGoal", () => {
    it("should delete a goal and return a success message", async () => {
      req.params.id = "goal123";

      // Mock Goal.findByIdAndDelete
      Goal.findByIdAndDelete.mockResolvedValue(true);

      await deleteGoal(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "Goal deleted successfully",
      });
    });

    it("should return 500 if there is an error", async () => {
      req.params.id = "goal123";

      // Mock Goal.findByIdAndDelete to throw an error
      Goal.findByIdAndDelete.mockRejectedValue(new Error("Database error"));

      await deleteGoal(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });
});
