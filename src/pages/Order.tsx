import { ReactElement, useEffect, useState } from "react";
import TableHOC from "../components/admin/TableHOC"
import { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { userReducerInitialState } from "../types/reducer_types";
import { useAllOrdersQuery, useMyOrdersQuery } from "../redux/api/orderAPI";
import { customError } from "../types/api_types";
import toast from "react-hot-toast";

type DataType = {
    _id: string,
    quantity: number,
    amount: number,
    discount: number,
    status: ReactElement,
    action: ReactElement,
};

const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id"
    },
    {
        Header: "Quantity",
        accessor: "quantity"
    },
    {
        Header: "Discount",
        accessor: "discount"
    },
    {
        Header: "Amount",
        accessor: "amount"
    },
    {
        Header: "Status",
        accessor: "status"
    },
    {
        Header: "Action",
        accessor: "action"
    },
]

const Order = () => {

    const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);

    const { isLoading, data, isError, error } = useMyOrdersQuery(user?._id!);


    if (isError) {
        const err = error as customError;
        toast.error(err.data.message);
    }

    const [rows, setRows] = useState<DataType[]>([])

    useEffect(() => {
        if (data) {
            setRows(
                data.orders.map((idx) => ({

                    _id: idx._id,
                    amount: idx.total,
                    discount: idx.discount,
                    quantity: idx.orderItems.length,
                    status: <span className={
                        idx.status === "Processing" ? "red" : idx.status === "Shipped" ? "green" : "purple"
                    }>{idx.status}</span>,
                    action: <Link to={`/admin/transaction/${idx._id}`}>Manage</Link>
                }))
            );
        }
    }, [data])

    const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();

    return (
        <div className="orders">
            <h1>MY ORDERS</h1>

            <div className="ordersTable">
                <h3>Orders</h3>
                {
                    Table
                }
            </div>

        </div>
    )
}

export default Order