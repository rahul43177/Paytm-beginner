import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

export const HomeComponent = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [selectedUser, setSelectedUser] = useState("");
  const handleLogout = async () => {
    try {
      const response = await axios.get(`http://localhost:3030/user/logout`, {
        withCredentials: true,
      });
      if (response.data.status == true) {
        toast.success("The logout is successfull");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPassword = () => {
    navigate("/editPassword");
  };

  const handleAddFunds = () => {
    navigate("/addFunds");
  };
  const handleEditProfile = () => {
    setEditProfileModalOpen(true);
  };
  const handlePay = async (amount, to) => {
    try {
      let paymentResponse = await axios.post(
        "http://localhost:3030/transfer/transaction",
        {
          amount,
          to,
          from: userEmail,
        }
      );

      console.log(paymentResponse);
      if ((paymentResponse.status = 200)) {
        toast.success(paymentResponse.data.message);
      } 
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  useEffect(() => {
    const getBalance = async () => {
      try {
        const balanceResponse = await axios.post(
          "http://localhost:3030/account/getBalance",
          {
            userEmail: userEmail,
          }
        );

        setBalance(balanceResponse.data.balance.balance);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    getBalance();
  }, [userEmail]);

  useEffect(() => {
    const getUsersList = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3030/user/usersList",
          {
            loggedInUser: userEmail,
          },
          {
            withCredentials: true,
          }
        );

        setUsers(response.data.userData);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getUsersList();
  }, [userEmail]);

  const openModal = (user) => {
    setSelectedUser(user);
    setModalIsOpen(true);
  };
  const closeModal = () => setModalIsOpen(false);
  const closeEditProfileModal = () => setEditProfileModalOpen(false);
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 flex justify-center">
          <h1
            className="bg-white font-bold text-center text-6xl text-blue-500"
            style={{ marginRight: "-28.5rem" }}
          >
            CUTIE PAY
          </h1>
        </div>
        <div>
          <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold text-center text-2xl p-1 rounded-lg shadow-md">
            Welcome, <span className="text-white">{userName}</span>
          </h1>
        </div>
        <button
          className="text-center font-bold bg-white p-1 rounded m-1 border-2 border-blue-500"
          onClick={handleEditProfile}
        >
          Edit Profile
        </button>
        <button
          className="text-center font-bold bg-white p-1 rounded border-2 border-rose-500"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="absolute right-20">
        <div
          className="font-bold text-2xl mb-4 text-black"
          style={{
            marginRight: "64px",
            marginTop: "-20px",
          }}
        >
          Balance: <span className="text-green-500">{balance}</span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="font-bold text-2xl mb-4 text-white bg-black">
          List of Users
        </h1>
        <ul className="w-full max-w-2xl bg-gray-100 rounded-lg shadow-lg">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-4 m-2 border-b bg-white rounded-md hover:bg-grey-200 transition duration-300"
            >
              <div className="flex-1 text-center text-blue-500 font-bold">
                {`${user.firstName} ${user.lastName}`}
              </div>
              <div className="flex-1 text-center text-red-700 font-semibold">
                {user.email}
              </div>
              <button
                className="flex-1 text-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-green-600 hover:font-bold transition duration-300"
                onClick={() => openModal(user.email)}
              >
                Pay
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg shadow-lg max-w-md mx-auto my-8 p-6 absolute pt-10"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">Enter Payment Amount</h2>
        <input
          type="text"
          placeholder="Enter the amount"
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="flex justify-center space-x-4">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handlePay(amount, selectedUser)}
          >
            Pay
          </button>
        </div>
      </Modal>
      <Modal
        isOpen={editProfileModalOpen}
        onRequestClose={closeEditProfileModal}
        className="bg-white rounded-lg shadow-lg max-w-md mx-auto my-8 p-6 absolute pt-10"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-3xl font-bold text-center mt-2 mb-8">
          Edit Profile
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={closeEditProfileModal}
            className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>
          <button
            onClick={handleEditPassword}
            className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Change Password
          </button>
          <button
            onClick={handleAddFunds}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Funds
          </button>
        </div>
      </Modal>
    </>
  );
};
