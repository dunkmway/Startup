import React from "react";
import { Navigate } from 'react-router-dom';
import { Loading } from "./Loading";

export function PrivateAccess({ user, children }) {
    // unknown
    if (user == null) {
        return <Loading></Loading>
    }
    // unauthenticated
    else if (user._id == null) {
        return <Navigate to="/login" replace={true} ></Navigate>
    }
    // authenticated
    else {
        return children;
    }
}