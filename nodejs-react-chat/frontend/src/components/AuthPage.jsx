import axios from "axios";

const AuthPage = (props) => {
  const onSubmit = (e) => {
    e.preventDefault();
    const { value } = e.target[0];
  
    const socket = new WebSocket("ws://localhost:5000/login");
  
    socket.addEventListener("open", () => {
      
      const data = { username: value };
      socket.send(JSON.stringify(data));
    });
  
    socket.addEventListener("message", (event) => {
     
      const response = JSON.parse(event.data);
      props.onAuth({ ...response, secret: value });
      socket.close(); 
    });
  
    socket.addEventListener("error", (error) => {
      console.log("Auth Error", error);
    });
  }

  return (
    <div className="background">
      <form onSubmit={onSubmit} className="form-card">
        <div className="form-title">Welcome 👋</div>

        <div className="form-subtitle">Set a username to get started</div>

        <div className="auth">
          <div className="auth-label">Username</div>
          <input className="auth-input" name="username" />
          <button className="auth-button" type="submit">
            Enter
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;