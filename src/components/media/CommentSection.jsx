import {useState} from "react";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import {formatRelativeTime} from "@/lib/utils/helpers";
import {commentService} from "@/services/commentService";
import {useAuthStore} from "@/store/useAuthStore";

export default function CommentSection({mediaId, comments: initialComments = []}) {
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
		} catch {
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			<h3 className="text-sm font-semibold text-gray-900">
				Comments{comments.length > 0 && <span className="ml-1 text-gray-400 font-normal">({comments.length})</span>}
			</h3>

			<form onSubmit={handleSubmit} className="flex items-center gap-3">
				<Avatar src={user?.avatar} name={user?.name} size="sm" />
				<div className="flex flex-1 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 focus-within:border-[#FFB6C1] transition-colors">
					<input
						type="text"
						placeholder="Add a comment..."
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
					/>
					{newComment.trim() && (
						<Button type="submit" loading={isSubmitting} size="sm" className="shrink-0 !py-1 !px-3 !rounded-xl text-xs">
							Post
						</Button>
					)}
				</div>
			</form>

			<div className="space-y-3">
				{comments.length === 0 ? (
					<p className="py-4 text-center text-sm text-gray-400">No comments yet. Be the first!</p>
				) : (
					comments.map((comment) => (
						<div key={comment.id} className="flex gap-3">
							<Avatar src={comment.userAvatar} name={comment.userName} size="sm" />
							<div className="flex-1 rounded-2xl bg-gray-50 px-4 py-2.5">
								<div className="mb-1 flex items-center justify-between">
									<span className="text-xs font-semibold text-gray-900">{comment.userName}</span>
									<span className="text-[10px] text-gray-400">{formatRelativeTime(comment.createdAt)}</span>
								</div>
								<p className="text-sm leading-relaxed text-gray-700">{comment.content}</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
