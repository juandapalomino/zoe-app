import React, { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import styles from "./AdvisorForm.module.css";
import FormInput from "./FormInput";
import Button from "./Button";
import { AdvisorFormValues } from "../types/advisor";

interface AdvisorFormProps {
  initialValues: AdvisorFormValues;
  onSubmit: (values: AdvisorFormValues) => void;
  onCancel: () => void;
  isEditMode?: boolean;
}

const AdvisorForm: React.FC<AdvisorFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isEditMode = false,
}) => {
  const [formValues, setFormValues] =
    useState<AdvisorFormValues>(initialValues);

  useEffect(() => {
    setFormValues(initialValues);
  }, [initialValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      {/* Modal Body */}
      <div className={styles.modalBody}>
        <div className={styles.pictureUpload}>
          {/* Profile Image */}
          <div className={styles.profileImage}>
            {formValues.avatar && (
              <Image
                src={formValues.avatar}
                alt="Profile Image"
                width={112}
                height={112}
              />
            )}
          </div>
          {/* Upload and Remove Buttons */}
          <Button
            variant="secondary"
            icon={
              <Image src="/upload.svg" alt="Add Icon" width={14} height={14} />
            }
            onClick={() => {}}
          >
            Upload Picture
          </Button>
          <Button variant="danger" onClick={() => {}}>
            Remove
          </Button>
        </div>
        {/* Form Fields */}
        <div className={styles.formContainer}>
          <FormInput
            label="Name"
            id="name"
            name="name"
            type="text"
            placeholder="Enter Name..."
            value={formValues.name}
            onChange={handleInputChange}
          />
          <FormInput
            label="ID Number"
            id="identification"
            name="identification"
            type="text"
            placeholder="Enter ID Number..."
            value={formValues.identification}
            onChange={handleInputChange}
          />
          <FormInput
            label="Income"
            id="income"
            name="income"
            type="number"
            placeholder="Enter Income..."
            value={formValues.income}
            onChange={handleInputChange}
          />
          <FormInput
            label="Company"
            id="company"
            name="company"
            type="text"
            placeholder="Enter Company..."
            value={formValues.company}
            onChange={handleInputChange}
          />
          <FormInput
            label="Education"
            id="education"
            name="education"
            type="text"
            placeholder="Enter Education..."
            value={formValues.education}
            onChange={handleInputChange}
          />
          <FormInput
            label="Title"
            id="degree"
            name="degree"
            type="text"
            placeholder="Enter Title..."
            value={formValues.degree}
            onChange={handleInputChange}
          />
          <FormInput
            label="Professional Level"
            id="level"
            name="level"
            type="text"
            placeholder="Enter Professional Level..."
            value={formValues.level}
            onChange={handleInputChange}
          />
          <FormInput
            label="Years of Experience"
            id="years"
            name="years"
            type="text"
            placeholder="Enter Years of Experience..."
            value={formValues.years}
            onChange={handleInputChange}
          />
          <FormInput
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter Email..."
            value={formValues.email}
            onChange={handleInputChange}
          />
          <FormInput
            label="Phone"
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter Phone..."
            value={formValues.phone}
            onChange={handleInputChange}
          />
          <FormInput
            label="Address"
            id="address"
            name="address"
            type="text"
            placeholder="Enter Address..."
            value={formValues.address}
            onChange={handleInputChange}
          />
        </div>
      </div>
      {/* Modal Footer */}
      <div className={styles.modalFooter}>
        <Button variant="inline" onClick={onCancel}>
          {isEditMode ? "Cancel" : "Go Back"}
        </Button>
        <Button type="submit">
          {isEditMode ? "Save Changes" : "Add Advisor"}
        </Button>
      </div>
    </form>
  );
};

export default AdvisorForm;
