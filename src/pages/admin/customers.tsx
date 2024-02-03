import { ReactElement, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllUsersQuery, useDeleteUserMutation } from "../../redux/api/userAPI";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../../types/reducer_types";
import { customError } from "../../types/api_types";
import toast from "react-hot-toast";
import { responseToast } from "../../types/utils/Featurs";
import { useNavigate } from "react-router-dom";

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  role: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {

  const {user} = useSelector((state: {userReducer: userReducerInitialState}) => state.userReducer);

  const [deleteUser] = useDeleteUserMutation();
  const navigate = useNavigate();

  const {data, isError, error, isLoading} = useAllUsersQuery(user?._id!);
  
  if(isError)
  {
    const err = error as customError;
    toast.error(err.data.message);
  }

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(()=>{
    if(data)
    {
      setRows(data.users.map((idx) => ({
        avatar: (
          <img style={{ borderRadius: "50%",}} src={idx.photo} alt={idx.name} />
          ),
          email: idx.email,
          name: idx.name,
          gender: idx.gender,
          role: idx.role,
          action: (
            <button onClick={async ()=> {
              const res = await deleteUser({
                user_Id: idx._id,
                admin_Id: user?._id!,
              });
              responseToast(res,navigate,`/admin/customer`);
            }}>
              <FaTrash />
            </button>
          )
      })));
    }
  },[data])

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Customers",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{Table}</main>
    </div>
  );
};

export default Customers;
