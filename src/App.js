
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Pages/Login';
import SignUpForm from './Pages/SignUp';
import AdminHome from './Pages/AdminHome';
import SupervisorHome from './Pages/SupervisorHome';
import Search from './Pages/search';
import axios from 'axios';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userRole, setUserRole] = useState('');
    const [loggedInEmail, setLoggedInEmail] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            axios.get('https://stock-backend-zht5.onrender.com/api/user', {
                headers: {
                    'Authorization': `Bearer ${storedToken}`
                }
            })
            .then(response => {
                const { loginStatus, selectedOption, email } = response.data;
                if (loginStatus && selectedOption === 'admin' && email) {
                    setUserRole(selectedOption);
                    setIsLoggedIn(true);
                    setLoggedInEmail(email);
                } else {
                    setIsLoggedIn(false);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setIsLoggedIn(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoggedIn(false);
            setIsLoading(false);
        }
    }, []);

  
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            setIsLoggedIn(false); 
        }
    }, [localStorage.getItem('token')]);

    if (isLoading) {
        return <div>Loading...</div>; 
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={isLoggedIn ? <Navigate to="/admin-dashboard" /> : <Navigate to="/login" />} />
                <Route path="/login" element={<LoginForm onLogin={(email) => { setIsLoggedIn(true); setLoggedInEmail(email); }} />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/admin-dashboard" element={isLoggedIn ? <AdminHome loggedInEmail={loggedInEmail} /> : <Navigate to="/login" />} />
                <Route path="/supervisor-dashboard" element={<SupervisorHome />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </Router>
    );
}

export default App;

















































































































































// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import LoginForm from './Pages/Login';
// import SignUpForm from './Pages/SignUp';
// import AdminHome from './Pages/AdminHome';
// import SupervisorHome from './Pages/SupervisorHome';
// import Search from './Pages/search';
// import axios from 'axios';

// function App() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [isLoading, setIsLoading] = useState(true);
//     const [userRole, setUserRole] = useState('');
//     const [token, setToken] = useState('');
//     const [loggedInEmail, setLoggedInEmail] = useState('');

//     useEffect(() => {
//         const storedToken = localStorage.getItem('token');
//         setToken(storedToken);

//         if (storedToken) {
//             axios.get('https://stock-backend-zht5.onrender.com/api/user', {
//                 headers: {
//                     'Authorization': `Bearer ${storedToken}`
//                 }
//             })
//             .then(response => {
//                 const { loginStatus, selectedOption, email } = response.data;
//                 if (loginStatus && selectedOption === 'admin' && email) {
//                     setUserRole(selectedOption);
//                     setIsLoggedIn(true);
//                     setLoggedInEmail(email);
//                 } else {
//                     setIsLoggedIn(false);
//                 }
//                 setIsLoading(false);
//             })
//             .catch(error => {
//                 console.error('Error fetching user data:', error);
//                 setIsLoggedIn(false);
//                 setIsLoading(false);
//             });
//         } else {
//             setIsLoggedIn(false);
//             setIsLoading(false);
//         }
//     }, []);

//     if (isLoading) {
//         return <div>Loading...</div>;
//     }

//     if (isLoggedIn && userRole === 'admin' && loggedInEmail) {
//         return <AdminHome loggedInEmail={loggedInEmail} />;
//     }

//     return (
//         <Router>
//             <Routes>
//                 <Route path="/" element={<Navigate to="/login" />} />
//                 <Route path="/login" element={<LoginForm setUserRole={setUserRole} onLogin={(email) => { setIsLoggedIn(true); setLoggedInEmail(email); }} />} />
//                 <Route path="/signup" element={<SignUpForm />} />
//                 <Route path="/admin-dashboard" element={<AdminHome loggedInEmail={loggedInEmail} />} />
//                 <Route path="/supervisor-dashboard" element={<SupervisorHome />} />
//                 <Route path="/search" element={<Search/>} />
//             </Routes>
//         </Router>
//     );
// }

// export default App;




