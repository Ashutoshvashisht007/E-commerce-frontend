import { FaTrash } from "react-icons/fa";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { backend } from "../../../redux/store";
import { order, orderItem } from "../../../types/types";
import { useDeleteOrderMutation, useProcessOrderMutation, useSingleOrderQuery } from "../../../redux/api/orderAPI";
import { responseToast } from "../../../types/utils/Featurs";

const defaultData: order = {
  shippingInfo: {
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  status: "",
  subtotal: 0,
  discount: 0,
  shippingCharges: 0,
  tax: 0,
  total: 0,
  orderItems: [],
  user: { name: "", _id: "" },
  _id: "",
};

const TransactionManagement = () => {

  // const {user} = useSelector((state: {userReducer: userReducerInitialState})=> state.userReducer);
  const param = useParams();
  const navigate = useNavigate();

  const { data, isError } = useSingleOrderQuery(param.id!);

  if (isError) {
    return <Navigate to={"/404"} />
  }

  const {
    shippingInfo: { address, city, state, country, pincode },
    orderItems,
    user,
    status,
    tax,
    subtotal,
    total,
    discount,
    shippingCharges,
  } = data?.order || defaultData;

  const [updateOrder] = useProcessOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const updateHandler = async () => {
    const res = await updateOrder({
      order_id: param?.id!,
      user_id: user?._id!,
    });

    responseToast(res,navigate,"/admin/transaction");
  };

  const deleteHandler = async () => {
    const res = await deleteOrder({
      order_id: param?.id!,
      user_id: user?._id!,
    });

    responseToast(res,navigate,"/admin/transaction");
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>
          {orderItems.map((i) => (
                <ProductCard
                  key={i._id}
                  name={i.name}
                  photo={`${backend}/${i.photo}`}
                  productId={i.productId}
                  _id={i._id}
                  quantity={i.quantity}
                  price={i.price}
                />
              ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {user.name}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pincode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                    ? "green"
                    : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: orderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ${price} X {quantity} = ${price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
