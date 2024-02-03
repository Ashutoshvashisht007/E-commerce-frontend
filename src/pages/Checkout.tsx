import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { newOrderRequest } from "../types/api_types";
import { useDispatch, useSelector } from "react-redux";
import { cartReducerInitialState, userReducerInitialState } from "../types/reducer_types";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { responseToast } from "../types/utils/Featurs";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {user} = useSelector((state: {userReducer: userReducerInitialState}) => state.userReducer);

    const {
        shippingCharges,
        shippingInfo,
        tax,
        discount,
        total,
        cartItems,
        subtotal
    } = useSelector((state: {cartReducer: cartReducerInitialState})=> state.cartReducer);

    const [isProcessing,setIsProcessing] = useState<boolean>(false);

    const [newOrder] = useNewOrderMutation();

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!stripe || !elements)
        {
            return;
        }

        setIsProcessing(true);

        const order: newOrderRequest = {
            shippingInfo,
            shippingCharges,
            tax,
            total,
            orderItems: cartItems,
            subtotal,
            discount,
            user: user?._id!,
        };

        const {paymentIntent, error} = await stripe.confirmPayment({
            elements, 
            confirmParams:{
                return_url: window.location.origin
            },
            redirect: "if_required",
        });

        if(error)
        {
            setIsProcessing(false);
            return toast.error(error.message || "Something Went Wrong");
        }

        if(paymentIntent.status === "succeeded")
        {
            const res = await newOrder(order);
            dispatch(resetCart());
            responseToast(res,navigate,"/orders");
        }
        setIsProcessing(false);
    };

    return <div className="checkout-container">
        <form onSubmit={submitHandler}>
            <PaymentElement/>
            <button type="submit" disabled={isProcessing}>
                {
                    isProcessing === true ? "Processing..." : "Pay"
                }
            </button>
        </form>
    </div>;
}

const Checkout = () => {

    const location = useLocation();

    const clientSecret: string | undefined = location.state;

    if(!clientSecret){
        return <Navigate to={"/shipping"} />
    }

  return (
    <Elements options={{clientSecret}} stripe={stripePromise}>
        <CheckOutForm/>
    </Elements>
  )
}

export default Checkout;