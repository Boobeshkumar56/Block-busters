
import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Loader2, 
  MessageSquare, 
  Heart, 
  Calendar, 
  User, 
  Search, 
  Send, 
  Plus,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import GlassCard from "@/components/GlassCard";
import apiService from "@/lib/api";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  author: string;
  date: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  likes: number;
  comments: Comment[];
}

interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const Community = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [postsData, setPostsData] = useState<PostsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch posts on component mount and when page changes
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getCommunityPosts(currentPage, 10);
        if (response.success) {
          setPostsData(response);
        } else {
          toast.error("Failed to fetch community posts");
        }
      } catch (error) {
        console.error("Error fetching community posts:", error);
        toast.error("An error occurred while loading posts");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [currentPage]);
  
  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in both title and content fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await apiService.createCommunityPost(newPost);
      
      if (response.success) {
        // Update posts list with the new post
        if (postsData) {
          setPostsData({
            ...postsData,
            posts: [response.post, ...postsData.posts],
            total: postsData.total + 1
          });
        }
        
        toast.success("Post created successfully");
        setShowNewPostForm(false);
        setNewPost({ title: "", content: "" });
      } else {
        toast.error(response.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("An error occurred while creating your post");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleAddComment = async () => {
    if (!selectedPost || !newComment.trim()) {
      toast.error("Please write a comment before submitting");
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await apiService.commentOnPost(selectedPost.id, { content: newComment });
      
      if (response.success) {
        // Update selected post with the new comment
        const updatedPost = {
          ...selectedPost,
          comments: [...selectedPost.comments, response.comment]
        };
        
        setSelectedPost(updatedPost);
        
        // Also update the post in the main list
        if (postsData) {
          const updatedPosts = postsData.posts.map(post => 
            post.id === selectedPost.id ? updatedPost : post
          );
          
          setPostsData({
            ...postsData,
            posts: updatedPosts
          });
        }
        
        toast.success("Comment added successfully");
        setNewComment("");
      } else {
        toast.error(response.message || "Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("An error occurred while adding your comment");
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };
  
  const filterPosts = (posts: Post[]) => {
    if (!searchTerm.trim()) return posts;
    
    const term = searchTerm.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(term) || 
      post.content.toLowerCase().includes(term) ||
      post.author.toLowerCase().includes(term)
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link to="/" className="text-health-700 hover:text-health-800 inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Community Forum</h1>
        <p className="text-muted-foreground">
          Connect with others, share experiences, and find support on your health journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - Posts list or selected post */}
        <div className="lg:col-span-2">
          {!selectedPost ? (
            <GlassCard>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <h2 className="text-xl font-semibold mb-2 sm:mb-0">
                  Discussion Board
                </h2>
                
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 py-2 pr-3 text-sm rounded-lg border border-health-200 focus:outline-none focus:ring-2 focus:ring-health-400 w-full sm:w-auto"
                    />
                  </div>
                  
                  <button
                    onClick={() => setShowNewPostForm(true)}
                    className="btn-primary py-2 text-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    New Post
                  </button>
                </div>
              </div>
              
              {isLoading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-health-500 animate-spin" />
                </div>
              ) : postsData && postsData.posts.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {filterPosts(postsData.posts).map(post => (
                      <div 
                        key={post.id} 
                        className="p-4 bg-white rounded-lg border border-health-100 hover:border-health-200 transition-all cursor-pointer"
                        onClick={() => setSelectedPost(post)}
                      >
                        <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <User className="w-3 h-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center mr-4">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(post.date)}
                          </div>
                          <div className="flex items-center mr-4">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {post.comments.length} comments
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-3 h-3 mr-1" />
                            {post.likes} likes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {filterPosts(postsData.posts).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No posts match your search criteria.</p>
                    </div>
                  )}
                  
                  {!searchTerm && postsData.totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 rounded bg-health-100 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        
                        <div className="px-3 py-1">
                          Page {currentPage} of {postsData.totalPages}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, postsData.totalPages))}
                          disabled={currentPage === postsData.totalPages}
                          className="px-3 py-1 rounded bg-health-100 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No posts have been created yet.</p>
                  <button
                    onClick={() => setShowNewPostForm(true)}
                    className="inline-flex items-center text-health-700 hover:text-health-800"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Create the first post
                  </button>
                </div>
              )}
            </GlassCard>
          ) : (
            <GlassCard>
              <div className="mb-6">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-health-700 hover:text-health-800 inline-flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to all posts
                </button>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-2">{selectedPost.title}</h2>
                <div className="flex items-center text-sm text-muted-foreground mb-6">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-3">{selectedPost.author}</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(selectedPost.date)}</span>
                </div>
                
                <div className="py-4 border-y border-health-100 mb-6">
                  <p className="whitespace-pre-line">{selectedPost.content}</p>
                </div>
                
                <div className="flex items-center text-sm mb-8">
                  <button className="inline-flex items-center mr-4 text-muted-foreground hover:text-health-700">
                    <Heart className="w-4 h-4 mr-1" />
                    Like ({selectedPost.likes})
                  </button>
                  <div className="flex items-center text-muted-foreground">
                    <MessageSquare className="w-4 h-4 mr-1" />
                    {selectedPost.comments.length} comments
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Comments</h3>
                  
                  {selectedPost.comments.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {selectedPost.comments.map(comment => (
                        <div key={comment.id} className="bg-health-50 p-4 rounded-lg">
                          <p className="mb-2">{comment.content}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <div className="flex items-center mr-3">
                              <User className="w-3 h-3 mr-1" />
                              {comment.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(comment.date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4 mb-6">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                  
                  <div>
                    <div className="relative">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full p-3 rounded-lg border border-health-200 focus:outline-none focus:ring-2 focus:ring-health-400 resize-none min-h-[120px]"
                      />
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || submitting}
                        className="absolute bottom-3 right-3 p-2 rounded-full bg-health-500 text-white disabled:opacity-50"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
        
        {/* Sidebar */}
        <div>
          {showNewPostForm ? (
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Create New Post</h2>
                <button
                  onClick={() => setShowNewPostForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    className="health-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your thoughts, questions, or experiences..."
                    className="health-input min-h-[200px] resize-none"
                  />
                </div>
                
                <button
                  onClick={handleCreatePost}
                  className="btn-primary w-full mt-4 flex items-center justify-center"
                  disabled={!newPost.title.trim() || !newPost.content.trim() || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    "Post to Community"
                  )}
                </button>
              </div>
            </GlassCard>
          ) : (
            <>
              <GlassCard className="mb-6">
                <h3 className="font-medium mb-4">Community Guidelines</h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Be respectful and supportive of other community members.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Do not share personal medical information that could identify you.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Information shared is not a substitute for professional medical advice.
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Report any inappropriate content to moderators.
                  </li>
                </ul>
              </GlassCard>
              
              <GlassCard>
                <h3 className="font-medium mb-4">Popular Topics</h3>
                <div className="space-y-3">
                  <button className="text-sm w-full text-left hover:bg-health-50 p-2 rounded-lg transition-colors">
                    PCOS Management Strategies
                  </button>
                  <button className="text-sm w-full text-left hover:bg-health-50 p-2 rounded-lg transition-colors">
                    Menstrual Cycle Tracking Tips
                  </button>
                  <button className="text-sm w-full text-left hover:bg-health-50 p-2 rounded-lg transition-colors">
                    Nutrition & Diet Support
                  </button>
                  <button className="text-sm w-full text-left hover:bg-health-50 p-2 rounded-lg transition-colors">
                    Exercise & Fitness
                  </button>
                  <button className="text-sm w-full text-left hover:bg-health-50 p-2 rounded-lg transition-colors">
                    Mental Health & Wellness
                  </button>
                </div>
              </GlassCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
