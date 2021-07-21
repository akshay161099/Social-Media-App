import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from "./core/Home"
import Menu from "./core/Menu"
import Signup from "./user/signup"
import Signin from "./user/signin"
import Profile from "./user/Profile"
import Users from "./user/Users"
import EditProfile from "./user/EditProfile"
import FindPeople from "./user/FindPeople"
import NewPost from './post/NewPost'
import EditPost from './post/EditPost'
import SinglePost from './post/SinglePost'
import PrivateRoute from './auth/PrivateRoute'
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from './admin/Admin'

const MainRouter = () =>(
    <div>
        <Menu />
        <Switch>
            <Route exact path = "/" component={Home}></Route>
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
  exact
  path="/reset-password/:resetPasswordToken"
  component={ResetPassword}
/>

            <PrivateRoute exact path = "/post/create" component={NewPost}></PrivateRoute>
            <Route exact path = "/post/:postId" component={SinglePost}></Route>
            <PrivateRoute exact path = "/post/:postId" component={EditPost}></PrivateRoute>
            <Route exact path = "/users" component={Users}></Route>
            <Route exact path = "/signup" component={Signup}></Route>
            <Route exact path = "/signin" component={Signin}></Route>
            <PrivateRoute exact path = "/user/edit/:userId" component={EditProfile}></PrivateRoute>
            <PrivateRoute exact path = "/findpeople" component={FindPeople}></PrivateRoute>
            <PrivateRoute exact path = "/user/:userId" component={Profile}></PrivateRoute>
            <PrivateRoute exact path="/admin" component={Admin} />
            
        </Switch>
    </div>
)

export default MainRouter;