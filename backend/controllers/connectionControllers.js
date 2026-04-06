const Connection = require("../models/connection");

const sendRequest = async (req, res) => {
  try {
    const sender = req.user.id;
    const receiver = req.params.userId;

    console.log("SENDER:", sender);
    console.log("RECEIVER:", receiver);

    if (sender === receiver) {
      return res.status(400).json({ msg: "Cannot connect to yourself" });
    }

    const existing = await Connection.findOne({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    console.log("EXISTING:", existing);

    if (existing) {
      return res.status(400).json({ msg: "Connection already exists" });
    }

    const connection = await Connection.create({
      sender,
      receiver,
      status: "pending",
    });

    res.json(connection);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

const getStatus = async (req, res) => {
  try {
    const currentUser = req.user.id;
    const otherUser = req.params.userId;

    const connection = await Connection.findOne({
      $or: [
        { sender: currentUser, receiver: otherUser },
        { sender: otherUser, receiver: currentUser },
      ],
    });

    if (!connection) {
      return res.json({ status: "none" });
    }

    // ✅ If already accepted
    if (connection.status === "accepted") {
      return res.json({
        status: "connected",
        connectionId: connection._id,
      });
    }

    // ✅ If YOU received the request
    if (connection.receiver.toString() === currentUser) {
      return res.json({
        status: "incoming",
        connectionId: connection._id,
      });
    }

    // ✅ If YOU sent the request
    return res.json({
      status: "pending",
      connectionId: connection._id,
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const connectionId = req.params.id;

    const connection = await Connection.findById(connectionId);

    if (!connection) {
      return res.status(404).json({ msg: "Connection not found" });
    }

    connection.status = "accepted";
    await connection.save();

    res.json({ msg: "Connection accepted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

const handleReject = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/connections/reject/${connectionId}`,
      {},
      
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    await fetchStatus(); 
  } catch (err) {
    console.log(err);
  }
};
module.exports = { sendRequest, getStatus, acceptRequest, handleReject };
