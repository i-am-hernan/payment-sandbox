import mongoose, { Schema, Document, model, Model } from "mongoose";

interface IFormula extends Document {
  stringifiedConfiguration: string;
  description: string;
  slug: string;
  createdBy: string;
}

const FormulaSchema: Schema = new Schema(
  {
    configuration: {
      type: Schema.Types.Mixed,
      required: true,
    },
    description: { type: String, required: false },

    integrationType: {
      type: String,
      required: true,
    },
    txVariant: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
    },

    // //TODO: Consider breaking this down into HTML, CSS, and JS
    // stringifiedConfiguration: {
    //   type: String,
    //   required: true,
    // },
    // sdkConfigurationObject: { type: String, required: false },
    // paymentRequest: { type: Schema.Types.Mixed, required: false },
    // checkoutAPIVersion: {},
    // adyenWebVersion: { type: String, required: false },
    // // TODO:
    // checkoutConfiguration: { type: String, required: false },
    // txVariant: { type: String, required: false },
    // txVariantConfiguration: { type: String, required: false },
    // sessionsRequest: { type: String, required: false },
    // paymentMethodsRequest: { type: String, required: false },
    // paymentsRequest: { type: String, required: false },
    // paymentsDetailsRequest: { type: String, required: false },
    // style: {},
  },
  { timestamps: true }
);

const Formula: Model<IFormula> = mongoose.models.Formula || mongoose.model("Formula", FormulaSchema);
export default Formula;
