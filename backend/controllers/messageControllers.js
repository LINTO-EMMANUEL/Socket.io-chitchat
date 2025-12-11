let messages = [
  {
    id: 1,
    user: "Linto",
    text: "Hello, how are you?",
    timestamp: new Date().toISOString(),
  },
  {
    id: 2,
    user: "Nihal",
    text: "Hello, how are you?",
    timestamp: new Date().toISOString(),
  },
];

//get all messages

const getMessages = (req, res) => {
  try {
    res.json({
      success: true,
      data: messages,
      count: messages.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

const CreateMessage = (req, res) => {
  try {
    const { user, text } = req.body;
    //validation
    if (!text || !user) {
      return res.status(400).json({
        success: false,
        message: "User and text are required fields",
      });
    }
    const newMessage = {
      id: messages.length + 1,
      text,
      user,

      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

//delete message

const deleteAllMessages = (req, res) => {
  try {
    messages = [];
    res.json({
      success: true,
      message: "All messages deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

const addMessage = (message) => {
  const newMessage = {
    id: messages.length + 1,
    text: message.text,
    user: message.user,
    timestamp: new Date().toISOString(),
  };
  messages.push(newMessage);
  return newMessage;
};
module.exports = { getMessages, CreateMessage, deleteAllMessages, addMessage };
