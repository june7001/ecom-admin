"use client";
import CategoryCreator from "@/components/CategoryCreator";
import CategoryTable from "@/components/CategoryTable";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

type Category = {
  id: string;
  name: string;
  storeId: string;
  createdAt: string;
};

const Categories = () => {

  const params = useParams();
  const storeId = params.storeId;
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `/api/stores/${storeId}/category?storeId=${storeId}`
      );
      const data: Category[] = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <CategoryCreator storeId={`${storeId}`} refreshCategories={fetchData} />
      <CategoryTable storeId={`${storeId}`} categories={categories} />
    </>
  );
};

export default Categories;
