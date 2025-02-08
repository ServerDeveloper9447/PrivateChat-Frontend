import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, UserPlus } from 'lucide-react';
import { register } from '../functions';
import { Loading, Notify } from 'notiflix';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,setError] = useState('')
  const [passvalid,setPassvalid] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(password != confirmPassword) return setError("Password does not match confirm password.");
    setError('')
    Loading.pulse()
    const [res,err] = (await register({username:name,email,password}))!
    console.log([res,err])
    if(!err) {
      localStorage.setItem("private_key",res.private_key)
      Loading.remove()
      Notify.success("Registered. Please verify via the email sent to you.")
    } else {
      Loading.remove();
      setError(err)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex items-center justify-center mb-6">
          <MessageCircle className="text-green-500 w-10 h-10 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Chat App</h1>
        </div>
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9]/g,""))}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => {
                if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(e.target.value)) {
                  setPassvalid(false);
                } else {
                  setPassvalid(true)
                }
                setPassword(e.target.value)
              }}
              required
            />
            <p style={{color:!passvalid ? "red" : "green", fontSize: 'small'}}>Password must contain at least 8 characters with minimum one uppercase, one lowercase, one number and any of @ $ ! % * ? &.</p>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <p style={{color:"red"}}>{(!confirmPassword == false && password != confirmPassword) ? "Passwords do not match" : ""}</p>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <UserPlus className="inline-block w-5 h-5 mr-2" />
            Register
          </button>
          <p style={{color:"red"}}>{error}</p>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-green-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;