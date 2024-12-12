"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [income, setIncome] = useState("");

  const router = useRouter();
  const handleInputChange = (e) => {
    setIncome(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Handle submit", income);
    router.push(`/advisors?income=${income}`);
  };

  return (
    <div className={styles.page}>
      <Image src="/zoe-logo.svg" alt="Zoe Logo" width={133} height={58} />
      <div className={styles.advisorsIcon}>
        <Image
          src="/image-portrait.svg"
          alt="Portrait Icon"
          width={40}
          height={40}
        />
      </div>
      <h2 className={styles.title}>Find Your Company Advisors!</h2>
      <p className={styles.subtitle}>Search by income to find your advisors</p>
      <form className={styles.searchAdvisorForm} onSubmit={handleSubmit}>
        <label className={styles.inputLabel} htmlFor="income">
          Current Income
        </label>
        <div className={styles.customInput}>
          <Image
            className={styles.inputIcon}
            src="/currency.svg"
            alt="Currency Icon"
            width={11}
            height={18}
          />
          <input
            className={styles.input}
            id="income"
            type="number"
            min="10000"
            value={income}
            onChange={handleInputChange}
            placeholder="Enter current income..."
          ></input>
        </div>
        <button className={styles.submitButton} type="submit">
          Search Now
          <Image
            src="/find-icon.svg"
            alt="Portrait Icon"
            width={14}
            height={14}
          />
        </button>
      </form>
    </div>
  );
}
