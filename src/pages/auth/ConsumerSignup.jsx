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
		<div className="animate-in fade-in slide-in-from-right-8 duration-1000">
			{/* Header */}
			<div className="mb-10">
				<h2 className="text-text-primary text-5xl font-black tracking-tighter md:text-6xl">
					Join the Studio
				</h2>
				<p className="text-text-tertiary mt-4 text-lg font-bold tracking-tight">
					Create your account to start your journey.
				</p>
			</div>

			{/* Error Alert */}
			{errors.general && (
				<div className="bg-accent-magenta/5 border-accent-magenta/20 text-accent-magenta mb-8 rounded-2xl border p-5 text-sm font-bold">
					{errors.general}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-8">
				{/* Unique Role Selection */}
				<div className="space-y-4">
					<label className="text-text-muted ml-2 text-[10px] font-black tracking-[0.3em] uppercase">
						Choose Your Path
					</label>
					<RoleSelector
						value={formData.role}
						onChange={(role) => setFormData({...formData, role})}
					/>
				</div>

				{/* Form Fields */}
				<div className="space-y-6">
					<Input
						label="Full Name"
						type="text"
						placeholder="John Doe"
						value={formData.name}
						onChange={(e) => setFormData({...formData, name: e.target.value})}
						error={errors.name}
					/>

					<Input
						label="Email Address"
						type="email"
						placeholder="studio@VELORA.com"
						value={formData.email}
						onChange={(e) => setFormData({...formData, email: e.target.value})}
						error={errors.email}
					/>

					<div className="grid grid-cols-2 gap-4">
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

						<Input
							label="Confirm"
							type="password"
							placeholder="••••••••"
							value={formData.confirmPassword}
							onChange={(e) =>
								setFormData({...formData, confirmPassword: e.target.value})
							}
							error={errors.confirmPassword}
						/>
					</div>
				</div>

				{/* Submit & Redirect */}
				<div className="space-y-6 pt-4">
					<Button
						type="submit"
						variant="primary"
						className="shadow-glow-pink h-auto w-full rounded-[2rem] py-5 text-base font-black tracking-widest uppercase"
						loading={isLoading}
					>
						Create Studio Account
					</Button>

					<div className="text-center">
						<p className="text-text-tertiary text-sm font-bold tracking-tight">
							Already registered?{" "}
							<button
								onClick={() => navigate(ROUTES.AUTH.LOGIN)}
								className="text-accent-pink ml-1 font-black hover:underline"
							>
								Sign Into Studio
							</button>
						</p>
					</div>
				</div>
			</form>
		</div>
	);
}
