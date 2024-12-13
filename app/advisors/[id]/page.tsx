"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { noto } from "../../ui/fonts";

const AdvisorDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [advisor, setAdvisor] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Edit modal state
  const [name, setName] = useState("");
  const [identification, setIdentification] = useState("");
  const [income, setIncome] = useState("");
  const [company, setCompany] = useState("");
  const [education, setEducation] = useState("");
  const [degree, setDegree] = useState("");
  const [level, setLevel] = useState("");
  const [years, setYears] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [savedKey, setSavedKey] = useState(0);

  const [notificationMessage, setNotificationMessage] = useState("");

  const formatCurrency = (amount) => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const setAdvisorEditState = (data) => {
    setName(data.name);
    setIdentification(data.identification);
    setIncome(data.income);
    setCompany(data.company);
    setEducation(data.education);
    setDegree(data.degree);
    setLevel(data.level);
    setYears(data.years);
    setEmail(data.email);
    setPhone(data.phone);
  };

  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    const editedAdvisor = {
      ...advisor,
      name,
      identification,
      income: Number(income),
      company,
      education,
      degree,
      level,
      years,
      email,
      phone,
    };
    try {
      const response = await fetch(
        `http://localhost:3001/advisor/${advisor.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedAdvisor),
        }
      );

      if (response.ok) {
        setSavedKey((prev) => prev + 1);
        setEditModalOpen(false);
        setNotificationMessage("Advisor updated succesfully!");
        setTimeout(() => {
          setNotificationMessage("");
        }, 2000);
      } else {
        setNotificationMessage("Failed to update advisor");
        setTimeout(() => {
          setNotificationMessage("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating advisor:", error);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:3001/advisor/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setAdvisor(data);
        setAdvisorEditState(data);
      })
      .catch((error) => console.error("Error fetching advisor:", error));
  }, [savedKey]);

  const handleOverlayClick = (e) => {
    // if (e.target.classList.contains(styles.modalOverlay)) {
    //   setEditModalOpen(false);
    // }
  };

  const deleteAdvisor = (id) => {
    if (window.confirm("Are you sure you want to delete this advisor?")) {
      fetch(`http://localhost:3001/advisor/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete advisor");
          }
          console.log("Advisor deleted successfully");
          router.back();
        })
        .catch((error) => console.error("Error deleting advisor:", error));
    }
  };

  return (
    <>
      <div className={styles.page}>
        <nav className={styles.navbar}>
          <div className={styles.fixedWidth}>
            <Link href="/">
              <Image
                src="/zoe-logo.svg"
                alt="Zoe Logo"
                width={85}
                height={36}
              />
            </Link>
          </div>
        </nav>
        {advisor.id && (
          <div className={styles.fixedWidth}>
            <div className={styles.advisorCard}>
              <div className={styles.topSection}>
                <div className={styles.profileImage}>
                  <img
                    src={advisor.avatar}
                    alt="Profile Image"
                    width={112}
                    height={112}
                  />
                </div>
                <div className={styles.actionButtons}>
                  <div className={styles.notificationMessage}>
                    {notificationMessage}
                  </div>
                  <button
                    className={styles.backButton}
                    onClick={() => {
                      router.back();
                    }}
                  >
                    Back
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteAdvisor(advisor.id)}
                  >
                    <Image
                      src="/trash.svg"
                      alt="Delete Icon"
                      width={14}
                      height={14}
                    />
                    Delete
                  </button>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      setEditModalOpen(true);
                    }}
                  >
                    <Image
                      src="/edit.svg"
                      alt="Edit Icon"
                      width={14}
                      height={14}
                    />
                    Edit Advisor
                  </button>
                </div>
              </div>
              <div className={styles.headerSection}>
                <h1 className={`${noto.className} ${styles.title}`}>
                  {advisor.name}
                </h1>
                <div className={styles.subtitle}>{advisor.level}</div>
                <div className={styles.metaDetail}>
                  <Image
                    className={styles.metaDetailIcon}
                    src="/location.svg"
                    alt="Location Icon"
                    width={12}
                    height={16}
                  />
                  {advisor.address}
                </div>

                <div className={styles.metaDetail}>
                  <Image
                    className={styles.metaDetailIcon}
                    src="/job.svg"
                    alt="Job Icon"
                    width={12}
                    height={16}
                  />
                  {advisor.company}
                </div>
              </div>
              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <p>ID Number</p> <span>{advisor.identification}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Income</p> <span>{formatCurrency(advisor.income)}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Education</p> <span>{advisor.education}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Title</p> <span>{advisor.degree}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Years of Experience</p> <span>{advisor.years}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Email</p>{" "}
                  <span>
                    <a href={`mailto:${advisor.email}`}>{advisor.email}</a>
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <p>Phone</p>{" "}
                  <span>
                    <a href={`tel:${advisor.phone}`}>{advisor.phone}</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`${styles.modalOverlay} ${
          editModalOpen ? styles.isVisible : ""
        }`}
        onClick={handleOverlayClick}
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>Edit Advisor Information</div>
          <form onSubmit={handleEditFormSubmit}>
            <div className={styles.modalBody}>
              <div className={styles.pictureUpload}>
                <div className={styles.profileImage}>
                  {advisor.avatar && (
                    <Image
                      src={advisor.avatar}
                      alt="Profile Image"
                      width={112}
                      height={112}
                    />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={styles.uploadButton}
                >
                  <Image
                    src="/upload.svg"
                    alt="Add Icon"
                    width={14}
                    height={14}
                  />
                  Upload Picture
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
              <div className={styles.formContainer}>
                <div className={styles.formField}>
                  <label htmlFor="name">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter Name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="id-number">ID Number</label>
                  <input
                    id="id-number"
                    type="text"
                    placeholder="Enter ID Number..."
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="income">Income</label>
                  <input
                    id="income"
                    type="number"
                    placeholder="Enter Income..."
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="company">Company</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Enter Company..."
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="education">Education</label>
                  <input
                    id="education"
                    type="text"
                    placeholder="Enter Education..."
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="title">Title</label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter Title..."
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="level">Professional Level</label>
                  <input
                    id="level"
                    type="text"
                    placeholder="Enter Professional Level..."
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="years">Years of Experience</label>
                  <input
                    id="years"
                    type="text"
                    placeholder="Enter Years of Experience..."
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter Email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.formField}>
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="Enter Phone..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.backButton}
                onClick={() => setEditModalOpen(false)}
              >
                Go Back
              </button>
              <button type="submit" className={styles.saveButton}>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default AdvisorDetailsPage;
