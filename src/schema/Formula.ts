import mongoose, { Schema, Document } from "mongoose";

interface Formula extends Document {
  configuration: {
    adyenWebVersion: string;
    checkoutAPIVersion: {
      paymentMethods: string;
      payments: string;
      paymentsDetails: string;
      sessions: string;
    };
    checkoutConfiguration: string;
    request: {
      paymentMethods: Record<string, any>; // Allow any key-value pair of mixed type
      payments: Record<string, any>; // Allow any key-value pair of mixed type
      paymentsDetails: Record<string, any>;
      sessions: Record<string, any>; // Allow any key-value pair of mixed type
    };
    style: Record<string, any>;
    txVariantConfiguration: string;
    isRedirect: boolean;
  };
  description?: string;
  integrationType: string;
  txVariant: string;
  createdBy?: mongoose.Types.ObjectId;
}

const FormulaSchema: Schema = new Schema(
  {
    configuration: {
      adyenWebVersion: { type: String, required: true },
      checkoutAPIVersion: {
        paymentMethods: { type: String, required: true },
        payments: { type: String, required: true },
        paymentsDetails: { type: String, required: true },
        sessions: { type: String, required: true },
      },
      checkoutConfiguration: { type: String, required: true },
      request: {
        paymentMethods: { type: Schema.Types.Mixed, required: true }, // Allow any key-value pair of mixed type
        payments: { type: Schema.Types.Mixed, required: true },
        paymentsDetails: { type: Schema.Types.Mixed, required: true },
        sessions: { type: Schema.Types.Mixed, required: true },
      },
      style: { type: Schema.Types.Mixed, required: true },
      txVariantConfiguration: { type: String, required: false },
      isRedirect: { type: Boolean, required: true },
    },
    description: { type: String, required: false },
    integrationType: { type: String, required: true },
    txVariant: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: false },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.models.Formula ||
  mongoose.model<Formula>("Formula", FormulaSchema);
