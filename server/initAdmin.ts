import { firebaseStorage } from "./firebaseStorage";

async function initializeAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await firebaseStorage.getUserByUsername("admin");
    
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin);
      return;
    }

    // Create admin user
    const adminUser = await firebaseStorage.createUser({
      username: "admin",
      password: "password"
    });

    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

// Run the initialization
initializeAdminUser();
