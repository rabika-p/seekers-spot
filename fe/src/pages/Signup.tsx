import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

interface IData {
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
  email: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IData>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<IData> = (data) => {
    axios
      .post("http://localhost:8080/api/users/signup", data)
      .then((res) => {
        console.log(res.data);
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
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((e) => {
        console.log(e);
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
              SIGN <span className="text-[#7160b8]">UP</span>
            </h1>
            <div className="mb-3">
              <label className="text-lg">
                Fullname <span className="text-red-500">*</span>
              </label>
              <input
                {...register("fullname", {
                  required: "The fullname field is required",
                  maxLength: {
                    value: 20,
                    message: "Name cannot be longer than 20 characters",
                  },
                  validate: (value) => {
                    if (value.trim() === "") {
                      return "Name should not only contain spaces";
                    }
                  },
                })}
                className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                  errors.fullname ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Fullname"
              />
              {errors.fullname && (
                <p className="text-red-500 text-base">{`${errors.fullname.message}`}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="text-lg">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email", {
                  required: "The email field is required",
                  pattern: {
                    value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-500 text-base">{`${errors.email.message}`}</p>
              )}
            </div>

            <div className="mb-3">
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
                className={`border rounded-lg w-full py-2 px-3 mb-3 mt-2 text-gray-700 shadow-sm  ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Email"
              />
              {errors.username && (
                <p className="text-red-500 text-base">
                  {`${errors.username.message}`}
                </p>
              )}
            </div>

            <div className="mb-3">
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
                className={`border rounded-lg w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow-sm  ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-500 text-base">
                  {`${errors.password.message}`}
                </p>
              )}
            </div>

            <div className="mb-3">
              <label className="text-lg">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                className={`border rounded-lg w-full py-2 px-3 mb-4 mt-2 text-gray-700 shadow-sm ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-base">
                  {`${errors.confirmPassword.message}`}
                </p>
              )}
            </div>

            <div className="flex mt-5">
              <input
                type="submit"
                value={"Sign up"}
                className="w-full bg-[#7160b8] hover:bg-[#574796] hover:cursor-pointer text-white font-semibold py-2 px-4 rounded"
              />
            </div>

            <div className="flex mt-8">
              <Link to="/">
                <h4>
                  Already have an account?&nbsp;
                  <span className="text-[#7160b8] hover:underline hover:text-[#574796]">
                    Sign in
                  </span>
                </h4>
              </Link>
            </div>
          </div>

          <div className="hidden md:block w-1/2 h-[600px]">
            <img
              src="../src/assets/images/signup-large.jpg"
              alt="Image of a girl using her phone"
              className="w-full h-full object-cover rounded-r-lg aspect-w-2 aspect-h-3"
            />
            <div className="rounded-r-lg"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
