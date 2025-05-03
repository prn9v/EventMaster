const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Customer"],
      default: "Customer",
    },
    photo: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    eventsBooked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        default: [], // Initialize as an empty array
      },
    ],
    eventsUploaded: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        default: [], // Initialize as an empty array
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
