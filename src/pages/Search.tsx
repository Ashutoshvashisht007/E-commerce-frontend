import { useState } from "react"
import ProductCard from "../components/ProductCard";
import { useAllCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { customError } from "../types/api_types";
import { Skeleton } from "../components/Loader";
import { cartItems } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Search = () => {

  const dispatch = useDispatch();

  const { data: categoriesResponse, isLoading, isError, error } = useAllCategoriesQuery("");

  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [price, setPrice] = useState(100000);
  const [page, setPage] = useState(1);

  const { isLoading: productLoading, data: searchedData, isError: productisError, error: productError } = useSearchProductsQuery({
    search,
    category,
    price,
    page,
    sort: value
  });

  const isNextPage = page < 4;
  const isPrevPage = page > 1;

  if (isError) {
    const err = error as customError;
    toast.error(err.data.message);
  }

  if (productisError) {
    const err = productError as customError;
    toast.error(err.data.message);
  }

  const addToCardHandler = (cartItem: cartItems) => {
    if(cartItem.stock < 1)
    {
      return toast.error("Out of stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  }

  return (
    <div className="search">
      <aside className="searchLeftContainer">
        <h2>FILTERS</h2>
        <div>
          <label>Sort</label>
          <select value={value} onChange={(e) => setValue(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <label>Max Price: {price || ""}</label>
          <input
            type="range"
            min={100}
            max={100000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All</option>
            {
              isLoading === false && categoriesResponse?.categories.map((category) => (
                <option key={category} value={category}>{category.toUpperCase()}</option>
              ))
            }
          </select>
        </div>
      </aside>
      <main className="searchRightContainer">
        <h1>PRODUCTS</h1>
        <input type="text" name="name" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name" />
        <div className="searchRightProductContainer">
          {
            productLoading ? <Skeleton /> :
            searchedData?.products.map((product) =>
              <ProductCard key={product._id} productId={product._id} photo={product.photo} name={product.name} price={product.price} stock={product.stock} handler={addToCardHandler} />
            )

          }
        </div>

        {
          searchedData && searchedData.totalPage > 1 && <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage(prev => prev - 1)}>
              Prev
            </button>
            <span>{page} of {searchedData.totalPage}</span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage(prev => prev + 1)}>
              Next
            </button>
          </article>
        }
      </main>
    </div>
  )
}

export default Search