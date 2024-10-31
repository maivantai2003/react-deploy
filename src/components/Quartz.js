import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const NotificationComponent = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Thiết lập kết nối tới SignalR hub
        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://1501-2401-d800-7b35-def0-c44c-e655-652b-97f2.ngrok-free.app/hub").withAutomaticReconnect() // Đường dẫn tới SignalR hub
            .build();
        connection.start()
            .then(() => {
                console.log("SignalR Connected.");
                // Nhận thông báo từ server
                connection.on("ReceiveNotification", (message) => {
                    
                    setNotifications((prev) => [...prev, message]);
                });
               
            })
            .catch((error) => console.error("SignalR Connection Error: ", error));

        // Cleanup kết nối khi component bị unmount
        return () => {
            connection.stop();
        };
    }, []);

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationComponent;
