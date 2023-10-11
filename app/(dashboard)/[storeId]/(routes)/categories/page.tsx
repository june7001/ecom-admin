"use client";
import CategoryCreator from '@/components/CategoryCreator';
import { useParams } from "next/navigation";

const Categories = () => {
    const params = useParams();
    const storeId = params.storeId;

  return (
    <>
        <CategoryCreator storeId={`${storeId}`}/>
    </>
    
  );
};

export default Categories;
