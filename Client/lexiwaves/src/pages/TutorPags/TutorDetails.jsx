import React, { useState } from "react";
import { DotBackground } from "../../components/Background";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { cn } from "../../lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import api from "../../service/api";
import axios from "axios";

const TutorDetails = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    profilePicture: null,
    phoneNumber: "",
    address: "",
    biography:"",

    // Education & Qualifications
    degrees: "",
    certifications: "",
    educationalInstitutions: "",
    relevantCourses: "",

    // Professional Experience
    workHistory: "",
    currentPosition: "",
    teachingExperience: "",

    // Teaching Subjects and Skills
    subjectsOffered: "",
    skillLevels: "",

    // Additional Documents
    teachingLicense: null,

    // Fee Structure
    hourlyRate: "",
    paymentMethods: "",

    // Personal Statement
    personalStatement: "",

    // Verification Documents
    identityProof: null,

    // Consent and Agreements
    termsOfService: false,
    privacyPolicy: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errors = {};
    // Add validation logic here
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const response = await api.post('/tutor/details/',formData)
      console.log(response);
      toast.success("Details saved successfully!");
    } catch (error) {
        console.log(error)
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to save details. Please try again.";
    console.log(error.response.data)
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DotBackground>
      <div className="max-w-4xl mt-10 w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
          Tutor Details Setup
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Complete your profile to start teaching on our platform.
        </p>
        <form className="my-8" onSubmit={handleSubmit}>
          {/* Personal Information */}
          <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <LabelInputContainer>
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <Input
            id="profilePicture"
            onChange={handleChange}
            type="file"
            accept="image/*"
        />
    </LabelInputContainer>
    <LabelInputContainer>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
            id="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Your phone number"
            type="tel"
        />
    </LabelInputContainer>
    <LabelInputContainer>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
            id="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            placeholder="Your date of birth"
            type="date"
        />
    </LabelInputContainer>
    <LabelInputContainer>
        <Label htmlFor="biography">Biography</Label>
        <Input
            id="biography"
            value={formData.biography}
            onChange={handleChange}
            placeholder="A brief biography about yourself"
            type="text"
        />
    </LabelInputContainer>
    <LabelInputContainer>
        <Label htmlFor="gender">Gender</Label>
        <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="block bg-neutral-800 w-full px-3 py-2 text-sm font-medium text-black dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary-other">Non-binary/Other</option>
        </select>
    </LabelInputContainer>
    <LabelInputContainer className="md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input
            id="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Your current address"
            type="text"
        />
    </LabelInputContainer>
</div>


          {/* Education & Qualifications */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Education & Qualifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="degrees">Degrees</Label>
              <Input
                id="degrees"
                value={formData.degrees}
                onChange={handleChange}
                placeholder="Your degrees"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="certifications">Certifications</Label>
              <Input
                id="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="Your certifications"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="educationalInstitutions">
                Educational Institutions
              </Label>
              <Input
                id="educationalInstitutions"
                value={formData.educationalInstitutions}
                onChange={handleChange}
                placeholder="Institutions attended"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="relevantCourses">Relevant Courses</Label>
              <Input
                id="relevantCourses"
                value={formData.relevantCourses}
                onChange={handleChange}
                placeholder="Additional courses or workshops"
                type="text"
              />
            </LabelInputContainer>
          </div>

          {/* Professional Experience */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Professional Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="workHistory">Work History</Label>
              <Input
                id="workHistory"
                value={formData.workHistory}
                onChange={handleChange}
                placeholder="Your work history"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="currentPosition">Current Position</Label>
              <Input
                id="currentPosition"
                value={formData.currentPosition}
                onChange={handleChange}
                placeholder="Your current position"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer className="md:col-span-2">
              <Label htmlFor="teachingExperience">Teaching Experience</Label>
              <Input
                id="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleChange}
                placeholder="Your teaching experience"
                type="text"
              />
            </LabelInputContainer>
          </div>

          {/* Teaching Subjects and Skills */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Teaching Subjects and Skills
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="subjectsOffered">Subjects Offered</Label>
              <Input
                id="subjectsOffered"
                value={formData.subjectsOffered}
                onChange={handleChange}
                placeholder="Subjects you can teach"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="skillLevels">Skill Levels</Label>
              <Input
                id="skillLevels"
                value={formData.skillLevels}
                onChange={handleChange}
                placeholder="Beginner, Intermediate, Advanced"
                type="text"
              />
            </LabelInputContainer>
          </div>

          {/* Additional Documents */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Additional Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="teachingLicense">Teaching License</Label>
              <Input id="teachingLicense" onChange={handleChange} type="file" />
            </LabelInputContainer>
          </div>

        

          {/* Fee Structure */}
          <h3 className="font-semibold text-lg mt-8 mb-4">Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="hourlyRate">Hourly Rate</Label>
              <Input
                id="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="Your hourly rate"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="paymentMethods">Payment Methods</Label>
              <Input
                id="paymentMethods"
                value={formData.paymentMethods}
                onChange={handleChange}
                placeholder="Accepted payment methods"
                type="text"
              />
            </LabelInputContainer>
          </div>

          {/* Personal Statement */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Personal Statement
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <LabelInputContainer>
              <Label htmlFor="personalStatement">Personal Statement</Label>
              <textarea
                id="personalStatement"
                value={formData.personalStatement}
                onChange={handleChange}
                placeholder="Your teaching philosophy and approach"
                className="flex h-32 w-full rounded-md bg-background px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-800"
              />
            </LabelInputContainer>
          </div>

          {/* Verification Documents */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Verification Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="identityProof">Identity Proof</Label>
              <Input id="identityProof" onChange={handleChange} type="file" />
            </LabelInputContainer>
          </div>

          {/* Consent and Agreements */}
          <h3 className="font-semibold text-lg mt-8 mb-4">
            Consent and Agreements
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="termsOfService"
                checked={formData.termsOfService}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label
                htmlFor="termsOfService"
                className="text-sm font-medium text-gray-700"
              >
                I agree to the Terms of Service
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="privacyPolicy"
                checked={formData.privacyPolicy}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label
                htmlFor="privacyPolicy"
                className="text-sm font-medium text-gray-700"
              >
                I consent to the Privacy Policy
              </Label>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="shadow-[inset_0_0_0_2px_#616467] text-sm text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-[#616467] hover:text-white dark:text-neutral-200 transition duration-200">
              Submit
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </DotBackground>
  );
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const radius = 100;
  const [visible, setVisible] = React.useState(false);
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
            radial-gradient(
              ${
                visible ? radius + "px" : "0px"
              } circle at ${mouseX}px ${mouseY}px,
              var(--blue-500),
              transparent 80%
            )
          `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input"
    >
      <input
        type={type}
        className={cn(
          `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent 
            file:text-sm file:font-medium placeholder:text-neutral-400 dark:placeholder-text-neutral-600 
            focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
            disabled:cursor-not-allowed disabled:opacity-50
            dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]
            group-hover/input:shadow-none transition duration-400`,
          className
        )}
        ref={ref}
        {...props}
      />
    </motion.div>
  );
});

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-black dark:text-white leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));

export default TutorDetails;
