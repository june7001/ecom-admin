import { FormEvent, useState } from "react";
import { type Product } from "@/types";

// This component is a form that allows you to create a product
// it collects the data and sends it to the server
export default function ProductCreator() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  function handleSubmit(reactSubmitEvent: FormEvent<HTMLFormElement>) {
    const e = reactSubmitEvent.nativeEvent;
    e.preventDefault();

    const product = {
      name,
      description,
      price,
      imageUrl,
    };

    addProduct(product);
  }

  async function addProduct(product: Product) {
    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Something went wrong while adding the product", response);
    }

    // yay
  }

  function updateName(reactEvent: FormEvent<HTMLInputElement>) {
    const nameInputElement = reactEvent.target as HTMLInputElement;
    setName(nameInputElement.value);
  }

  function updateDescription(reactEvent: FormEvent<HTMLInputElement>) {
    const descriptionInputElement = reactEvent.target as HTMLInputElement;
    setDescription(descriptionInputElement.value);
  }

  function updatePrice(reactEvent: FormEvent<HTMLInputElement>) {
    const priceInputElement = reactEvent.target as HTMLInputElement;
    setPrice(priceInputElement.value);
  }

  function updateImageUrl(reactEvent: FormEvent<HTMLInputElement>) {
    const imageUrlInputElement = reactEvent.target as HTMLInputElement;
    setImageUrl(imageUrlInputElement.value);
  }

  return (
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <input onInput={updateName} name="name" type="text" placeholder="Name" />
      <input
        onInput={updateDescription}
        name="description"
        type="text"
        placeholder="Description"
      />
      <input
        onInput={updatePrice}
        name="price"
        type="text"
        placeholder="Price"
      />
      <input
        onInput={updateImageUrl}
        name="imageUrl"
        type="text"
        placeholder="Image URL"
      />
      <button type="submit">Add Product</button>
    </form>
  );
}
