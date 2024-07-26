import { Link, useNavigate } from "react-router-dom";
import * as Icons from "react-icons/tb";
import React, { useState, useEffect } from "react";
import Badge from "../../components/common/Badge.jsx";
import CheckBox from "../../components/common/CheckBox.jsx";
import TableAction from "../../components/common/TableAction.jsx";
import { useCookies } from 'react-cookie';
import axios from "axios";

const ManageOrders = () => {
  const [cookies] = useCookies(['token']);
  console.log(cookies);
  const [bulkCheck, setBulkCheck] = useState(false);
  const [specificChecks, setSpecificChecks] = useState({});
  const [orderData, setOrderData] = useState([]);
  const [token, settoken] = useState('');

  const [render, setrender] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrderData, setFilteredOrderData] = useState([]);

  const handleBulkCheckbox = (isCheck) => {
    setBulkCheck(isCheck);
    if (isCheck) {
      const updateChecks = {};
      orderData.forEach((order) => {
        updateChecks[order._id] = true;
      });
      setSpecificChecks(updateChecks);
    } else {
      setSpecificChecks({});
    }
  };

  const handleCheckOrder = (isCheck, id) => {
    setSpecificChecks((prevSpecificChecks) => ({
      ...prevSpecificChecks,
      [id]: isCheck,
    }));
  };

  const actionItems = ["delivered", "undelivered"];

  const handleActionItemClick = (item, itemID) => {
    const token = cookies.token;
    var updateItem = item.toLowerCase();
    if (updateItem === "delivered") {
      alert(`#${itemID} item delivered`);
      axios.patch(`https://canteen.fardindev.me/api/v1/orders/${itemID}?status=delivered`,{
        headers:{
            'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        console.log(res.data);
        console.log('rjej');
        setrender(true);
      })
    } else if (updateItem === "undelivered") {
      console.log('undelivered');
    }
  };

  useEffect(() => {
    const token = cookies.token;
    settoken(token);
    setrender(false);
    axios.get('https://canteen.fardindev.me/api/v1/orders?status=paid', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        console.log(res.data);
        setOrderData(res.data.orders);
        setFilteredOrderData(res.data.orders);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cookies.token, render]);

  useEffect(() => {
    const filtered = orderData.filter(order => {
      const user = order.user;
      return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredOrderData(filtered);
  }, [searchTerm, orderData]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className="orders">
      <div className="container">
        <div className="wrapper">
          <div className="content transparent">
            <div className="content_head">
              <input
                type="text"
                placeholder="Search Order..."
                className="sm table_search"
                value={searchTerm}
                onChange={handleSearchChange}
                style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <div className="btn_parent">
                {/* <Link to="/orders/add" className="sm button">
                  <Icons.TbPlus />
                  <span></span>
                </Link>
                <Button label="Advance Filter" className="sm" />
                <Button label="Save" className="sm" /> */}
              </div>
            </div>
            <div className="content_body">
              <div className="table_responsive">
                <table className="separate">
                  <thead>
                    <tr>
                      <th className="td_checkbox">
                        <CheckBox
                          onChange={handleBulkCheckbox}
                          isChecked={bulkCheck}
                        />
                      </th>
                      <th className="td_id">ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrderData.map((order, key) => (
                      <tr key={key}>
                        <td className="td_checkbox">
                          <CheckBox
                            onChange={(isCheck) =>
                              handleCheckOrder(isCheck, order._id)
                            }
                            isChecked={specificChecks[order._id] || false}
                          />
                        </td>
                        <td className="td_id">{key}</td>
                        <td>
                         {order.user.name}
                        </td>
                        <td>{order.user.email}</td>
                        <td>{order.total}</td>
                        <td>Static method</td>
                        <td>
                          {order.status.toLowerCase() === "active" ||
                          order.status.toLowerCase() === "completed" ||
                          order.status.toLowerCase() === "approved" ||
                          order.status.toLowerCase() === "delivered" ||
                          order.status.toLowerCase() === "shipped" ||
                          order.status.toLowerCase() === "paid" ||
                          order.status.toLowerCase() === "coming soon" ? (
                            <Badge
                              label={order.status}
                              className="light-success"
                            />
                          ) : order.status.toLowerCase() === "inactive" ||
                            order.status.toLowerCase() === "out of stock" ||
                            order.status.toLowerCase() === "rejected" ||
                            order.status.toLowerCase() === "locked" ||
                            order.status.toLowerCase() === "discontinued" ? (
                            <Badge
                              label={order.status}
                              className="light-danger"
                            />
                          ) : order.status.toLowerCase() === "on sale" ||
                              order.status.toLowerCase() === "featured" ||
                              order.status.toLowerCase() === "shipping" ||
                              order.status.toLowerCase() === "processing" ||
                              order.status.toLowerCase() === "pending" ? (
                            <Badge
                              label={order.status}
                              className="light-warning"
                            />
                          ) : order.status.toLowerCase() === "archive" ||
                              order.status.toLowerCase() === "pause" ? (
                            <Badge
                              label={order.status}
                              className="light-secondary"
                            />
                          ) : (
                            order.status
                          )}
                        </td>
                        <td className="td_action">
                          <TableAction
                            actionItems={actionItems}
                            onActionItemClick={(item) =>
                              handleActionItemClick(item, order._id)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
         
          </div>
        </div>
      </div>
    </section>
  );
};

export default ManageOrders;
