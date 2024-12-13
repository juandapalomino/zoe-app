"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { noto } from "../ui/fonts";
import SortableTableHeader from "../shared/sortableTableHeader";

export default function Advisors() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const income = Number(searchParams.get("income"));

  const [advisorsList, setAdvisorList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sorting Logic
  const initialSortBy = searchParams.get("sortBy");
  const initialSortOrder = searchParams.get("sortOrder");
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const nameSortState = sortBy === "name" ? sortOrder : null;
  const incomeSortState = sortBy === "income" ? sortOrder : null;

  // Search logic
  const initialSearch = searchParams.get("searchQuery");
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");

  // Pagination Logic
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialPerPage = parseInt(searchParams.get("limit")) || 10;
  const [page, setPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialPerPage);

  useEffect(() => {
    // Clone the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update page parameter
    params.set("page", page);

    // Update page parameter
    if (searchQuery && searchQuery.length)
      params.set("searchQuery", searchQuery);
    else params.delete("searchQuery");

    // Update only the relevant parameters
    if (sortBy) params.set("sortBy", sortBy);
    else {
      params.delete("sortBy");
      params.delete("sortOrder");
    }

    if (sortOrder) params.set("sortOrder", sortOrder);
    else params.delete("sortOrder");

    params.set("limit", itemsPerPage);

    // Update the URL without removing other parameters
    router.push(`?${params.toString()}`, { shallow: true });
  }, [page, sortBy, sortOrder, searchQuery, itemsPerPage]);

  const goBackToMainPage = () => {};
  const handleSort = (by, order) => {
    setSortBy(!order ? null : by);
    setSortOrder(order);
    setPage(1); // Reset to first page on sort change
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
  };

  const formatCurrency = (amount) => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const sortAdvisors = (array, order, key) => {
    if (order === null) {
      return array;
    }

    return [...array].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA == null || valB == null) {
        return 0;
      }

      if (valA > valB) {
        return order === "asc" ? 1 : -1;
      } else if (valA < valB) {
        return order === "asc" ? -1 : 1;
      } else {
        return 0;
      }
    });
  };

  let processedAdvisors;

  // Filter
  processedAdvisors = advisorsList.filter((advisor) => {
    const minValue = income - 10000;
    const maxValue = income + 10000;
    const advisorIncome = advisor.income;
    return (
      advisorIncome && minValue < advisorIncome && advisorIncome < maxValue
    );
  });

  // Search filter
  const normalizedQuery = searchQuery.replace(/[.,]/g, "");
  const regex = new RegExp(normalizedQuery.split(" ").join("|"), "i");
  processedAdvisors = processedAdvisors.filter((advisor) => {
    const matchesName = regex.test(advisor.name);
    const matchesIncome = regex.test(advisor.income.toString());
    return matchesName || matchesIncome;
  });
  const advisorsFoundNumber = processedAdvisors.length;

  // Sort
  processedAdvisors = sortAdvisors(processedAdvisors, sortOrder, sortBy);

  // Pagination
  const totalPages = processedAdvisors.length
    ? Math.ceil(processedAdvisors.length / itemsPerPage)
    : 0;
  const totalAdvisors = processedAdvisors.length;

  processedAdvisors = processedAdvisors.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const startPaginationIndex = 1 + itemsPerPage * (page - 1);
  const endPaginationIndex =
    startPaginationIndex + processedAdvisors.length - 1;

  if (processedAdvisors.length === 0 && totalPages > 0) {
    setPage((prev) => prev - 1);
  }
  if (page < 1) {
    setPage((prev) => prev + 1);
  }

  // Data fetching
  useEffect(() => {
    const advisors = fetch("http://localhost:3001/advisor").then((response) =>
      response.json().then((obj) => {
        setIsLoading(false);
        setAdvisorList(obj);
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
          <div className={styles.buttonContainer}>
            <button className={styles.addAdvisorButton}>
              <Image src="/plus.svg" alt="Add Icon" width={14} height={14} />
              Add New Advisor
            </button>
          </div>
        </div>
        <div className={styles.mainGrid}></div>
      </div>

      <div className={styles.fixedWidth}>
        {!isLoading && advisorsList.length > 0 && income >= 10000 && (
          <div className={styles.tableCard}>
            <div className={styles.tableTopBar}>
              <div>
                <h3>{`${advisorsFoundNumber} Advisor${
                  advisorsFoundNumber !== 1 ? "s" : ""
                } Found`}</h3>
                <span className={styles.subtitle}>
                  {`Showing advisors with average income of ${formatCurrency(
                    income
                  )}. `}
                </span>
                <Link href="/">
                  <span className={styles.subtitleLink}>Change Income.</span>
                </Link>
              </div>
              <div className={styles.customInput}>
                <input
                  className={styles.input}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                />{" "}
                <Image
                  className={`${styles.searchCloseIcon} ${
                    searchQuery.length ? styles.isVisible : ""
                  }`}
                  onClick={() => setSearchQuery("")}
                  src="/close-icon.svg"
                  alt="Clean Search"
                  width={45}
                  height={45}
                />
              </div>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>
                      <SortableTableHeader
                        title="Advisor Name"
                        sortState={nameSortState}
                        onSort={(order) => handleSort("name", order)}
                      />
                    </th>
                    <th>
                      <SortableTableHeader
                        title="Income"
                        sortState={incomeSortState}
                        onSort={(order) => handleSort("income", order)}
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {processedAdvisors.map((advisor) => {
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

            <div className={styles.tablePaginationBar}>
              <div
                className={styles.paginationInfo}
              >{`${startPaginationIndex} - ${endPaginationIndex} of ${totalAdvisors} advisor${
                totalAdvisors !== 1 ? "s" : ""
              }`}</div>
              <div className={styles.pagesSelector}>
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                >
                  <Image
                    src="/pagination-left.svg"
                    alt="Previous Page"
                    width={12}
                    height={12}
                  />
                </button>
                {Array(totalPages)
                  .fill(null)
                  .map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={page === i + 1 ? styles.selected : ""}
                    >
                      {i + 1}
                    </button>
                  ))}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                >
                  <Image
                    src="/pagination-right.svg"
                    alt="Next Page"
                    width={12}
                    height={12}
                  />
                </button>
              </div>

              <div className={styles.paginationRightInfo}>
                <span>Show</span>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
                <span>advisors per page</span>
              </div>
            </div>
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
