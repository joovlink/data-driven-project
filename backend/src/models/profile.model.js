import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🧍 General Information
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    birthDate: { type: Date },
    phoneNumber: {
      type: String,
      validate: {
        validator: (num) => /^\+62\d{8,13}$/.test(num),
        message: (props) => `${props.value} bukan nomor telepon yang valid!`,
      },
    },
    country: { type: String },
    province: { type: String },
    city: { type: String },
    shortDesc: { type: String },

    // 💼 Work Experience
    experience: [
      {
        jobName: String,
        companyName: String,
        startDate: Date,
        endDate: Date,
        shortDesc: String,
        _id: false,
      },
    ],

    // 🎓 Education
    education: [
      {
        qualification: String,
        institutionName: String,
        startYear: Date,
        expectedFinishDate: Date,
        shortDesc: String,
        _id: false,
      },
    ],

    // 🧾 Certification
    certification: [
      {
        name: String,
        organizer: String,
        year: Date,
        _id: false,
      },
    ],

    // 🧠 Skills (dengan level)
    skills: {
      hardSkill: [
        {
          name: String,
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          },
          _id: false,
        },
      ],
      softSkill: [
        {
          name: String,
          level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
          },
          _id: false,
        },
      ],
    },

    // 🌐 Languages
    languages: [
      {
        language: String,
        level: {
          type: String,
          enum: ["Beginner", "Intermediate", "Advance", "Native"],
        },
        _id: false,
      },
    ],

    // 📂 Portfolio
    portfolio: [
      {
        projectName: String,
        link: String,
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
