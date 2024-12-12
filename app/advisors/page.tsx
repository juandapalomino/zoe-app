"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { noto } from "../ui/fonts";

export default function Advisors() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const income = Number(searchParams.get("income"));

  const [advisorsList, setAdvisorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const formatCurrency = (amount) => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  useEffect(() => {
    const advisors = fetch("http://localhost:3001/advisor").then((response) =>
      response.json().then((obj) => {
        const filteredList = obj.filter((advisor) => {
          const minValue = income - 10000;
          const maxValue = income + 10000;
          const advisorIncome = advisor.income;
          return (
            advisorIncome &&
            minValue < advisorIncome &&
            advisorIncome < maxValue
          );
        });
        setIsLoading(false);
        setAdvisorList(filteredList);
      })
    );
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const openAdvisorDetails = (id) => {
    router.push(`/advisors/${id}`);
  };

  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.fixedWidth}>
          <Link href="/">
            <Image src="/zoe-logo.svg" alt="Zoe Logo" width={85} height={36} />
          </Link>
        </div>
      </nav>
      <div className={styles.fixedWidth}>
        <div className={styles.header}>
          <h1 className={`${noto.className} ${styles.title}`}>Advisors</h1>
          <button className={styles.addAdvisorButton}>
            <Image src="/plus.svg" alt="Add Icon" width={14} height={14} />
            Add New Advisor
          </button>
        </div>
        <div className={styles.mainGrid}></div>
      </div>

      <div className={styles.fixedWidth}>
        {!isLoading && advisorsList.length > 0 && income >= 10000 && (
          <div className={styles.tableCard}>
            <div className={styles.tableTopBar}>
              <div>
                <h3>{`${advisorsList.length} Advisor${
                  advisorsList.length ? "s" : ""
                } Found`}</h3>
                <span className={styles.subtitle}>
                  Showing advisors with income between{" "}
                  {formatCurrency(income - 10000)} and{" "}
                  {formatCurrency(income + 10000)}
                </span>
              </div>
              <div className={styles.customInput}>
                <input
                  className={styles.input}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                ></input>
                {/* <Image
              className={styles.inputIcon}
              src="/currency.svg"
              alt="Currency Icon"
              width={11}
              height={18}
            /> */}
              </div>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Income</th>
                  </tr>
                </thead>
                <tbody>
                  {advisorsList.map((advisor) => {
                    return (
                      <tr className={styles.tableRow} key={advisor.id}>
                        <td>
                          {advisor.name}
                          <button
                            onClick={() => openAdvisorDetails(advisor.id)}
                          >
                            See Advisor Details
                          </button>
                        </td>
                        <td>{formatCurrency(advisor.income)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <br></br>
          </div>
        )}

        {isLoading && income >= 10000 && (
          <div className={styles.loaderContainer}>
            <div className="lds-dual-ring"></div>
          </div>
        )}

        {advisorsList.length === 0 && !isLoading && income >= 10000 && (
          <p className={styles.errorMessage}>
            No available Advisors based on the provided income. Please try a
            different income value.
          </p>
        )}

        {income < 10000 && (
          <p className={styles.errorMessage}>
            The minimum income for the query is 10000. Please try a higher
            income value.
          </p>
        )}

        {!income && (
          <p className={styles.errorMessage}>
            You are searching for an invalid income. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
