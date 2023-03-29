import { DailyUsage, MonthlyUsage, AllUsage } from "../models/usageModel.js";
import User from "../models/usersModel.js";
import mongoose, { model } from "mongoose";
import db from "../config/dbConfig.js";

// const dailyUsageCollection = db.collection("dailyUsages");

// const dailyUsageCollection = model("dailyUsage", dailyUsageSchema);

export const GetUsage = async (req, res) => {
  if (req.params.userId) res.render("dashboard");
  else res.render("login");
};

export const AddUsage = async (req, res) => {
  try {
    // Define a route to record water usage
    const userId = req.params.userId;
    const usage = req.body;
    const date = new Date();
    const existingUser = await User.find({ userId });
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );

    // Check if there's already a document for the same date and userId
    const existingDailyUsage = await DailyUsage.findOne({
      userId: userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (existingDailyUsage) {
      existingDailyUsage.usage = usage;
      await existingDailyUsage.save();
    } else {
      const dailyUsage = new DailyUsage({
        date,
        usage: usage,
        userId: userId,
      });
      await dailyUsage.save();
    }

    res.render("dashboard", {
      existingUser,
      userId,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
};

export const getDailyUsage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1
    );
    const usage = await DailyUsage.find({
      userId: userId,
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });
    res.send({
      message: "success",
      success: true,
      data: usage,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
};

// export const getDailyUsage = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const dateStr = req.params.date;
//     const startDate = new Date(dateStr);
//     const endDate = new Date(dateStr);
//     endDate.setDate(endDate.getDate() + 1);

//     const result = await dailyUsageCollection.aggregate([
//       { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
//       { $group: { _id: null, totalUsage: { $sum: "$usage" } } },
//       { $project: { _id: 0, totalUsage: 1 } },
//     ]);
//     console.log(result[0]);
//     const dailyUsage = result[0] ? result[0].totalUsage : 0;
//     res.send(`Daily usage on ${dateStr}: ${dailyUsage} liters`);
//   } catch (err) {
//     res.send({
//       message: err.message,
//       success: false,
//       data: null,
//     });
//   }
// };

// export const getMonthlyUsage = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const year = Number(req.params.year);
//     const month = Number(req.params.month);
//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 1);
//     // Connect to the MongoDB server and calculate the monthly usage
//     // const client = await MongoClient.connect(url);
//     // const db = client.db(dbName);
//     const result = await Usage.aggregate([
//       { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
//       { $group: { _id: null, totalUsage: { $sum: "$usage" } } },
//       { $project: { _id: 0, totalUsage: 1 } },
//     ]);
//     const monthlyUsage = result[0] ? result[0].totalUsage : 0;
//     res.send(`Monthly usage in ${year}-${month}: ${monthlyUsage} liters`);
//   } catch (err) {
//     res.send({
//       message: err.message,
//       success: false,
//       data: null,
//     });
//   }
// };

// Define a function to get the monthly usage for a user
export const getMonthlyUsage = async (req, res) => {
  try {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const userId = req.params.userId;

    // Calculate the start and end of the month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    // Check if a MonthlyUsage document already exists for the current month and year
    let monthlyUsage = await MonthlyUsage.findOne({ userId, month, year });

    // If a document exists, update the totalUsage field
    if (monthlyUsage) {
      const totalUsage = await DailyUsage.aggregate([
        {
          $match: {
            userId: userId,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalUsage: { $sum: "$usage" },
          },
        },
      ]);
      monthlyUsage.totalUsage = Number(totalUsage[0]?.totalUsage || 0);
      await monthlyUsage.save();
    } else {
      // If no document exists, create a new one
      const totalUsage = await DailyUsage.aggregate([
        {
          $match: {
            userId: userId,
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalUsage: { $sum: "$usage" },
          },
        },
      ]);

      monthlyUsage = new MonthlyUsage({
        month: month,
        year: year,
        totalUsage: Number(totalUsage[0]?.totalUsage || 0),
        userId: userId,
      });

      await monthlyUsage.save();
    }

    res.send({
      message: "Monthly usage updated successfully",
      success: true,
      data: monthlyUsage,
    });
  } catch (err) {
    console.error(err);
    res.send({
      message: "An error occurred",
      success: false,
      data: null,
    });
  }
};

export const setMaxUsage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const maxDaily = req.body.maxDaily;
    const maxMonthly = req.body.maxMonthly;

    // Get the current date and month
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;

    // Find the existing AllUsage document for the given user and month
    let allUsage = await AllUsage.findOne({ userId, month });
    let existingUser = await User.findById(userId);
    // If no document exists, create a new one
    if (!allUsage) {
      allUsage = new AllUsage({ userId, month });
    }

    // Update the maxDaily and maxMonthly fields
    allUsage.maxDaily = maxDaily;
    allUsage.maxMonthly = maxMonthly;

    // Save the document to the database
    await allUsage.save();
    res.render("dashboard", {
      existingUser,
      userId,
    });
    // res.send({
    //   message: "max usage recorded",
    //   success: true,
    //   data: null,
    // });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
};

export const getMaxUsage = async (req, res) => {
  try {
    const result = await AllUsage.findOne({ userId: req.params.userId });
    res.send({
      message: `success`,
      success: true,
      data: result,
    });
  } catch (err) {
    res.send({
      message: err.message,
      success: false,
      data: null,
    });
  }
};

//     // Define a route to get daily usage for a user
//     app.get("/usage/daily/:userId/:date", async (req, res) => {
//       const userId = req.params.userId;
//       const dateStr = req.params.date;
//       const startDate = new Date(dateStr);
//       const endDate = new Date(dateStr);
//       endDate.setDate(endDate.getDate() + 1);
//       // Connect to the MongoDB server and calculate the daily usage
//       const client = await MongoClient.connect(url);
//       const db = client.db(dbName);
//       const result = await db
//         .collection("waterUsage")
//         .aggregate([
//           { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
//           { $group: { _id: null, totalUsage: { $sum: "$usage" } } },
//           { $project: { _id: 0, totalUsage: 1 } },
//         ])
//         .toArray();
//       client.close();
//       const dailyUsage = result[0] ? result[0].totalUsage : 0;
//       res.send(`Daily usage on ${dateStr}: ${dailyUsage} liters`);
//     });

//     // Define a route to get monthly usage for a user
//     app.get("/usage/monthly/:userId/:year/:month", async (req, res) => {
//       const userId = req.params.userId;
//       const year = Number(req.params.year);
//       const month = Number(req.params.month);
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 1);
//       // Connect to the MongoDB server and calculate the monthly usage
//       const client = await MongoClient.connect(url);
//       const db = client.db(dbName);
//       const result = await db
//         .collection("waterUsage")
//         .aggregate([
//           { $match: { userId, date: { $gte: startDate, $lt: endDate } } },
//           { $group: { _id: null, totalUsage: { $sum: "$usage" } } },
//           { $project: { _id: 0, totalUsage: 1 } },
//         ])
//         .toArray();
//       client.close();
//       const monthlyUsage = result[0] ? result[0].totalUsage : 0;
//       res.send(`Monthly usage in ${year}-${month}: ${monthlyUsage} liters`);
//     });
//   } catch (e) {
//     res.send({
//       message: error.message,
//       success: false,
//       data: null,
//     });
//   }
// };
