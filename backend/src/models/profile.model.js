import mongoose from "mongoose"

const profileSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    bornPlace: {
      type: String,
      required: true,
    },
    bornDate: {
      type: Date,
      required: true,
    },
    shortProfile: {
      type: String,
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (num) {
          return /^\+62\d{8,13}$/.test(num)
        },
        message: (props) => `${props.value} bukan nomor telepon yang valid!`,
      },
    },
    workingExperience: [
      {
        position: String,
        company: String,
        startYear: Date,
        endYear: Date,
        description: String,
        _id: false,
      },
    ],
    education: [
      {
        institution: String,
        major: String,
        level: String,
        gradYear: Date,
        _id: false,
      },
    ],
    certification: [
      {
        name: String,
        organizer: String,
        year: Date,
        _id: false,
      },
    ],
    skills: {
      hardSkill: [String],
      softSkill: [String],
    },
    portfolio: [
      {
        projectName: String,
        link: String,
        _id: false,
      },
    ],
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
  },
  { timestamps: true }
)

const Profile = mongoose.model("Profile", profileSchema)

export default Profile
