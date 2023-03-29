import { Schema, model } from "mongoose";

const dailyUsageSchema = new Schema({
  date: { type: Date, required: true },
  usage: { type: Schema.Types.Mixed, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const DailyUsage = model("DailyUsage", dailyUsageSchema);

const monthlyUsageSchema = new Schema({
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  totalUsage: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const MonthlyUsage = model("MonthlyUsage", monthlyUsageSchema);

const usageSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    require: true,
  },
  usage: {
    type: Schema.Types.Mixed,
    require: true,
  },
  date: {
    type: Date,
    require: true,
  },
  maxDaily: {
    type: Number,
    require: true,
  },
  maxMonthly: {
    type: Number,
    require: true,
  },
});

const AllUsage = model("AllUsage", usageSchema);

// const usageSchema = new Schema({
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: "users",
//     require: true,
//   },
//   usage: {
//     type: Schema.Types.Mixed,
//     require: true,
//   },
//   date: {
//     type: Date,
//     require: true,
//   },
//   maxDaily: {
//     type: Number,
//     require: true,
//   },
//   maxMonthly: {
//     type: Number,
//     require: true,
//   },
// });

// export default model("usage", usageSchema);
// export { dailyUsageSchema, monthlyUsageSchema, usageSchema };
export { DailyUsage, MonthlyUsage, AllUsage };
