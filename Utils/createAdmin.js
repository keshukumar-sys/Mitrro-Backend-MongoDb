const UserModel = require("../Models/UserSchema");
const hashPassword = require("../Utils/hashPassword");

async function createAdmin() {
  console.log("Calling createAdmin function...");

  const email = "mitrro@admin.com";
  const name = "Mitrro Admin";
  const password = "Admin@1234";
  const role = "admin";
  const phone = "0000000000"; // must include phone

  console.log("Checking for existing admin user...");
  const existingAdmin = await UserModel.findOne({ email });
  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  console.log("Creating admin user...");

  const hashedPwd = await hashPassword(password);

  const newAdmin = new UserModel({
    name,
    email,
    password: hashedPwd,
    role,
    phone
  });

  await newAdmin.save();

  console.log("Admin user created successfully");
}

module.exports = createAdmin;
