
export type User={
    name: string;
    email: string;
    photo: string;
    gender: string;
    _id: string;
    dob: string;
    role: string;
}
 
export type Product = {
    name: string;
    price: number;
    stock: number;
    category: string;
    photo: string;
    _id: string;
}

export type shippingInfo = {
    address: string;
    pincode: string;
    state: string;
    city: string;
    country: string;
}

export type cartItems = {
    name: string;
    price: number;
    photo: string;
    productId: string;
    quantity: number;
    stock: number;
}

export type orderItem = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
    _id: string;
}

export type order = {
    shippingInfo: shippingInfo;
    user: {
        name: string;
        _id: string;
    };
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: orderItem[];
    _id: string;
    status: string;
}

export type deleteUser = {
    user_Id: string,
    admin_Id: string,
}

type revenues = {
    revenue: number,
    product: number,
    user: number,
    order: number,
}

type LatestTransaction = {
    _id: string;
    amount: number;
    discount: number;
    quantity: number;
    status: string;
  };

export type Stats = {
    releationOfCategories: Record<string,number>[],
    precent: revenues,
    count: revenues,
    chart: {
        order: number[],
        revenue: number[],
    },
    genderRatio: {
        male: number,
        female: number,
        others: number,
    },
    latesttransactions: LatestTransaction[],
}

type Distribution = {
    netMargin: number;
    discount: number;
    productionCost: number;
    burnt: number;
    marketingCost: number;
}

export type Charts = {
    releationOfCategories: Record<string,number>[],
    orderFullfillment: {
        processing: number,
        shipped: number,
        delivered: number,
    },
    revenueDistribution: Distribution,
    stockAvailability: {
        inStock: number,
        outofStock: number,
    }
    usersAgeGroup: {
        teen: number,
        adult: number,
        old: number,
    },
    adminCustomer:{
        admin: number,
        customers: number,
    }
}

export type BarChart = {
    products: number[],
    orders: number[],
    users: number[]
}

export type LineChart = {
    products: number[],
    users: number[],
    discount: number[]
    revenue: number[]
}