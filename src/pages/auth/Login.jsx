import {useState} from "react";
import {useNavigate} from "react-router-dom";
import RoleSelector from "@/components/auth/RoleSelector";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {ROUTES, USER_ROLES} from "@/lib/constants/constants";
import {authService} from "@/services/authService";
import {useAuthStore} from "@/store/useAuthStore";

export default function Login() {
	const navigate = useNavigate();
	const {login: setAuthUser} = useAuthStore();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		role: USER_ROLES.CONSUMER,
	});
	const [errors, setErrors] = useState({});
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email) {
			newErrors.email = "Required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Invalid email";
		}
		if (!formData.password) {
			newErrors.password = "Required";
		}
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		setIsLoading(true);
		try {
			const user = await authService.login(
				formData.email,
				formData.password,
				formData.role,
			);
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
					Sign in to see photos and videos from your friends.
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
				</div>

				<div className="pt-2">
					<Button
						type="submit"
						className="w-full rounded bg-[#FFB6C1] py-2 text-sm font-semibold text-white hover:bg-[#f48fb1] transition-colors"
						loading={isLoading}
					>
						Log in
					</Button>
				</div>
			</form>

			<div className="mt-6 flex items-center justify-center space-x-2 border-t border-gray-100 pt-6">
				<p className="text-sm text-gray-900">
					Don't have an account?{" "}
					<button
						onClick={() => navigate(ROUTES.AUTH.CONSUMER_SIGNUP)}
						className="font-semibold text-[#FFB6C1] hover:text-[#f48fb1]"
					>
						Sign up
					</button>
				</p>
			</div>
		</div>
	);
}
