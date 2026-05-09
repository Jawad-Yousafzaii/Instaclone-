import {useState} from "react";
import {useNavigate} from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {ROUTES, USER_ROLES} from "@/lib/constants/constants";
import {authService} from "@/services/authService";
import {useAuthStore} from "@/store/useAuthStore";

export default function ConsumerSignup() {
	const navigate = useNavigate();
	const {login: setAuthUser} = useAuthStore();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: USER_ROLES.CONSUMER,
		bio: "",
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name) {
			newErrors.name = "Name is required";
		}

		if (!formData.email) {
			newErrors.email = "Email is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid";
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			const user = await authService.signup({
				name: formData.name,
				email: formData.email,
				password: formData.password,
				role: formData.role,
				bio: formData.bio || null,
			});

			setAuthUser(user);
			if (user.role === USER_ROLES.CREATOR) {
				navigate(ROUTES.CREATOR.DASHBOARD);
			} else {
				navigate(ROUTES.CONSUMER.FEED);
			}
		} catch (error) {
			setErrors({general: error.message});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="w-full">
			<div className="mb-6 text-center">
				<p className="text-gray-500 font-semibold text-sm">
					Sign up to see photos and videos from your friends.
				</p>
			</div>

			{errors.general && (
				<div className="mb-4 rounded border border-red-100 bg-red-50 p-3 text-center text-sm font-semibold text-red-500">
					{errors.general}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-4">
				<div className="space-y-1.5">
					<label className="text-xs font-semibold text-gray-500 uppercase">Account Type</label>
					<RoleSelector
						value={formData.role}
						onChange={(role) => setFormData({...formData, role})}
					/>
				</div>

				<div className="space-y-3">
					<Input
						type="text"
						placeholder="Full Name"
						value={formData.name}
						onChange={(e) => setFormData({...formData, name: e.target.value})}
						error={errors.name}
					/>

					<Input
						type="email"
						placeholder="Email address"
						value={formData.email}
						onChange={(e) => setFormData({...formData, email: e.target.value})}
						error={errors.email}
					/>

					<Input
						type="password"
						placeholder="Password"
						value={formData.password}
						onChange={(e) =>
							setFormData({...formData, password: e.target.value})
						}
						error={errors.password}
					/>

					<Input
						type="password"
						placeholder="Confirm Password"
						value={formData.confirmPassword}
						onChange={(e) =>
							setFormData({...formData, confirmPassword: e.target.value})
						}
						error={errors.confirmPassword}
					/>
				</div>

				<div className="text-center text-xs text-gray-400 py-1">
					By signing up, you agree to our Terms , Privacy Policy and Cookies Policy.
				</div>

				<div className="pt-2">
					<Button
						type="submit"
						className="w-full rounded bg-[#FFB6C1] py-2 text-sm font-semibold text-white hover:bg-[#f48fb1] transition-colors"
						loading={isLoading}
					>
						Sign up
					</Button>
				</div>
			</form>

			<div className="mt-6 flex items-center justify-center space-x-2 border-t border-gray-100 pt-6">
				<p className="text-sm text-gray-900">
					Have an account?{" "}
					<button
						onClick={() => navigate(ROUTES.AUTH.LOGIN)}
						className="font-semibold text-[#FFB6C1] hover:text-[#f48fb1]"
					>
						Log in
					</button>
				</p>
			</div>
		</div>
	);
}
