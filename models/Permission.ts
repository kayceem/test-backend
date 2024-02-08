import { Schema, Types, model } from "mongoose";
import baseSchema, { IBaseSchema } from "./BaseSchema";
import { TreeNode } from "utils/coreHelper";

export interface IPermission extends IBaseSchema {
  listPermission: string;
  userId: Types.ObjectId;
}

const permissionSchema = new Schema<IPermission>(
  {
    listPermission: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

permissionSchema.add(baseSchema);

// permissionSchema.index({ name: "text", description: "text" });

const Permission = model<IPermission>("Permission", permissionSchema);

export default Permission;
