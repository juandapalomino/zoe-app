import { useState } from "react";
import Image from "next/image";
import styles from "./Header.module.css";

type Props = {};

const sortableTableHeader = ({ title, sortState, onSort }) => {
  const toggleSort = () => {
    const nextState =
      sortState === "asc" ? "desc" : sortState === "desc" ? null : "asc";
    onSort(nextState);
  };

  const getIcon = () => {
    if (sortState === "asc") return "/sortAsc.svg";
    if (sortState === "desc") return "./sortDesc.svg";
    return "/sortUnset.svg";
  };

  return (
    <div className={styles.header} onClick={toggleSort}>
      <span>{title}</span>
      <Image src={getIcon()} alt="Sort Icon" width={14} height={14} />
    </div>
  );
};

export default sortableTableHeader;
