"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.css";
import { noto } from "../../ui/fonts";
import { Advisor, AdvisorFormValues } from "../../types/advisor";
import AdvisorForm from "../../shared/AdvisorForm";

import {
  getAdvisor,
  updateAdvisor,
  deleteAdvisorById,
} from "../../services/advisorService";
import { formatCurrency } from "../../utils/format";

import Button from "../../shared/Button";
import Modal from "../../shared/Modal";

const AdvisorDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [advisor, setAdvisor] = useState<Advisor | null>(null);
  const [formValues, setFormValues] = useState<AdvisorFormValues>({
    name: "",
    identification: "",
    income: "",
    company: "",
    education: "",
    degree: "",
    level: "",
    years: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [notificationMessage, setNotificationMessage] = useState("");

  useEffect(() => {
    const fetchAdvisorData = async () => {
      try {
        const data = await getAdvisor(id);
        setAdvisor(data);
        setFormValues({
          name: data.name,
          identification: data.identification,
          income: data.income.toString(),
          company: data.company,
          education: data.education,
          degree: data.degree,
          level: data.level,
          years: data.years,
          email: data.email,
          phone: data.phone,
          address: data.address,
        });
      } catch (error) {
        console.error("Error fetching advisor:", error);
      }
    };
    fetchAdvisorData();
  }, [id]);

  const handleUpdateAdvisor = async (values: AdvisorFormValues) => {
    if (!advisor) return;

    const updatedAdvisor: Advisor = {
      ...advisor,
      ...values,
      income: Number(values.income),
    };

    try {
      await updateAdvisor(updatedAdvisor);
      setAdvisor(updatedAdvisor);
      setNotificationMessage("Advisor updated successfully!");
      setTimeout(() => setNotificationMessage(""), 2000);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating advisor:", error);
      setNotificationMessage("Failed to update advisor");
      setTimeout(() => setNotificationMessage(""), 2000);
    }
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    console.log("SUBMID");
    e.preventDefault();
    const updatedAdvisor: Advisor = {
      ...advisor,
      ...formValues,
      income: Number(formValues.income),
    };

    try {
      await updateAdvisor(updatedAdvisor);
      setAdvisor(updatedAdvisor);
      setNotificationMessage("Advisor updated successfully!");
      setTimeout(() => setNotificationMessage(""), 2000);
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating advisor:", error);
      setNotificationMessage("Failed to update advisor");
      setTimeout(() => setNotificationMessage(""), 2000);
    }
  };

  const handleDeleteAdvisor = async () => {
    if (!advisor) return;
    if (confirm("Are you sure you want to delete this advisor?")) {
      try {
        await deleteAdvisorById(advisor.id);
        router.back();
      } catch (error) {
        console.error("Error deleting advisor:", error);
      }
    }
  };

  return (
    <>
      <div className={styles.page}>
        {/* Navbar */}
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
        {/* Advisor Details */}
        {advisor && (
          <div className={styles.fixedWidth}>
            <div className={styles.advisorCard}>
              {/* Top Section */}
              <div className={styles.topSection}>
                {/* Profile Image */}
                <div className={styles.profileImage}>
                  <Image
                    src={advisor.avatar}
                    alt="Profile Image"
                    width={112}
                    height={112}
                  />
                </div>
                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                  {notificationMessage && (
                    <div className={styles.notificationMessage}>
                      {notificationMessage}
                    </div>
                  )}
                  <Button variant="inline" onClick={() => router.back()}>
                    Back
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAdvisor}
                    icon={
                      <Image
                        src="/trash.svg"
                        alt="Delete Icon"
                        width={14}
                        height={14}
                      />
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setEditModalOpen(true)}
                    icon={
                      <Image
                        src="/edit.svg"
                        alt="Edit Icon"
                        width={14}
                        height={14}
                      />
                    }
                  >
                    Edit Advisor
                  </Button>
                </div>
              </div>
              {/* Header Section */}
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
              {/* Information Section */}
              <div className={styles.infoSection}>
                {/* You can extract these rows into their own component if desired */}
                <div className={styles.infoRow}>
                  <p>ID Number</p>
                  <span>{advisor.identification}</span>
                </div>
                <div className={styles.infoRow}>
                  <p>Income</p>
                  <span>{formatCurrency(advisor.income)}</span>
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
      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
        }}
        title="Edit Advisor Information"
      >
        <AdvisorForm
          initialValues={{
            ...formValues,
            avatar: advisor ? advisor.avatar : "",
          }}
          onSubmit={handleUpdateAdvisor}
          onCancel={(e) => {
            e.preventDefault();
            setEditModalOpen(false);
          }}
          isEditMode={true}
        />
      </Modal>
    </>
  );
};

export default AdvisorDetailsPage;
