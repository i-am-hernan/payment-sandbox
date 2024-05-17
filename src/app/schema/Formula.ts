import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the Formula document
export interface IFormula extends Document {
  name: string;
  slug: string;
  stringifiedConfiguration: string;
  description: string;
  createdBy: string | null;
}

// Define the Mongoose schema for the Formula model
const FormulaSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    stringifiedConfiguration: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: false, default: null },
  },
  { timestamps: true }
);

// Create and export the Formula model
const Formula = mongoose.models.Formula || mongoose.model<IFormula>("Formula", FormulaSchema);
export default Formula;
