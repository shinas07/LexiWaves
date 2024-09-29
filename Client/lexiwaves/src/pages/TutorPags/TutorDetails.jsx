import React, { useState } from "react";
import { DotBackground } from "../../components/Background";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import api from "../../service/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";


const TutorDetails = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    profilePicture: null,
    phone_number: "",
    address: "",
    biography:"",

    // Education & Qualifications
    degrees: "",
    certifications: "",
    educational_institutions: "",
    relevant_courses: "",

    // Professional Experience
    work_history: "",
    current_position: "",
    teaching_experience: "",

    // Teaching Subjects and Skills
    subjects_offered: "",
    skill_levels: "",

    // Additional Documents
    teaching_license: null,

    // Fee Structure
    hourly_rate: "",
    payment_methods: "",

    // Personal Statement
    personal_statement: "",

    // Verification Documents
    identity_proof: null,

    // Consent and Agreements
    terms_of_service: false,
    privacy_policy: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

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

    console.log('form data', formData)

    const token = sessionStorage.getItem('access')


    try {
       // Make the API request without sending any token
       const response = await axios.post('http://localhost:8000/tutor/details/', formData, {

        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json'  // Adjust if you're sending FormData
          'Content-Type': 'multipart/form-data',
      }

      



       });
       if (response.status === 201) {
        setIsModalOpen(true);
      }

      //  console.log("Details submitted successfully", response.data);
      //  toast.success("Details saved successfully!");
      //  setShowModal(true);
      // setIsModalOpen(true)
 
     
 
    } catch (error) {
       console.error("Error submitting details", error);
       // You can also add error handling logic here if needed
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
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input
            id="phone_number"
            value={formData.phone_number}
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
              <Label htmlFor="educational_institutions">
                Educational Institutions
              </Label>
              <Input
                id="educational_institutions"
                value={formData.educational_institutions}
                onChange={handleChange}
                placeholder="Institutions attended"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="relevant_courses">Relevant Courses</Label>
              <Input
                id="relevant_courses"
                value={formData.relevant_courses}
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
              <Label htmlFor="work_history">Work History</Label>
              <Input
                id="work_history"
                value={formData.work_history}
                onChange={handleChange}
                placeholder="Your work history"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="current_position">Current Position</Label>
              <Input
                id="current_position"
                value={formData.current_position}
                onChange={handleChange}
                placeholder="Your current position"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer className="md:col-span-2">
              <Label htmlFor="teaching_experience">Teaching Experience</Label>
              <Input
                id="teaching_experience"
                value={formData.teaching_experience}
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
              <Label htmlFor="subjects_offered">Subjects Offered</Label>
              <Input
                id="subjects_offered"
                value={formData.subjects_offered}
                onChange={handleChange}
                placeholder="Subjects you can teach"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="skill_levels">Skill Levels</Label>
              <Input
                id="skill_levels"
                value={formData.skill_levels}
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
              <Label htmlFor="teaching_license">Teaching License</Label>
              <Input id="teaching_license" onChange={handleChange} type="file" />
            </LabelInputContainer>
          </div>

        

          {/* Fee Structure */}
          <h3 className="font-semibold text-lg mt-8 mb-4">Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="hourly_rate">Hourly Rate</Label>
              <Input
                id="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                placeholder="Your hourly rate"
                type="text"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="payment_methods">Payment Methods</Label>
              <Input
                id="payment_methods"
                value={formData.payment_methods}
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
              <Label htmlFor="personal_statement">Personal Statement</Label>
              <textarea
                id="personal_statement"
                value={formData.personal_statement}
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
              <Label htmlFor="identity_proof">Identity Proof</Label>
              <Input id="identity_proof" onChange={handleChange} type="file" />
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
                id="terms_of_service"
                checked={formData.terms_of_service}
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
                id="privacy_policy"
                checked={formData.privacy_policy}
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
        {/* <ToastContainer /> */}
      </div>
    

    <Modal isOpen={isModalOpen} />

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
