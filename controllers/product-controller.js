const Product = require("../Models/ProductSchema");
const cloudinary = require("../Config/cloudinary.config");
const BrandModel = require("../Models/BrandSchema");

exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      bulkPrice,
    } = req.body;

    const { id, role } = req.user;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      subcategory,
      bulkPrice,
      images,
      createdBy: id,
      brandId: role === "brand" ? id : null,
      createdByRole: role,
      isApproved: role === "admin",
    });

    res.status(201).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAllProducts = async (req, res) => {
  try {
    const { category, brandId, minPrice, maxPrice } = req.query;
    console.log(brandId, category, minPrice, maxPrice)
    let query = { isApproved: true };

    if (category) query.category = category;
    if (brandId) query.brandId = brandId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }
    console.log("Query:", query);
    let productsQuery = Product.find(query).sort({ createdAt: -1 });

    // Only populate if brandId exists
    if (query.brandId) {
      productsQuery = productsQuery.populate("brand", "name"); // Note: field name is usually lowercase
    }

    const products = await productsQuery;


    res.status(200).json({ success: true, count: products.length, products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("reviews.userId", "name");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTotalProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("reviews.userId", "name");

    if (!products) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, products });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    console.log(req.body);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Replace images if new ones uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images
      for (const img of product.images) {
        await cloudinary.uploader.destroy(img.publicId);
      }

      product.images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const userId = req.user.id;
    console.log("Add Review request body:", req.body);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyRated = product.ratings.find(
      (r) => r.userId.toString() === userId
    );

    if (alreadyRated) {
      alreadyRated.value = rating;
    } else {
      product.ratings.push({ userId, value: rating });
    }

    product.reviews.push({ userId, reviewText });

    await product.save();

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteReview = async (req, res) => {
  try {
    const { id: productId, reviewId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );
    await product.save();

    res.status(200).json({ success: true, message: "Review deleted", product });
  } catch (error) {
    res.status(500).json({ message: error.message });

  }
}
