import React, { useState } from "react";
import { DotBackground } from "../../components/Background";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import api from "../../service/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { Link } from "react-router-dom";


const TutorDetailForm = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    profilePicture: null,
    phone_number: "",
    address: "",
    biography:"",

    // Education & Qualifications
    degrees: "",
    educational_institutions: "",

    // Professional Experience
    work_history: "",
    current_position: "",
    teaching_experience: "",

    // Teaching Subjects and Skills
    subjects_offered: "",
    skill_levels: "",
    // Fee Structure
    hourly_rate: "",


    // Personal Statement
    personal_statement: "",

    // Verification Documents
    identity_proof: null,

    // Consent and Agreements
    terms_of_service: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();


  const handleChange = (e) => {
    const { id, value, type, checked, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.phone_number) errors.phone_number = 'Phone number is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.biography) errors.biography = 'Biography is required';
    if (!formData.gender) errors.gender = 'gender is required';
    if (!formData.hourly_rate) errors.hourly_rate = 'Hourly rate is required';
    if (!formData.terms_of_service) errors.terms_of_service = 'You must accept the Terms of Service';
    if (!formData.dateOfBirth) errors.dateOfBirth = 'Data of birth is required';
    if (!formData.identity_proof) errors.identity_proof = 'Identity proof is required';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
   
    e.preventDefault();

    if(!validate())
      return

    const token = localStorage.getItem('accessToken')


    try {
       // Make the API request without sending any token
       const response = await api.post('/tutor/details/', formData, {

        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
      }

      



       });
       if (response.status === 201) {
        setIsModalOpen(true);
      }

      //  console.log("Details submitted successfully", response.data);
       toast.success("Details saved successfully!");
      //  setShowModal(true);
      // setIsModalOpen(true)
 
     
 
    } catch (error) {
      toast.error('Details is already submited');
       
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
          <h3 className="font-semibold text-white text-lg mb-4">Personal Information</h3>
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
          {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
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
        {errors.dateOfBirth && <p className='text-red-500 text-sm'>{errors.dateOfBirth}</p>}
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
         {errors.biography && <p className="text-red-500 text-sm">{errors.biography}</p>}
    
        
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
        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
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
        {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
    </LabelInputContainer>
</div>


          {/* Education & Qualifications */}
          <h3 className="font-semibold text-white text-lg mt-8 mb-4">
            Education & Qualifications
          </h3>
          <div className="grid grid-cols-1  md:grid-cols-2 gap-4">
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
          </div>

          {/* Professional Experience */}
          <h3 className="font-semibold text-white text-lg mt-8 mb-4">
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
          <h3 className="font-semibold text-white text-lg mt-8 mb-4">
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
          <h3 className="font-semibold text-white text-lg mt-8 mb-4">
            Additional Document
          </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="identity_proof">Identity Proof</Label>
              <Input id="identity_proof" onChange={handleChange} type="file" />
              {errors.identity_proof && <p className="text-red-500 text-sm">{errors.identity_proof}</p>} 
            </LabelInputContainer>
          </div>

        

   
          <div className="grid grid-cols-1 mt-8 md:grid-cols-2 gap-4">
            <LabelInputContainer>
              <Label htmlFor="hourly_rate">$ Hourly Rate </Label>
              <Input
                id="hourly_rate"
                value={formData.hourly_rate}
                onChange={handleChange}
                placeholder="Your hourly rate"
                type="text"
              />
              {errors.hourly_rate && <p className="text-red-500 text-sm">{errors.hourly_rate}</p>} 
            </LabelInputContainer>
          
          </div>

          {/* Personal Statement */}
          <h3 className="font-semibold text-white text-lg mt-8 mb-4">
            Personal Statement
          </h3>
          <div className="grid grid-cols-1 gap-4">
  <LabelInputContainer>
    <textarea
      id="personal_statement"
      value={formData.personal_statement}
      onChange={handleChange}
      placeholder="Your teaching philosophy and approach"
      className="flex h-32 w-full rounded-md bg-background px-3 py-2 text-white text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-neutral-800"
    />
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
            htmlFor="terms_of_service"
            className="text-sm font-medium text-gray-700"
          >
            I agree to the <span className="text-white-600 underline hover:text-gray-400">
              <Link to="/terms-of-service">Terms of Service</Link>
            </span>
          </Label>
                 
              {errors.terms_of_service && <p className="text-red-500 text-sm">{errors.terms_of_service}</p>}
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

export default TutorDetailForm;
