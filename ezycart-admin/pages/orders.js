import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage(){

    const [orders,setOrders] = useState([]);
    useEffect(()=>{
        axios.get('/api/orders').then(res => {
            setOrders(res.data);
        })
    },[])

    return(
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Paid</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                { orders?.length > 0 && orders.map( order => (
                    <tr key={order._id}>
                        <td>{(new Date(order?.createdAt)).toLocaleString()}</td>
                        <td className={order.paid ? 'text-green-600' : 'text-red-600'}>{order.paid ? 'YES' : 'NO'}</td>
                        <td>
                            {order?.name} {order?.email}<br/>
                            {order?.city} {order?.pincode}<br/>
                            {order?.country}<br/>
                            {order?.address}
                        </td>
                        <td>
                            {order.order_items.map(item => (
                                <div key={item.product_data.name}>
                                    {item?.product_data.name} X {item.quantity}<br/>
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Layout>
    )
}