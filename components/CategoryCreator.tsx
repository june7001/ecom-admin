"use client";
import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from "next/navigation";

const CategoryCreator = () => {
  const [categoryName, setCategoryName] = useState("");
  const params = useParams();
  const storeId = params.storeId;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        console.log(storeId)
      const response = await axios.post(`/api/stores/${storeId}/category`, { 
        name: categoryName,
        storeId,
        // billboardId
      });
      console.log("Category created:", response.data);
      setCategoryName("");
    } catch (error) {
      console.log("Error creating category:", error);
    }
  };

  return (
    <Form.Root onSubmit={handleSubmit} className="w-[260px]">
      <Form.Field className="grid mb-[10px]" name="categoryName">
        <div className="flex items-baseline justify-between">
          <Form.Label className="text-[15px] font-medium leading-[35px] text-black">Create a category</Form.Label>
        </div>
        <Form.Control asChild>
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="box-border w-full bg-blackA2 shadow-blackA6 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA6"
            type="text"
            placeholder="Category name"
            required
          />
        </Form.Control>
      </Form.Field>
      <Form.Submit asChild>
        <button className="box-border w-full text-black inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
          Create Category
        </button>
      </Form.Submit>
    </Form.Root>
  );
};

export default CategoryCreator;
