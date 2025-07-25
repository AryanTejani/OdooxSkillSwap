import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToK4qEfbnd-RN82wdL2awn_PMviy_pelocqQ",
    },
    rating: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    linkedinLink: {
      type: String,
      default: "",
    },
    githubLink: {
      type: String,
      default: "",
    },
    portfolioLink: {
      type: String,
      default: "",
    },
    skillsProficientAt: [
      {
        type: String,
        default: "",
      },
    ],
    skillsToLearn: [
      {
        type: String,
        default: "",
      },
    ],
    // NEW FIELDS
    skillsKnown: [
      {
        type: String,
        default: "",
      },
    ],
    skillsWantToLearn: [
      {
        type: String,
        default: "",
      },
    ],
    availability: {
      type: String,
      enum: ["everyday", "weekend", "weekday", "custom"],
      default: "everyday",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    education: [
      {
        institution: {
          type: String,
          default: "",
        },
        degree: {
          type: String,
          default: "",
        },
        startDate: {
          type: Date,
          default: null,
        },
        endDate: {
          type: Date,
          default: null,
        },
        score: {
          type: Number,
          default: 0,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    bio: {
      type: String,
      default: "",
    },
    projects: [
      {
        title: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
        projectLink: {
          type: String,
          default: "",
        },
        techStack: [
          {
            type: String,
            default: "",
          },
        ],
        startDate: {
          type: Date,
          default: null,
        },
        endDate: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
