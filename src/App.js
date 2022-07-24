import {Routes, Route, Link, Navigate, Outlet} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./navbar/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import Alerts from "./components/alerts/Alert";
import BottomNavbar from "./navbar/BottomNavbar";
import {useSelector} from "react-redux";
import {selectUser} from "./redux/user/userSlice";
import CreatePost from "./pages/CreatePost";
import VideoCompilations from "./pages/VideoCompilations";
import Posts from "./pages/Posts";
function App() {
  const userAuth = useSelector(selectUser)

  const ProtectedRoute = ({
                            user,
                            redirectPath = '/login',
                            children,
                          }) => {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }

    return children ? children : <Outlet />;
  };

  return (
      <div>
        <Navbar/>
        <Alerts/>
        <Routes>
          <Route element={<ProtectedRoute user={userAuth} />}>
            <Route path="account" element={<Account />} />
            {/*<Route path='/buy' element={<BuyQuinielas />} />*/}
            {/*<Route path='/myQuinielas' element={<UserQuinielas />} />*/}

          </Route>
          <Route path='/' element={<Home />} />
            <Route path='/teen-creepshots' element={<Posts />} />
            <Route path='/tiktok-thots' element={<VideoCompilations />} />
            <Route path='/create' element={<CreatePost />} />
            <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <BottomNavbar/>
      </div>
  );
}

export default App;
