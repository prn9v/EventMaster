const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    eventTimeFrom: {
      type: String, // Time stored as a string in HH:mm format
      required: true,
    },
    eventTimeTo: {
      type: String, // Time stored as a string in HH:mm format
      required: true,
    },
    eventDateFrom: {
      type: Date,
      required: true,
    },
    eventDateTo: {
      type: Date,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    eventPrice: {
      type: Number,
      required: true,
    },
    ticketAvailable: {
      type: Number,
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },
    eventCategory: {
      type: String,
      required: true,
    },
    eventPhoto: {
      type: String, // URL or file path to the event's photo
      required: true,
    },
    ticketsSold: {
      type: Number,
      default: 0, // Default value is 0
    },
    bookedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Disapproved"],
      default: "Pending", // Default status is Pending
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User who uploaded the event
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

eventSchema.post("save", function (doc, next) {
  if (doc.status === "Disapproved") {
    doc
      .deleteOne()
      .then(() => {
        console.log(`Event ${doc._id} has been disapproved and deleted.`);
        next();
      })
      .catch((error) => {
        console.error("Error deleting disapproved event:", error);
        next(error);
      });
  } else {
    next();
  }
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);
module.exports = Event;
