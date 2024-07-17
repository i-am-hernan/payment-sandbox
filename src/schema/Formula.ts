import mongoose, { Schema, Document, model } from "mongoose";

interface IFormula extends Document {
  stringifiedConfiguration: string;
  description: string;
  slug: string;
  createdBy: string;
}

const FormulaSchema: Schema = new Schema(
  {
    stringifiedConfiguration: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

// export default mongoose.model<IFormula>("Formula", FormulaSchema);
const Formula = mongoose.models.Formula || mongoose.model("Formula", FormulaSchema);
export default Formula;
