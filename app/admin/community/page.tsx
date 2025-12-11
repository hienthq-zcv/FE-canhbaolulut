"use client";

import { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Trash2,
  MessageSquare,
  Heart,
  RefreshCw,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// --- INTERFACES ---
interface Comment {
  id: string;
  user_name: string;
  content: string;
  created_at: string;
}

interface Post {
  id: string;
  user_name: string;
  content: string;
  image_url: string | null;
  location?: string;
  created_at: string;
  comments?: Comment[];
  likes?: number;
}

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          (post.location && post.location.toLowerCase().includes(query)) ||
          (post.content && post.content.toLowerCase().includes(query)) ||
          (post.user_name && post.user_name.toLowerCase().includes(query))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/community");
      const data = res.data;
      const postsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setPosts(postsData);
      setFilteredPosts(postsData);
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
      toast.error("Không thể tải bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (postId: string) => {
    setSelectedPostId(postId);
    setDeleteDialogOpen(true);
  };

  const handleDeletePost = async () => {
    if (!selectedPostId) return;

    setDeletingId(selectedPostId);
    try {
      const res = await apiClient.delete(`/community/${selectedPostId}`);
      if (res.status === 200) {
        setPosts((prev) => prev.filter((post) => post.id !== selectedPostId));
        toast.success("Xóa bài viết thành công");
      }
    } catch (error) {
      console.error("Lỗi xóa bài viết:", error);
      toast.error("Không thể xóa bài viết");
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setSelectedPostId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "HH:mm dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Quản lý Bảng tin Cộng đồng
          </h1>
          <p className="text-muted-foreground mt-1">
            Xem và quản lý các bài viết từ người dùng
          </p>
        </div>
        <Button variant="outline" onClick={fetchPosts} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Đang tải...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Làm mới
            </>
          )}
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng bình luận</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, post) => acc + (post.comments?.length || 0), 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt thích</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, post) => acc + (post.likes || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bài viết theo nội dung, địa điểm hoặc người đăng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Posts List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Đang tải...</p>
          </CardContent>
        </Card>
      ) : filteredPosts.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="py-12 text-center">
            <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 text-lg font-semibold">
              {searchQuery ? "Không tìm thấy bài viết" : "Chưa có bài viết nào"}
            </p>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác"
                : "Các bài viết từ người dùng sẽ hiển thị ở đây"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="border-2">
              <CardContent className="pt-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold">
                      {post.user_name ? post.user_name[0].toUpperCase() : "U"}
                    </div>
                    <div>
                      <h3 className="font-bold">{post.user_name}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        <span>{formatDate(post.created_at)}</span>
                        {post.location && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1 text-destructive font-medium">
                              <MapPin className="h-3 w-3" />
                              {post.location}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteClick(post.id)}
                    disabled={deletingId === post.id}
                    className="text-destructive hover:text-destructive hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="whitespace-pre-wrap leading-relaxed">{post.content}</p>
                </div>

                {/* Post Image */}
                {post.image_url && (
                  <div className="mb-4 rounded-lg overflow-hidden border">
                    <img
                      src={post.image_url}
                      alt="Post content"
                      className="w-full h-auto max-h-[400px] object-contain bg-muted"
                    />
                  </div>
                )}

                {/* Post Stats */}
                <div className="flex items-center gap-6 pt-4 border-t text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes || 0} lượt thích</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments?.length || 0} bình luận</span>
                  </div>
                </div>

                {/* Comments */}
                {post.comments && post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <p className="text-sm font-semibold">
                      Bình luận ({post.comments.length})
                    </p>
                    {post.comments
                      .sort(
                        (a, b) =>
                          new Date(a.created_at).getTime() -
                          new Date(b.created_at).getTime()
                      )
                      .map((comment) => (
                        <div key={comment.id} className="flex gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {comment.user_name
                              ? comment.user_name[0].toUpperCase()
                              : "U"}
                          </div>
                          <div className="flex-1">
                            <div className="bg-muted p-2.5 rounded-lg">
                              <p className="text-xs font-bold">{comment.user_name}</p>
                              <p className="text-sm">{comment.content}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground ml-2 mt-0.5 inline-block">
                              {formatDate(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeletePost}
        title="Xác nhận xóa bài viết"
        description="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
