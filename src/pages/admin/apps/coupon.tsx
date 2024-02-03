import { FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../../types/reducer_types";
import { useNewCouponMutation } from "../../../redux/api/couponAPI";
import { responseToast } from "../../../types/utils/Featurs";
import { useNavigate } from "react-router-dom";

const Coupon = () => {

  const navigate = useNavigate();

  const {user} = useSelector((state: {userReducer: userReducerInitialState}) => state.userReducer);

  const [newCouponn] = useNewCouponMutation();

  const [size, setSize] = useState<number>(0);
  const [coupon, setCoupon] = useState<string>("");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      coupon,
      amount: size,
    }
    const res = await newCouponn({
      id: user?._id!,
      data,
    });
    responseToast(res,navigate,"/admin/app/coupon")

  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Coupon</h1>
        <section>
          <form className="coupon-form" onSubmit={submitHandler}>
            <input
              type="text"
              placeholder="Text to include"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              maxLength={15}
            />

            <input
              type="number"
              placeholder="Coupon Length"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={8}
              max={1000}
            />
            <button type="submit">Generate</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Coupon;
