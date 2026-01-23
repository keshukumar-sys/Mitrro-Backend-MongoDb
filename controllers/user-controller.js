const UserModel = require("../Models/UserSchema");
const hashPassword = require("../Utils/hashPassword");
const comparePassword = require("../Utils/comparePassword");
const generateJsonWebToken = require("../Utils/generatejsonwebtoken");
const BrandModel = require("../Models/BrandSchema");

// SIGNUP → Create user + auto-login
async function signup(req, res) {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password using your utility
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    // Generate JWT token
    const token = generateJsonWebToken({ id: newUser._id, role: newUser.role });

    // Set JWT cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(201).json({
      message: "Signup & login successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// LOGIN → Verify password + generate token
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email & password required" });

  try {
    // Fetch user and include password for comparison
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    // Compare password using your utility
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = generateJsonWebToken({ id: user._id, role: user.role });
    console.log(token);
    // Set JWT cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}



// LOGOUT → Clear JWT cookie
async function logout(req, res) {
  console.log("Logout request received");
  const token = req.cookies.token;
  console.log(token);
  console.log("Logout token:", token);

  if (!token) {
    return res.status(400).json({ message: "No token found" });
  }

  // Clear the JWT cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  return res.status(200).json({ message: "Logout successful" });
}

// Create Wholesale User By Admin
async function createuploader(req, res) {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password using your utility
    const hashedPassword = await hashPassword(password);

    // Create new wholesale user
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: "uploader" // match your schema enum
    });

    return res.status(201).json({
      message: "Uploader user created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error("Error creating wholesale user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


async function createBrand(req, res) {
  const { name, email, phone, licenseNumber, address, password } = req.body;
  console.log("Create Brand request body:", req.body);
  // 1️⃣ Validate input
  if (!name || !email || !phone || !licenseNumber || !address || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 2️⃣ Check existing brand
    const existingBrand = await BrandModel.findOne({
      $or: [{ email }, { phone }, { licenseNumber }]
    });

    if (existingBrand) {
      return res.status(400).json({
        message: "Brand with provided email, phone, or license number already exists"
      });
    }

    // 3️⃣ Hash password
    const hashedPassword = await hashPassword(password);

    // 4️⃣ Create brand
    const newBrand = await BrandModel.create({
      name,
      email,
      phone,
      password: hashedPassword,
      licenseNumber,
      address,
      role: "brand"
    });

    // 5️⃣ Remove password from response

    return res.status(201).json({
      message: "Brand created successfully",
      brand: newBrand
    });

  } catch (error) {
    console.error("Error creating brand:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function approveBrand(req, res) {
  const { email } = req.body;

  // 1️⃣ Validate input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // 2️⃣ Find brand by email
    const brand = await BrandModel.findOne({ email });

    if (!brand) {
      return res.status(404).json({
        message: "Brand not found with this email"
      });
    }

    // 3️⃣ Check if already approved
    if (brand.approved === true) {
      return res.status(400).json({
        message: "Brand is already approved"
      });
    }

    // 4️⃣ Approve brand
    brand.status = true;
    await brand.save();

    return res.status(200).json({
      message: "Brand approved successfully",
      brand: {
        id: brand._id,
        name: brand.name,
        email: brand.email,
        status: brand.approved
      }
    });

  } catch (error) {
    console.error("Error approving brand:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid brand ID" });
    }

    // 2️⃣ Find and delete brand
    const brand = await BrandModel.findByIdAndDelete(id);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    return res.status(200).json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().select("-password");
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await UserModel.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getAllBrands = async (req, res) => {
  try {
    console.log("Fetching all brands");
    const brands = await BrandModel.find().select("-password");
    console.log("Fetched brands:", brands);
    res.status(200).json({ success: true, count: brands.length, brands });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { signup, login, logout,deleteBrand , createuploader, deleteUser,approveBrand , getAllUsers, getUserById, updateUser, createBrand, getAllBrands };