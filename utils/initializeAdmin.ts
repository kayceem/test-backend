import { PWD_SALT_ROUNDS } from "../config/constant";
import { enumData } from "../config/enumData";
import User from "../models/User";
import bcrypt from "bcryptjs";


export default async function initializeAdminUser() {
  try {
    const adminUser = await User.findOne({ role: enumData.UserType.Admin.code });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!,PWD_SALT_ROUNDS ); // '!' ensures non-null assertion

      const admin = new User({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        username: process.env.ADMNIN_USERNAME,
        role: enumData.UserType.Admin.code,
        status: enumData.UserStatus.ACTIVE.code,
      });

      await admin.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}
