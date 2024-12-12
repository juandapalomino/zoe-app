"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { noto } from "../../ui/fonts";

const AdvisorDetailsPage = () => {
  const params = useParams();
  const { id } = params;
  const [advisor, setAdvisor] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/advisor/${id}`)
      .then((response) => response.json())
      .then((data) => setAdvisor(data))
      .catch((error) => console.error("Error fetching advisor:", error));
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      setEditModalOpen(false);
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
                  <Image
                    src={advisor.avatar}
                    alt="Profile Image"
                    width={112}
                    height={112}
                  />
                </div>
                <div className={styles.actionButtons}>
                  <button className={styles.deleteButton} onClick={() => {}}>
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
                <div className={styles.subtitle}>[Cert]</div>
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
                  [Job]
                </div>
              </div>
              <div className={styles.infoSection}>
                <div className={styles.infoRow}>
                  <p>ID Number</p> <span>ID: 987-345-32</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Income</p> <span>$250.000</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Education</p> <span>North University</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Title</p> <span>Financial Management</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Years of Experience</p> <span>10+</span>
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
              <button className={styles.uploadButton}>
                <Image
                  src="/upload.svg"
                  alt="Add Icon"
                  width={14}
                  height={14}
                />
                Upload Picture
              </button>
              <button className={styles.removeButton}>Remove</button>
            </div>
            <div className={styles.formContainer}>
              <div className={styles.formField}>
                <label htmlFor="first-name">First Name</label>
                <input
                  id="first-name"
                  type="text"
                  placeholder="Enter First Name..."
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="last-name">Last Name</label>
                <input
                  id="last-name"
                  type="text"
                  placeholder="Enter Last Name..."
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="id-number">ID Number</label>
                <input
                  id="id-number"
                  type="text"
                  placeholder="Enter ID Number..."
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="income">Income</label>
                <input id="income" type="text" placeholder="Enter Income..." />
              </div>
              <div className={styles.formField}>
                <label htmlFor="education">Education</label>
                <input
                  id="education"
                  type="text"
                  placeholder="Enter Education..."
                />
              </div>
              <div className={styles.formField}>
                <label htmlFor="title">Title</label>
                <input id="title" type="text" placeholder="Enter Title..." />
              </div>
              <div className={`${styles.formField} ${styles.fullSpanField}`}>
                <label htmlFor="experience">Years of Experience</label>
                <select id="experience">
                  <option>Years of Experience</option>
                  <option>+5</option>
                  <option>+10</option>
                  <option>+15</option>
                </select>
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
            <button className={styles.saveButton}>Save Changes</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default AdvisorDetailsPage;
