import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import { useLatestProductsQuery } from "../redux/api/productAPI"
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { cartItems } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";

const Home = () => {

  const dispatch = useDispatch();

  const { data, isLoading, isError } = useLatestProductsQuery("");
  const addToCardHandler = (cartItem: cartItems) => {
    if (cartItem.stock < 1) {
      return toast.error("Out of stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Item Added To Cart");
  }

  if (isError) toast.error("Cannot fetch the data");

  return (
    <div className="home">
      <section className="homeSection">
        <h1 className="homeSectionDesc">Welcome to Gadets store</h1>
      </section>
      <div className="homeHeading">
        <h1>LATEST PRODUCTS</h1>
        <Link className="homeHeadingProduct" to="/search" >
          MORE
        </Link>

      </div>
      <div className="homeProducts">
        {
          isLoading ? <Skeleton width="80vw" />
            : data?.products.map((product) => (
              <ProductCard key={product._id} productId={product._id} photo={product.photo} name={product.name} price={product.price} stock={product.stock} handler={addToCardHandler} />
            ))
        }
      </div>

    </div>
  )
}

export default Home;
