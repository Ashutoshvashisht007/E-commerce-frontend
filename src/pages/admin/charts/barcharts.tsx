import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { BarChart } from "../../../components/admin/Charts";
import { useDashboardBarQuery } from "../../../redux/api/dashboardAPI";
import { userReducerInitialState } from "../../../types/reducer_types";
import { Skeleton } from "../../../components/Loader";
import { customError } from "../../../types/api_types";
import toast from "react-hot-toast";
import { getLastMonths } from "../../../types/utils/Featurs";

const {last12Months, last6Months} = getLastMonths();

const Barcharts = () => {

  const { user } = useSelector((state: { userReducer: userReducerInitialState }) => state.userReducer);

  const { data, isLoading, error, isError } = useDashboardBarQuery(user?._id!);

  if(isError)
  {
    const err = error as customError;
    toast.error(err.data.message);
  }

  const charts = data?.charts;

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="chart-container">
        {
          isLoading ? <Skeleton /> : <>
            <h1>Bar Charts</h1>
            <section>
              <BarChart
                data_2={charts?.products!}
                data_1={charts?.users!}
                labels={last6Months}
                title_1="Products"
                title_2="Users"
                bgColor_1={`hsl(260, 50%, 30%)`}
                bgColor_2={`hsl(360, 90%, 90%)`}
              />
              <h2>Top Products & Top Customers</h2>
            </section>

            <section>
              <BarChart
                horizontal={true}
                data_1={charts?.orders!}
                data_2={[]}
                title_1="Orders"
                title_2=""
                bgColor_1={`hsl(180, 40%, 50%)`}
                bgColor_2=""
                labels={last12Months}
              />
              <h2>Orders throughout the year</h2>
            </section>
          </>
        }

      </main>
    </div>
  );
};

export default Barcharts;
