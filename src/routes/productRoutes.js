const express = require("express");
const multer = require("multer");
const authenticate = require("../middleware/authMiddleware");
const productController = require("../controllers/productController");
const supabase = require("../config/supabaseClient");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const upload = require("../middleware/multer"); // your multer setup

router.get("/", productController.getAllProducts);
router.get("/by-category/:name", productController.getProductsByCategory); 
// GET all products (auth)
router.get("/list", authenticate, async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ message: "Error fetching products", error: error.message });
  res.json(data);
});

// GET all products (no auth)
router.get("/all", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ message: "Error fetching products", error: error.message });
  res.json(data);
});




router.get("/fmanufacturer", authenticate, async (req, res) => {
  try {
    if (req.user.role === "master") {
      return res.status(403).json({ message: "Master admin should use the master endpoint" });
    }

    // Find manufacturer_id using user_id
    const { data: manufacturer, error: manufacturerError } = await supabase
      .from("manufacturers")
      .select("id")
      .eq("user_id", req.user.id)
      .single();
console.log("Logged-in user ID:", req.user.id);


    if (manufacturerError || !manufacturer) {
      return res.status(404).json({ message: "Manufacturer not found", error: manufacturerError?.message });
    }

    const manufacturerId = manufacturer.id;

    // Now fetch products for that manufacturer
    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("manufacturer_id", manufacturerId);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("manufacturer_id", manufacturerId);

    if (countError || error) {
      return res.status(500).json({
        message: "Error fetching products",
        error: (countError || error).message,
      });
    }

    res.json({ totalProducts: count, products: data });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



// router.post(
//   "/addProduct",
//   authenticate,
//   upload.fields([
//     { name: "imageFile", maxCount: 1 },
//     { name: "videoFile", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const loggedInUserId = req.user.id;
//       console.log("🔐 Logged-in user ID:", loggedInUserId);

//       // ✅ Step 1: Find Manufacturer by user_id
//       // ✅ Step 1: Find or Create Manufacturer by user_id
// // ✅ Step 1: Find Manufacturer by user_id
// let manufacturer;
// const { data: manufacturerData, error: manufacturerError } = await supabase
//   .from("manufacturers")
//   .select("id, user_id")
//   .eq("user_id", loggedInUserId);

// console.log("✅ Manufacturer Query Response =>", {
//   manufacturerData,
//   manufacturerError,
// });

// if (manufacturerError) {
//   return res.status(400).json({
//     message: "Error fetching manufacturers",
//     error: manufacturerError.message,
//   });
// }

// if (!manufacturerData || manufacturerData.length === 0) {
//   // Try auto-create manufacturer
//   const { data: newManufacturerData, error: createError } = await supabase
//     .from("manufacturers")
//     .insert([{ user_id: loggedInUserId, name: req.user.email || "Auto Manufacturer" }])
//     .select();

//   console.log("🆕 New Manufacturer Created =>", {
//     newManufacturerData,
//     createError,
//   });

//   if (createError) {
//     return res.status(500).json({
//       message: "❌ Could not auto-create manufacturer",
//       error: createError.message,
//     });
//   }

//   manufacturer = newManufacturerData[0];
// } else {
//   manufacturer = manufacturerData[0];
// }



//       // ✅ Step 2: Upload image
//       let imageUrl = "";
//       if (req.files?.imageFile?.[0]) {
//         const image = req.files.imageFile[0];
//         const imageName = `${uuidv4()}-${image.originalname}`;

//         const { error: imageError } = await supabase.storage
//           .from("product-images")
//           .upload(imageName, image.buffer, { contentType: image.mimetype });

//         if (imageError) throw imageError;

//         const { data: publicUrlData } = supabase.storage
//           .from("product-images")
//           .getPublicUrl(imageName);

//         imageUrl = publicUrlData.publicUrl;
//       }

//       // ✅ Step 3: Upload video
//       let videoUrl = "";
//       if (req.files?.videoFile?.[0]) {
//         const video = req.files.videoFile[0];
//         const videoName = `${uuidv4()}-${video.originalname}`;

//         const { error: videoError } = await supabase.storage
//           .from("product-videos")
//           .upload(videoName, video.buffer, { contentType: video.mimetype });

//         if (videoError) throw videoError;

//         const { data: publicUrlData } = supabase.storage
//           .from("product-videos")
//           .getPublicUrl(videoName);

//         videoUrl = publicUrlData.publicUrl;
//       }

//       // ✅ Step 4: Insert product
//       const {
//         name,
//         description,
//         price,
//         category,
//         stock,
//         location,
//         company,
//         size,
//         returnPolicy,
//       } = req.body;

//       const { data: insertData, error: insertError } = await supabase
//         .from("products")
//         .insert([
//           {
//             name,
//             description,
//             price,
//             category,
//             stock,
//             location,
//             company,
//             size,
//             return_policy: returnPolicy,
//             image_url: imageUrl,
//             video_url: videoUrl,
//             manufacturer_id: manufacturer.id,
//           },
//         ]);

//       if (insertError) {
//         console.error("Insert error:", insertError);
//         return res.status(400).json({ message: "Insert error", error: insertError.message });
//       }

//       return res.status(201).json({
//         message: "✅ Product added successfully",
//         data: insertData,
//       });

//     } catch (error) {
//       console.error("❗ Upload or DB error:", error.message);
//       res.status(500).json({ message: "Upload or DB error", error: error.message });
//     }
//   }
// );

router.post(
  "/addProduct",
  authenticate,
  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const loggedInUserId = req.user.id;
      console.log("🔐 Logged-in user ID:", loggedInUserId);

      // Step 1: Get or create manufacturer
      const { data: manufacturerData, error: manufacturerError } = await supabase
        .from("manufacturers")
        .select("id")
        .eq("user_id", loggedInUserId)
        .maybeSingle();

      if (manufacturerError) throw manufacturerError;

      let manufacturerId;
      if (!manufacturerData) {
        const { data: newManufacturer, error: createError } = await supabase
          .from("manufacturers")
          .insert([{
            user_id: loggedInUserId,
            name: req.user.email || "Auto Manufacturer",
            contact_email: req.user.email
          }])
          .select("id")
          .single();

        if (createError) throw createError;
        manufacturerId = newManufacturer.id;
      } else {
        manufacturerId = manufacturerData.id;
      }

      // Step 2: Upload image
      let imageUrl = "";
      if (req.files?.imageFile?.[0]) {
        const image = req.files.imageFile[0];
        const imageName = `${uuidv4()}-${image.originalname}`;

        const { error: imageError } = await supabase.storage
          .from("product-images")
          .upload(imageName, image.buffer, { contentType: image.mimetype });

        if (imageError) throw imageError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(imageName);

        imageUrl = publicUrlData.publicUrl;
      }

      // Step 3: Upload video
      let videoUrl = "";
      if (req.files?.videoFile?.[0]) {
        const video = req.files.videoFile[0];
        const videoName = `${uuidv4()}-${video.originalname}`;

        const { error: videoError } = await supabase.storage
          .from("product-videos")
          .upload(videoName, video.buffer, { contentType: video.mimetype });

        if (videoError) throw videoError;

        const { data: publicUrlData } = supabase.storage
          .from("product-videos")
          .getPublicUrl(videoName);

        videoUrl = publicUrlData.publicUrl;
      }

      // Step 4: Map form fields properly to snake_case
      const {
        name,
        description,
        price,
        category,
        stock,
        company,
        size,
        returnPolicy,
        location
      } = req.body;

      const productData = {
        name,
        description,
        price: Number(price),
        category,
        stock: Number(stock),
        company,
        size,
        return_policy: returnPolicy,
        location,
        manufacturer_id: manufacturerId,
        image_url: imageUrl,
        video_url: videoUrl,
      };

      // Step 5: Insert product
      const { data: product, error: insertError } = await supabase
        .from("products")
        .insert(productData)
        .select();

      if (insertError) throw insertError;

      res.status(201).json({
        message: "✅ Product added successfully",
        product
      });

    } catch (error) {
      console.error("❌ Error:", error);
      res.status(500).json({
        message: "Error adding product",
        error: error.message
      });
    }
  }
);






router.put(
  "/:id",
  authenticate,
  upload.fields([
    { name: "imageFile", maxCount: 1 },
    { name: "videoFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const productId = req.params.id;
      const userId = req.user.id;  // from authenticate middleware

      console.log("User ID from token:", userId);

      // Step 1: Get the product by id
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("manufacturer_id, image_url, video_url")
        .eq("id", productId)
        .single();

      if (productError || !productData) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Step 2: Get the manufacturer of the product
      const { data: manufacturerData, error: manufacturerError } = await supabase
        .from("manufacturers")
        .select("user_id")
        .eq("id", productData.manufacturer_id)
        .single();

      if (manufacturerError || !manufacturerData) {
        return res.status(404).json({ message: "Manufacturer not found" });
      }

      // Step 3: Verify logged-in user owns the manufacturer
      if (manufacturerData.user_id !== userId) {
        return res.status(403).json({ message: "Not authorized to edit this product" });
      }

      // Step 4: Prepare update fields (only allow specific fields)
      const updates = {};

      if (req.body.name) updates.name = req.body.name;
      if (req.body.description) updates.description = req.body.description;
      if (req.body.price) updates.price = Number(req.body.price);
      if (req.body.category) updates.category = req.body.category;
      if (req.body.stock) updates.stock = Number(req.body.stock);
      if (req.body.location) updates.location = req.body.location;
      if (req.body.company) updates.company = req.body.company;
      if (req.body.size) updates.size = req.body.size;
      if (req.body.returnPolicy !== undefined) {
        updates.return_policy = req.body.returnPolicy;
      }

      // Step 5: Handle image upload (replace old image if any)
      if (req.files?.imageFile?.[0]) {
        const image = req.files.imageFile[0];
        const imageName = `${uuidv4()}-${image.originalname}`;

        // Delete old image from storage if exists
        if (productData.image_url) {
          const oldImagePath = productData.image_url.split("/storage/v1/object/public/product-images/")[1];
          if (oldImagePath) {
            await supabase.storage.from("product-images").remove([oldImagePath]);
          }
        }

        // Upload new image
        const { error: imageError } = await supabase.storage
          .from("product-images")
          .upload(imageName, image.buffer, { contentType: image.mimetype });

        if (imageError) throw imageError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(imageName);

        updates.image_url = publicUrlData.publicUrl;
      }

      // Step 6: Handle video upload (replace old video if any)
      if (req.files?.videoFile?.[0]) {
        const video = req.files.videoFile[0];
        const videoName = `${uuidv4()}-${video.originalname}`;

        // Delete old video from storage if exists
        if (productData.video_url) {
          const oldVideoPath = productData.video_url.split("/storage/v1/object/public/product-videos/")[1];
          if (oldVideoPath) {
            await supabase.storage.from("product-videos").remove([oldVideoPath]);
          }
        }

        // Upload new video
        const { error: videoError } = await supabase.storage
          .from("product-videos")
          .upload(videoName, video.buffer, { contentType: video.mimetype });

        if (videoError) throw videoError;

        const { data: publicUrlData } = supabase.storage
          .from("product-videos")
          .getPublicUrl(videoName);

        updates.video_url = publicUrlData.publicUrl;
      }

      // Step 7: Update product with new values
      const { data: updatedData, error: updateError } = await supabase
        .from("products")
        .update(updates)
        .eq("id", productId)
        .select();

      if (updateError) {
        return res.status(500).json({ message: "Update failed", error: updateError.message });
      }

      return res.json({ message: "Product updated successfully", product: updatedData[0] });

    } catch (error) {
      console.error("Edit product error:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);



router.delete("/:id", authenticate, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    console.log("Delete request - userRole:", userRole, "userId:", userId, "productId:", productId);

    // Build initial query to find the product with given ID
    let productQuery = supabase.from("products").select("*").eq("id", productId);

    // If user is not master, restrict to only products they own (manufacturer_id = userId)
    // if (userRole !== "master") {
    //   productQuery = productQuery.eq("manufacturer_id", userId);
    // }

    const { data: products, error: selectError } = await productQuery;

    if (selectError) {
      console.error("Error querying product:", selectError);
      return res.status(500).json({ message: "Database query error", error: selectError.message });
    }

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Product not found or not authorized" });
    }

    // Product found and user authorized - proceed to delete
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (deleteError) {
      console.error("Error deleting product:", deleteError);
      return res.status(500).json({ message: "Error deleting product", error: deleteError.message });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.put('/update-stock/:id', authenticate, async (req, res) => {
  try {
    const productId = req.params.id;
    const quantityChange = req.body.quantity;

    // Fetch product by ID
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId);

    if (fetchError || !products || products.length === 0) {
      return res.status(404).json({ message: 'Product not found', error: fetchError?.message });
    }

    const product = products[0];

    // Fetch manufacturer entity from user_id
    const { data: manufacturerData, error: manufacturerError } = await supabase
      .from('manufacturers')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    if (manufacturerError || !manufacturerData) {
      return res.status(403).json({ message: 'Manufacturer not found or unauthorized' });
    }

    // Authorization check: product.manufacturer_id must match manufacturer id
    if (product.manufacturer_id !== manufacturerData.id) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Calculate new stock
    const newStock = product.stock + quantityChange;
    if (newStock < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update stock in Supabase
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', productId)
      .select();

    if (updateError) {
      return res.status(500).json({ message: 'Stock update failed', error: updateError.message });
    }

    res.json({
      success: true,
      message: 'Stock updated successfully',
      product: updatedProduct[0],
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


module.exports = router;
