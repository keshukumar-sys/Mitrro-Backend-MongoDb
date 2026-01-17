const Category = require("../Models/categorySchema");

async function createCategory(req, res) {
    const { title } = req.body;

    if (!title || !req.file) {
        return res.status(400).json({ message: "Title and image are required" });
    }

    try {
        const categoryImage = req.file.path; // Cloudinary/local path

        const newCategory = new Category({
            categoryTitle: title,
            categoryImage: categoryImage,
        });

        await newCategory.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

async function getAllCategorires(req , res){
    try{
        const allcategories = await Category.find();
        res.status(200).json({
            success:true,
            categories:allcategories
        })  
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


async function updateCategory(req, res) {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (title) {
            category.categoryTitle = title;
        }

        if (req.file) {
            category.categoryImage = req.file.path;
        }

        await category.save();

        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}


async function deleteCategory(req, res) {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}



module.exports = {
    createCategory,
    getAllCategorires,  
    updateCategory,
    deleteCategory
};