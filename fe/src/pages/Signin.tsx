import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setUsername } from "../features/UsernameSlice";

interface ISignInData {
  username: string;
  password: string;
}

// interface ISigninProps {
//   setShowUsername: (value: boolean) => void;
// }

// const Signin = ({ setShowUsername }: ISigninProps) => {
const Signin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInData>();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<ISignInData> = (data) => {
    axios
      .post("http://localhost:8080/api/users/login", data)
      .then((res) => {
        if (res.data.err) {
          const errorMessage = res.data.err.message || "An error occurred";
          toast.error(errorMessage);
        } else {
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          //get data from the backend
          const accessToken = res.data.accessToken;
          const userId = res.data.userId;
          const username = res.data.username;

          dispatch(setUsername(res.data.username));

          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("userId", userId);
            localStorage.setItem("username", username);

            console.log(res.data);

            setTimeout(() => {
              navigate("/dashboard");
            }, 1000);
            // setTimeout(() => {
            //   setShowUsername(true);
            // }, 2000);
          }
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div className="pt-16 mb-5">
      <div className="text-center mt-10">
        <ToastContainer />
      </div>

      <div className="w-full flex justify-center p-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row w-full md:w-3/4 lg:w-2/3 bg-white shadow-lg overflow-hidden"
        >
          <div className="w-full md:w-1/2 p-5 md:p-10">
            <h1 className="text-3xl font-sans font-bold mb-7">
              SIGN <span className="text-[#7160b8]">IN </span>
            </h1>

            <div className="mb-4">
              <label className="text-lg">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                {...register("username", {
                  required: "The username field is required",
                  maxLength: {
                    value: 20,
                    message: "Username cannot be longer than 20 characters",
                  },
                  minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters",
                  },
                })}
                className={`border rounded-lg w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow-sm  ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {`${errors.username.message}`}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="text-lg">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "The password field is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                autoComplete="current-password"
                className={`border rounded-lg w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow-sm ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {`${errors.password.message}`}
                </p>
              )}
            </div>

            <div className="flex mt-7">
              <input
                type="submit"
                value={"Sign in"}
                className="w-full bg-[#7160b8] hover:bg-[#574796] hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
              />
            </div>

            <div className="flex mt-7">
              <Link to="/forgot-password">
                <h4 className="hover:underline">Forgot your password?</h4>
              </Link>
            </div>

            <div className="flex mt-7">
              <Link to="/signup">
                <h4>
                  Don't have an account yet?&nbsp;
                  <span className="text-[#7160b8] hover:underline hover:text-[#574796]">
                    Sign up
                  </span>
                </h4>
              </Link>
            </div>
          </div>

          {/* <div className="hidden md:block w-1/2 md:h-full pl-4 md:pl-0 h-[600px]"> */}
          <div className="hidden md:block w-1/2 h-[500px]">
            <img
              src="../src/assets/images/signin.jpg"
              alt="Image of a boy using his phone"
              className="w-full h-full object-cover rounded-r-lg aspect-w-2 aspect-h-3"
            />
            <div className="rounded-r-lg"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
