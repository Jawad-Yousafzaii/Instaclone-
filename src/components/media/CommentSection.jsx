import {useState} from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import {formatRelativeTime} from "@/lib/utils/helpers";
import {commentService} from "@/services/commentService";
import {useAuthStore} from "@/store/useAuthStore";

export default function CommentSection({
	mediaId,
	comments: initialComments = [],
}) {
	const [comments, setComments] = useState(initialComments);
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const {user} = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!newComment.trim() || !user) return;

		setIsSubmitting(true);

		try {
			const comment = await commentService.addComment(mediaId, {
				userId: user.id,
				userName: user.name,
				userAvatar: user.avatar,
				content: newComment.trim(),
			});

			setComments([comment, ...comments]);
			setNewComment("");
		} catch (error) {
			console.error("Failed to add comment:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<h3 className="text-xl font-semibold text-black">
				Comments ({comments.length})
			</h3>

			{/* Comment Form */}
			<form onSubmit={handleSubmit} className="flex gap-3">
				<Avatar src={user?.avatar} name={user?.name} size="md" />

				<div className="flex-1 space-y-3">
					<textarea
						placeholder="Add a comment..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						rows={2}
						className="focus:border-accent-cyan/50 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-black transition-all placeholder:text-black/40 focus:bg-white/8 focus:outline-none"
					/>

					<div className="flex justify-end">
						<Button
							type="submit"
							disabled={!newComment.trim()}
							loading={isSubmitting}
							size="sm"
						>
							Post
						</Button>
					</div>
				</div>
			</form>

			{/* Comments List */}
			<div className="space-y-4">
				{comments.length === 0 ? (
					<p className="py-8 text-center text-black/50">
						No comments yet. Be the first to share your thoughts!
					</p>
				) : (
					comments.map((comment) => (
						<div key={comment.id} className="flex gap-3">
							<Avatar
								src={comment.userAvatar}
								name={comment.userName}
								size="md"
							/>

							<div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-4">
								<div className="mb-2 flex items-center justify-between">
									<span className="font-medium text-black">
										{comment.userName}
									</span>
									<span className="text-xs text-black/40">
										{formatRelativeTime(comment.createdAt)}
									</span>
								</div>

								<p className="text-black/80">{comment.content}</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
