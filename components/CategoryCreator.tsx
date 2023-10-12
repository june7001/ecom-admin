"use client";
import * as Form from '@radix-ui/react-form';
import { useState } from 'react';
import axios from 'axios';

interface StoreInfo {
  storeId: string;
  refreshCategories: () => void;
}

const CategoryCreator = ({ storeId, refreshCategories }: StoreInfo) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/stores/${storeId}/category`, {
        name: categoryName,
        storeId,
      });
      console.log("Category created:", response.data);
      setCategoryName("");
      refreshCategories();
    } catch (error) {
      console.log("Error creating category:", error);
    }
  };

  return (
    <div className="mx-auto max-w-screen-lg mt-4 mb-4">
      <h2 className="text-lg text-center mb-4 underline">My Categories</h2>
      <Form.Root onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-4">
          <Form.Field name="categoryName" className="flex-grow mr-2">
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
            <button
              className="box-border inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none border border-slate-600 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
            >
              Create Category
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>

  )
 };

export default CategoryCreator;
