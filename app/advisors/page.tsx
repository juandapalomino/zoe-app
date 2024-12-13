"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import { noto } from "../ui/fonts";
import SortableTableHeader from "../shared/sortableTableHeader";
import Button from "../shared/Button";
import { Advisor, AdvisorFormValues } from "../types/advisor";
import Modal from "../shared/Modal";
import AdvisorForm from "../shared/AdvisorForm";

type SortOrder = "asc" | "desc" | null;
type SortBy = "name" | "income" | null;

export default function Advisors() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const income = Number(searchParams.get("income"));

  const [advisorsList, setAdvisorList] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sorting Logic
  const initialSortBy = searchParams.get("sortBy") as SortBy;
  const initialSortOrder = searchParams.get("sortOrder") as SortOrder;
  const [sortBy, setSortBy] = useState<SortBy>(initialSortBy || null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialSortOrder || null
  );
  const nameSortState = sortBy === "name" ? sortOrder : null;
  const incomeSortState = sortBy === "income" ? sortOrder : null;

  // Search logic
  const initialSearch = searchParams.get("searchQuery") || "";
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);

  // Pagination Logic
  const initialPage = parseInt(searchParams.get("page") || "1") || 1;
  const initialPerPage = parseInt(searchParams.get("limit") || "10") || 10;
  const [page, setPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialPerPage);

  // Modal state for adding a new advisor
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [newAdvisorFormValues, setNewAdvisorFormValues] =
    useState<AdvisorFormValues>({
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

  useEffect(() => {
    // Clone the current search params
    const params = new URLSearchParams(searchParams.toString());

    // Update page parameter
    params.set("page", page.toString());

    // Update searchQuery parameter
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

    params.set("limit", itemsPerPage.toString());

    // Update the URL without removing other parameters
    router.push(`?${params.toString()}`, { shallow: true });
  }, [page, sortBy, sortOrder, searchQuery, itemsPerPage]);

  const handleSort = (by: SortBy, order: SortOrder) => {
    setSortBy(order ? by : null);
    setSortOrder(order);
    setPage(1); // Reset to first page on sort change
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  };

  const sortAdvisors = (
    array: Advisor[],
    order: SortOrder,
    key: SortBy
  ): Advisor[] => {
    if (!order || !key) {
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

  let processedAdvisors: Advisor[] = [];

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

  useEffect(() => {
    fetch("http://localhost:3001/advisor")
      .then((response) => response.json())
      .then((data: Advisor[]) => {
        setIsLoading(false);
        setAdvisorList(data);
      });
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openAdvisorDetails = (id: string) => {
    router.push(`/advisors/${id}`);
  };

  // Function to add a new advisor
  const handleAddNewAdvisor = async (values: AdvisorFormValues) => {
    const newAdvisor: Advisor = {
      id: Date.now().toString(),
      ...values,
      income: Number(values.income),
      avatar: "https://randomuser.me/api/portraits/men/15.jpg",
    };

    try {
      const response = await fetch("http://localhost:3001/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdvisor),
      });

      if (!response.ok) {
        throw new Error("Failed to add new advisor");
      }

      setAdvisorList((prevList) => [...prevList, newAdvisor]);
      setNotificationMessage("New advisor added successfully!");
      setTimeout(() => setNotificationMessage(""), 2000);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Error adding new advisor:", error);
      setNotificationMessage("Failed to add new advisor");
      setTimeout(() => setNotificationMessage(""), 2000);
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
        {/* Header */}
        <div className={styles.fixedWidth}>
          <div className={styles.header}>
            <h1 className={`${noto.className} ${styles.title}`}>Advisors</h1>
            <div className={styles.buttonContainer}>
              {notificationMessage && (
                <div className={styles.notificationMessage}>
                  {notificationMessage}
                </div>
              )}
              <Button
                variant="primary"
                className={styles.addAdvisorButton}
                onClick={() => setAddModalOpen(true)}
              >
                <Image src="/plus.svg" alt="Add Icon" width={14} height={14} />
                Add New Advisor
              </Button>
            </div>
          </div>
          <div className={styles.mainGrid}></div>
        </div>

        {/* Main Content */}
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
                    alt="Clear Search"
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
                              type="button"
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
                <div className={styles.paginationInfo}>
                  {`${startPaginationIndex} - ${endPaginationIndex} of ${totalAdvisors} advisor${
                    totalAdvisors !== 1 ? "s" : ""
                  }`}
                </div>
                <div className={styles.pagesSelector}>
                  <Button
                    type="button"
                    variant="inline"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <Image
                      src="/pagination-left.svg"
                      alt="Previous Page"
                      width={12}
                      height={12}
                    />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i + 1}
                      type="button"
                      onClick={() => handlePageChange(i + 1)}
                      variant={page === i + 1 ? "primary" : "neutral"}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="inline"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    <Image
                      src="/pagination-right.svg"
                      alt="Next Page"
                      width={12}
                      height={12}
                    />
                  </Button>
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

      {/* Add New Advisor Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
        }}
        title="Add New Advisor"
      >
        <AdvisorForm
          initialValues={{
            ...newAdvisorFormValues,
            avatar: "https://randomuser.me/api/portraits/men/15.jpg", // Or allow user to set avatar
          }}
          onSubmit={handleAddNewAdvisor}
          onCancel={(e) => {
            e.preventDefault();
            setAddModalOpen(false);
          }}
          isEditMode={false}
        />
      </Modal>
    </>
  );
}
