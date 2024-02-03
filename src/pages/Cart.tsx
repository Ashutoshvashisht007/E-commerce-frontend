import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartReducerInitialState } from "../types/reducer_types";
import { cartItems } from "../types/types";
import toast from "react-hot-toast";
import { addToCart, applyDiscount, calculatePrice, removeFromCart } from "../redux/reducer/cartReducer";
import axios from "axios";
import { backend } from "../redux/store";

const Cart = () => {

  const dispatch = useDispatch();

  const { cartItems, subtotal, tax, total, shippingCharges, shippingInfo, discount } = useSelector((state: { cartReducer: cartReducerInitialState }) => state.cartReducer)

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const addToCartHandler = (cartItem: cartItems) => {
    if (cartItem.stock <= cartItem.quantity) {
      return toast.error("Out of stock");
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  }
  const subToCartHandler = (cartItem: cartItems) => {
    if (cartItem.quantity < 2) {
      return toast.error("Atlease One item required");
    }
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  }
  const removeHandler = (id: string) => {
    dispatch(removeFromCart(id));
    toast.success("Item Deleted Successfully");
  }

  useEffect(() => {

    const { token, cancel } = axios.CancelToken.source();

    const timeOutId = setTimeout(() => {

      axios.get(`${backend}/api/v1/payment/discount?coupon=${couponCode}`, { cancelToken: token }).then((res) => {
        dispatch(applyDiscount(res.data.discount));
        dispatch(calculatePrice());
        setIsValidCouponCode(true);
      })
        .catch(() => {
          dispatch(applyDiscount(0));
          dispatch(calculatePrice());
          setIsValidCouponCode(false);
        })
    }, 1000)

    return () => {
      clearTimeout(timeOutId);
      cancel();
      setIsValidCouponCode(false);
    }
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <div className="cart">
      <main className="cartLeftContainer">
        {

          cartItems.length > 0 ? (cartItems.map((product) =>
            <CartItem key={product.productId} cartItem={product} incrementhandler={addToCartHandler} decrementhandler={subToCartHandler} removehandler={removeHandler} />
          )) : <h1>No Items Added</h1>
        }
      </main>

      <aside className="cartRightContainer">
        <span>Subtotal: ${subtotal}</span>
        <span>Shipping Charges: ${shippingCharges}</span>
        <span>Tax Charges: ${tax}</span>
        <span>Discount: <em> - ${discount} </em></span>
        <span><b>Total: ${total}</b></span>

        <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />

        {
          couponCode &&
          (isValidCouponCode ?
            (
              <span className="green greenText">${discount} off using <code>{couponCode}</code></span>
            ) : (
              <span className="red redText">Invalid Coupon Code</span>
            ))
        }

        {
          cartItems.length > 0 && <Link to="/shipping">
            <button className="cartCouponBtn">Check Out</button>
          </Link>
        }
      </aside>

    </div>

  )
}

export default Cart