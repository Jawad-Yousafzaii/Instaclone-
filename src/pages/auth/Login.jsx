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
		<div className="animate-in fade-in slide-in-from-right-8 duration-1000">
			{/* Header */}
			<div className="mb-12">
				<h2 className="text-text-primary text-5xl font-black tracking-tighter md:text-6xl">
					Welcome back
				</h2>
				<p className="text-text-tertiary mt-4 text-lg font-bold tracking-tight">
					Enter your credentials to access the studio.
				</p>
			</div>

			{/* Error Alert */}
			{errors.general && (
				<div className="bg-accent-magenta/5 border-accent-magenta/20 text-accent-magenta mb-8 rounded-2xl border p-5 text-sm font-bold">
					{errors.general}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-10">
				{/* Unique Role Selection */}
				<div className="space-y-4">
					<label className="text-text-muted ml-2 text-[10px] font-black tracking-[0.3em] uppercase">
						Choose Studio
					</label>
					<RoleSelector
						value={formData.role}
						onChange={(role) => setFormData({...formData, role})}
					/>
				</div>

				{/* Form Fields - Focus on spacing and clarity */}
				<div className="space-y-6">
					<Input
						label="Email"
						type="email"
						placeholder="studio@VELORA.com"
						value={formData.email}
						onChange={(e) => setFormData({...formData, email: e.target.value})}
						error={errors.email}
					/>

					<Input
						label="Password"
						type="password"
						placeholder="••••••••"
						value={formData.password}
						onChange={(e) =>
							setFormData({...formData, password: e.target.value})
						}
						error={errors.password}
					/>
				</div>

				{/* Submit Button - Premium Presence */}
				<div className="space-y-6 pt-4">
					<Button
						type="submit"
						variant="primary"
						className="shadow-glow-pink h-auto w-full rounded-[2rem] py-5 text-base font-black tracking-widest uppercase"
						loading={isLoading}
					>
						Sign Into Studio
					</Button>

					<div className="text-center">
						<p className="text-text-tertiary text-sm font-bold tracking-tight">
							New to the studio?{" "}
							<button
								onClick={() => navigate(ROUTES.AUTH.CONSUMER_SIGNUP)}
								className="text-accent-pink ml-1 font-black hover:underline"
							>
								Request Access
							</button>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
}
