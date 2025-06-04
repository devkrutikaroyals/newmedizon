
const supabase = require("../config/supabaseClient");
// 📊 Get Total Products
exports.getTotalProducts = async (req, res) => {
  try {
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;

    res.json({ totalProducts: count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 📌 Add Product (Master Admin - no manufacturer binding)
exports.addProduct = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([req.body])
      .select();

    if (error) throw error;

    res.status(201).json(data[0]);
  } catch (error) {
    res.status(400).json({ message: "Insert error", error: error.message });
  }
};

// 📌 Get All Products (For Master Admin)
exports.getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// 📌 Get Single Product by ID
exports.getProductById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Product not found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// 📌 Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update(req.body)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Product not found" });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// 📌 Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};


exports.getProductsByCategory = async (req, res) => {
  const categoryName = req.params.name;

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", categoryName);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// // In your backend product controller
// exports.updateStock = async (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const productId = req.params.id;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: 'Invalid product ID' });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Verify manufacturer owns this product
//     if (product.manufacturer.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Unauthorized to update this product' });
//     }

//     const newStock = product.stock + quantity;
//     if (newStock < 0) {
//       return res.status(400).json({ message: 'Insufficient stock' });
//     }

//     product.stock = newStock;
//     await product.save();

//     res.status(200).json({
//       message: 'Stock updated successfully',
//       product: {
//         id: product._id,
//         name: product.name,
//         stock: product.stock
//       }
//     });
//   } catch (error) {
//     console.error('Error updating stock:', error);
//     res.status(500).json({ message: 'Error updating stock', error: error.message });
//   }
// };