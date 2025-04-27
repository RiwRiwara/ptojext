import { EnchantedImage } from "./types";
import { db } from "./db";

// Function to add an image
export async function addImage(imageSettings: EnchantedImage) {
  const { name, data } = imageSettings;
  try {
    const id = await db.enchantedImages.add({ name, data });
    return {
      id,
      message: "Image added successfully",
      status: true,
    };
  } catch (error) {
    return {
      message: "Failed to add image",
      status: false,
    };
  }
}

// Function to get all images
export async function getAllImages() {
  try {
    const images = (await db.enchantedImages.toArray()) as EnchantedImage;
    return {
      images,
      message: "Images retrieved successfully",
      status: true,
    };
  } catch (error) {
    return {
      message: "Failed to retrieve images",
      status: false,
    };
  }
}

// Function to get an image by ID
export async function getImageById(id: number) {
  try {
    const image = await db.enchantedImages.get(id);
    if (image) {
      return {
        image,
        message: "Image retrieved successfully",
        status: true,
      };
    } else {
      return {
        message: "Image not found",
        status: false,
      };
    }
  } catch (error) {
    return {
      message: "Failed to retrieve image",
      status: false,
    };
  }
}

// Function to remove an image by ID
export async function removeImage(id: number) {
  try {
    await db.enchantedImages.delete(id);
    return {
      message: "Image removed successfully",
      status: true,
    };
  } catch (error) {
    return {
      message: "Failed to remove image",
      status: false,
    };
  }
}

// Function to remove all images
export async function removeAllImages() {
  try {
    await db.enchantedImages.clear();
    return {
      message: "Clear all images successfully",
      status: true,
    };
  } catch (error) {
    return {
      message: "Failed to Clear image",
      status: false,
    };
  }
}
