import { useMemo } from "react";
import { useAppContext } from "../context/AppContext";

export function useFilteredTransactions() {
  const { transactions, filters, sort } = useAppContext();

  const filtered = useMemo(() => {
    let result = [...transactions];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.description.toLowerCase().includes(q) ||
          tx.category.toLowerCase().includes(q),
      );
    }

    if (filters.type !== "all") {
      result = result.filter((tx) => tx.type === filters.type);
    }

    if (filters.category !== "all") {
      result = result.filter((tx) => tx.category === filters.category);
    }

    result.sort((a, b) => {
      let valA = a[sort.field];
      let valB = b[sort.field];

      if (sort.field === "date") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (sort.field === "amount") {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return sort.dir === "asc" ? -1 : 1;
      if (valA > valB) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filters, sort]);

  const allCategories = useMemo(() => {
    return ["all", ...new Set(transactions.map((tx) => tx.category))];
  }, [transactions]);

  return { filtered, allCategories };
}
