import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import toast from "react-hot-toast";
import { customError } from "../../../types/api_types";
import { useDeleteProductMutation, useProductDetailQuery, useUpdateProductDetailMutation } from "../../../redux/api/productAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer_types";
import { backend } from "../../../redux/store";
import { responseToast } from "../../../types/utils/Featurs";
const Productmanagement = () => {

  const {user} = useSelector((state : {userReducer: userReducerInitialState}) => state.userReducer);

  const params = useParams();

    const {data, isError, error} = useProductDetailQuery(params.id!)
    if(isError)
    {
      const err = error as customError;
      toast.error(err.data.message);
    }

  const {price,photo,category,name,stock} = data?.product || {
    photo: "",
    category: "",
    name: "",
    stock: 0,
    price: 0,
  };

  const navigate = useNavigate();

  const [updatedProduct] = useUpdateProductDetailMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [priceUpdate, setPriceUpdate] = useState<number>(price);
  const [stockUpdate, setStockUpdate] = useState<number>(stock);
  const [nameUpdate, setNameUpdate] = useState<string>(name);
  const [categoryUpdate, setCategoryUpdate] = useState<string>(category);
  const [photoUpdate, setPhotoUpdate] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File>();

  

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPhotoUpdate(reader.result);
          setPhotoFile(file);
        }
      };
    }
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if(nameUpdate) formData.set("name",nameUpdate);
    if(priceUpdate) formData.set("price",priceUpdate.toString());
    if(stockUpdate !== undefined) formData.set("stock",stockUpdate.toString());
    if(categoryUpdate) formData.set("category",categoryUpdate);
    if(photoFile) formData.set("photo",photoFile);

    const res = await updatedProduct({
      product_id: params.id!,
      user_id: user?._id!,
      formData,
    });

    responseToast(res,navigate,`/admin/product`);
  };

  const handleDelete = async () => {
    const res = await deleteProduct({
      product_id: params.id!,
      user_id: user?._id!,
    });
    responseToast(res,navigate,`/admin/product`);
  }

  useEffect(() => {
    if(data)
    {
      setCategoryUpdate(category);
      setNameUpdate(name);
      setStockUpdate(stock);
      setPriceUpdate(price);
    }
  }, [data])
  

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section>
          <strong>ID - {params.id!}</strong>
          <img src={`${backend}/${photo}`} alt="Product" />
          <p>{name}</p>
          {stock > 0 ? (
            <span className="green">{stock} Available</span>
          ) : (
            <span className="red"> Not Available</span>
          )}
          <h3>₹{price}</h3>
        </section>
        <article>
          <button onClick={handleDelete} className="product-delete-btn">
            <FaTrash />
          </button>
          <form onSubmit={submitHandler}>
            <h2>Manage</h2>
            <div>
              <label>Name</label>
              <input
                type="text"
                placeholder="Name"
                value={nameUpdate}
                onChange={(e) => setNameUpdate(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                type="number"
                placeholder="Price"
                value={priceUpdate}
                onChange={(e) => setPriceUpdate(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                type="number"
                placeholder="Stock"
                value={stockUpdate}
                onChange={(e) => setStockUpdate(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                type="text"
                placeholder="eg. laptop, camera etc"
                value={categoryUpdate}
                onChange={(e) => setCategoryUpdate(e.target.value)}
              />
            </div>

            <div>
              <label>Photo</label>
              <input type="file" onChange={changeImageHandler} />
            </div>

            {photoUpdate && <img src={photoUpdate} alt="New Image" />}
            <button type="submit">Update</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default Productmanagement;
