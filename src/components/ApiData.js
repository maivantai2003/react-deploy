import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as signalR from '@microsoft/signalr';

const UserListComponent = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [newUser, setNewUser] = useState(''); // Giá trị của người dùng mới
  const [connection, setConnection] = useState(null); // Kết nối SignalR

  // Hàm để lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://a8dd-2401-d800-7b35-def0-c44c-e655-652b-97f2.ngrok-free.app/api/user');
      console.log(response)
      const usersData = Array.isArray(response.data) ? response.data : [];
    setUsers(usersData);
    console.log(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Hàm để thêm người dùng mới
  const addUser = async () => {
    try {
      await axios.post('https://a8dd-2401-d800-7b35-def0-c44c-e655-652b-97f2.ngrok-free.app/api/user?user='+newUser);
      setNewUser(''); // Reset lại giá trị input sau khi thêm
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Kết nối SignalR và lắng nghe sự kiện LoadListUser
  useEffect(() => {
    const connectToSignalR = async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl('https://a8dd-2401-d800-7b35-def0-c44c-e655-652b-97f2.ngrok-free.app/hub')
        .build();

      try {
        await connection.start();
        console.log('SignalR connected');
        setConnection(connection);
        connection.on('LoadListUser', fetchUsers);
        connection.on("LoadContent",function(user){
            console.log('Send Async: '+user)
        })
      } catch (error) {
        console.error('Error connecting to SignalR:', error);
      }
    };

    connectToSignalR();

    // Ngắt kết nối SignalR khi component unmount
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Lấy danh sách người dùng khi component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>

      <h3>Add New User</h3>
      <input
        type="text"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
        placeholder="Enter new user"
      />
      <button onClick={addUser}>Add User</button>
    </div>
  );
};

export default UserListComponent;
