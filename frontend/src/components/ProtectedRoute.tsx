import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
};

function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;