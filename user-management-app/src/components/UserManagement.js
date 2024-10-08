import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const checkAllUsersBlocked = useCallback((users) => {
    const allBlocked = users.every(user => user.status === 'blocked');
    if (allBlocked) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch users from the API
    const fetchUsers = async () => {
      try { 
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        checkAllUsersBlocked(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    // Fetch the current user's name from the API
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.name);
      } catch (error) {
        console.error('Failed to fetch user name', error);
      }
    };

    fetchUsers();
    fetchUserName();
  }, [token, navigate, checkAllUsersBlocked]);

  // Handle select all users checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allUserIds = users.map((user) => user.id);
      setSelectedUsers(allUserIds);
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual user selection
  const handleSelectUser = (e, id) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, id]);
    } else {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    }
  };

  // Handle blocking selected users
  const handleBlockUsers = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/status`,
        { userIds: selectedUsers, status: 'blocked' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUsers = users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'blocked' } : user);
      setUsers(updatedUsers);
      setSelectedUsers([]);
      checkAllUsersBlocked(updatedUsers);
    } catch (error) {
      console.error('Failed to block users', error);
    }
  };

  // Handle unblocking selected users
  const handleUnblockUsers = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/users/status`,
        { userIds: selectedUsers, status: 'active' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user => selectedUsers.includes(user.id) ? { ...user, status: 'active' } : user));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to unblock users', error);
    }
  };

  // Handle deleting selected users
  const handleDeleteUsers = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/users`, {
        data: { userIds: selectedUsers },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to delete users', error);
    }
  };
  
  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between mb-3">
        <div className="toolbar">
          <button className="btn btn-danger" onClick={handleBlockUsers} disabled={selectedUsers.length === 0}>Block</button>
          <button className="btn ms-2" onClick={handleUnblockUsers} disabled={selectedUsers.length === 0}>
            <img src={require('./icons/unlock.png')} alt="Unblock" width="20" height="20" />
          </button>
          <button className="btn ms-2" onClick={handleDeleteUsers} disabled={selectedUsers.length === 0}>
            <img src={require('./icons/trash.png')} alt="Delete" width="20" height="20" />
          </button>
        </div>
        <div className="user-name">
          <span>Welcome {userName} </span>
          <button className="btn btn-link" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={handleSelectAll} checked={selectedUsers.length === users.length} />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login Time</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => handleSelectUser(e, user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.last_login_time || 'N/A'}</td>
              <td>{user.registration_time}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;