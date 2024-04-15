import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Spinner from "./Spinner";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [category, setCategory] = useState(existingCategory || ""); //to store product's category (one) , type :ID of category.
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );

  const [categories, setCategories] = useState([]); //to strore fetched all categories from api
  const [isuploading, setIsuploading] = useState(false);
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  // console.log({_id})

  useEffect(() => {
    axios.get("/api/categories").then((res) => {
      setCategories(res.data);
    });
  }, []);

  async function saveProduct(e) {
    e.preventDefault();

    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      // update product
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create new product
      await axios.post("/api/products", data);
    }

    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(e) {
    // console.log(e.target.files)
    const files = e.target?.files;
    if (files?.length > 0) {
      setIsuploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }

      const res = await axios.post("/api/upload", data);

      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsuploading(false);
      // console.log("images:",images)
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function changeProductProps(propName, val) {
    //prop = properties
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = val;
      return newProductProps;
    });
    // console.log(productProperties);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    // console.log({catInfo})
    propertiesToFill.push(...catInfo?.properties);
    while (catInfo?.parent?._id) {
      const parentCatInfo = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCatInfo.properties);
      catInfo = parentCatInfo;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>Category</label>
      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
          <div key={p.name}>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(e) => changeProductProps(p.name, e.target.value)}
              >
                {p.values.map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
        ))}

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          list={images}
          setList={updateImagesOrder}
          className="mb-2 flex flex-wrap gap-2"
        >
          {images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 w-24 bg-white shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isuploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="flex flex-col text-center items-center justify-center w-24 h-24 text-sm gap-1 text-primary rounded-lg bg-gray-200 cursor-pointer shadow-md border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-upload"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>Price </label>
      <input
        type="text"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button type="submit" className="btn-primary">
        {_id ? "Edit" : "Add"}
      </button>
    </form>
  );
}
