import React from "react";
import { Navigate } from 'react-router-dom';
import { Loading } from "./Loading";

export function PublicAccess({ user, children }) {
    // unknown
    if (user == null) {
        return <Loading></Loading>
    }
    // unauthenticated
    else if (user._id == null) {
        return children;
    }
    // authenticated
    else {
        return <Navigate to="/profile" replace={true} ></Navigate>
    }
}