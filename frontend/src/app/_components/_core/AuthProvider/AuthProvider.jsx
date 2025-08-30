// import React, { useEffect } from "react";
// import { AuthContext } from "./AuthContext";
// import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
// import axios from "axios";
// import { toast } from "react-toastify";

// export function AuthProvider({ children }) {
//   const [isAuthenticated, setIsAuthenticated] = React.useState(false);
//   const [loading, setLoading] = React.useState(true);
//   const [user, setUser] = React.useState(null);
//   const [userLoading, setUserLoading] = React.useState(false);
//   // useState for loggeg in users
//   const [loggedInUser,setLoggedInUser] = React.useState({})

//   const fetchLoggedInUser = async () => {
//   setUserLoading(true);
//   try {
//     const response = await axios.get("http://localhost:3000/api/users/me", { withCredentials: true });
//     if (response) {
//       setIsAuthenticated(true);
//     }
//     setLoggedInUser(response.data);
//     return response.data;
//   } catch (error) {
//     console.log("error message:", error);
//     return false;
//   } finally {
//     setUserLoading(false);
//   }
// };


//   useEffect(()=>{
//   fetchLoggedInUser()
//   },[])

//   // Fetch user data from API
//   const fetchUser = async () => {
//     setUserLoading(true);
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/users",
//         { withCredentials: true }
//       );

//       console.log("this is user fetching response: " , response.data);
      
//       if (response.data) {
//         setUser(response.data);
//         return response.data;
//       }
//     } catch (error) {
//       console.error("Failed to fetch user data:", error);
//       // If 401, user is not authenticated
//       if (error.response?.status === 401) {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//       return null;
//     } finally {
//       setUserLoading(false);
//     }
//   };

//   // Update user data (for profile updates)
//   const updateUser = (updatedUser) => {
//     setUser(updatedUser);
//   };

//   // Refresh user data (re-fetch from server)
//   const refreshUser = async () => {
//     return await fetchUser();
//   };


//     // Refresh user data (re-fetch from server)
//   const refreshLoggegInUser = async () => {
//     return await fetchLoggedInUser();
//   };

//   const login = async ({ email, password }) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/auth/login",
//         { email, password },
//         { withCredentials: true }
//       );
//       if (response.data.token) {
//         const stringify = {
//           token: response.data.token,
//           email: response.data.email,
//         };
//         const authUserSr = encodeURIComponent(JSON.stringify(stringify));
//         // setCookie("token", authUserSr, 1);
//         setCookie("token", response.data.token, 1);
//         setIsAuthenticated(true);
        
//         // Fetch user data after successful login
//         await fetchUser();
//         await fetchLoggedInUser()
        
//         // Show success toast
//         toast.success("Login successful! Welcome back!", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
        
//         return response.data;
//       }
//       else {
//         return false;
//       }
//     } catch (error) {
//       setIsAuthenticated(false);
      
//       // Show error toast
//       toast.error(error.response?.data?.message || "Login failed. Please try again.", {
//         position: "top-right",
//         autoClose: 4000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
      
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       const response = await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
//       if (response.status === 200) {
//         eraseCookie("token");
//         setIsAuthenticated(false);
//         setUser(null); // Clear user data on logout
        
//         // Show success toast
//         toast.info("Logged out successfully!", {
//           position: "top-right",
//           autoClose: 3000,
//           hideProgressBar: false,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//         });
//       }
//     } catch (error) {
//       console.log(error);
      
//       // Show error toast
//       toast.error("Logout failed. Please try again.", {
//         position: "top-right",
//         autoClose: 4000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   React.useEffect(() => {
//     const initializeAuth = async () => {
//       let authUserSr = getCookie("token");
//       if (authUserSr) {
//         setIsAuthenticated(true);
//         // Fetch user data if authenticated
//         await fetchUser();
//         await fetchLoggedInUser()
//       }
//       setLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ 
//       isAuthenticated, 
//       loading, 
//       login, 
//       logout, 
//       setIsAuthenticated,
//       user,
//       userLoading,
//       fetchUser,
//       updateUser,
//       refreshUser,
//       fetchLoggedInUser,
//       loggedInUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

import React, { useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { eraseCookie, getCookie, setCookie } from "@jumbo/utilities/cookies";
import { toast } from "react-toastify";
import api from "../../../pages/admin/libs/api"; // ✅ use centralized axios instance

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [userLoading, setUserLoading] = React.useState(false);
  const [loggedInUser, setLoggedInUser] = React.useState({});

  const fetchLoggedInUser = async () => {
    setUserLoading(true);
    try {
      const response = await api.get("/users/me");
      if (response) {
        setIsAuthenticated(true);
      }
      setLoggedInUser(response.data);
      return response.data;
    } catch (error) {
      console.log("error message:", error);
      return false;
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  const fetchUser = async () => {
    setUserLoading(true);
    try {
      const response = await api.get("/users");
      console.log("this is user fetching response: ", response.data);
      
      if (response.data) {
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        setUser(null);
      }
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    return await fetchUser();
  };

  const refreshLoggedInUser = async () => {
    return await fetchLoggedInUser();
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        setCookie("token", response.data.token, 1);
        setIsAuthenticated(true);
        
        await fetchUser();
        await fetchLoggedInUser();
        
        toast.success("Login successful! Welcome back!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        return response.data;
      } else {
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      
      toast.error(error.response?.data?.message || "Login failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await api.post("/auth/logout");
      if (response.status === 200) {
        eraseCookie("token");
        setIsAuthenticated(false);
        setUser(null);
        
        toast.info("Logged out successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.log(error);
      
      toast.error("Logout failed. Please try again.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  React.useEffect(() => {
    const initializeAuth = async () => {
      let authUserSr = getCookie("token");
      if (authUserSr) {
        setIsAuthenticated(true);
        await fetchUser();
        await fetchLoggedInUser();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      loading, 
      login, 
      logout, 
      setIsAuthenticated,
      user,
      userLoading,
      fetchUser,
      updateUser,
      refreshUser,
      fetchLoggedInUser,
      loggedInUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}