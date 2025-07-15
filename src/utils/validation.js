const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not Valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not Valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};

const validateProfileEditData = (req) => {
  try {
    const { firstName, lastName, email, gender, skills, about, photoUrl, age } = req.body;

    if (firstName && firstName.length < 3) {
      throw new Error("First name must be at least 3 characters.");
    }

    if (lastName && lastName.length < 3) {
      throw new Error("Last name must be at least 3 characters.");
    }

    if (email && !validator.isEmail(email)) {
      throw new Error("Email is not valid!");
    }

    if (photoUrl && !validator.isURL(photoUrl)) {
      throw new Error("Image URL is not valid!");
    }

    if (about && about.length > 150) {
      throw new Error("About exceeds the maximum limit of 150 characters.");
    }

    if (gender && !["male", "female", "others"].includes(gender)) {
      throw new Error("Gender value is not valid!");
    }

    if (skills) {
      const isSkillsArrayOk = Array.isArray(skills) && skills.length <= 10;
      const isSkillsLengthOk = skills.every(
        (skill) => typeof skill === "string" && skill.length >= 2
      );
      if (!isSkillsArrayOk || !isSkillsLengthOk) {
        throw new Error(
          "Skills must be an array of strings, max 10 items, each at least 2 characters."
        );
      }
    }

    if (age && age < 12) {
      throw new Error("Age must be at least 12.");
    }

    const allowedEditFields = [
      "firstName",
      "lastName",
      "email",
      "gender",
      "age",
      "photoUrl",
      "about",
      "skills",
    ];

    const isAllowedEdit = Object.keys(req.body).every((key) => allowedEditFields.includes(key));
    if (!isAllowedEdit) {
      throw new Error("Request contains fields that are not allowed to be edited.");
    }

    return true; // valid
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { validateSignUpData, validateProfileEditData };
