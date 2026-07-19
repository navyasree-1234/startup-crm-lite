import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

/**
 * User Schema for Startup CRM Lite
 * Defines the user accounts (admins and regular users) that access the CRM.
 */
const userSchema = new Schema(
  {
    /**
     * The full name of the user.
     * Required, trimmed, minimum 2 characters, maximum 50 characters.
     */
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    /**
     * Unique email address of the user.
     * Required, lowercase, trimmed, validated against standard email regex format.
     */
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Standard RFC 5322 compliant regex for email validation
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: "Email must be a valid email address",
      },
    },
    /**
     * Hashed password of the user.
     * Required, minimum 6 characters. Hashed before persistence.
     */
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    /**
     * Role of the user in the system.
     * Enum: ['admin', 'user'], defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "{VALUE} is not a valid role. Allowed roles are 'admin' or 'user'.",
      },
      default: "user",
    },
    /**
     * Flags whether the user account is active.
     * Defaults to true.
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Auto-generates createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * Pre-save middleware hook
 * Hashes the password using bcryptjs with 10 salt rounds before saving if it has been modified.
 */
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified or is new
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Custom Instance Method: comparePassword
 * Compares a plain text candidate password with the user's hashed password.
 * 
 * @param {string} candidatePassword - The plain-text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(`Password comparison failed: ${error.message}`);
  }
};

/**
 * JSON serialization override
 * Ensures that the password field is excluded when converting the document to JSON
 * (e.g. when sending responses via res.json(user)).
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Export the schema separately for extensibility or multi-model embedding
export { userSchema };

// Export the Mongoose model as default
export const User = mongoose.model("User", userSchema);
export default User;
